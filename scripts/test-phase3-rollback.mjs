// Privileged SQL integration only, not Auth/PostgREST or Server Action proof.
// Newly created fixtures only. Always ROLLBACK; never DELETE or COMMIT.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { connect } from './phase3-db.mjs';
if (process.env.PHASE3_ALLOW_ROLLBACK_FIXTURES !== '1') throw Error('Explicit rollback-fixture opt-in required');
const db=await connect(), users=[randomUUID(),randomUUID()], listings=[randomUUID(),randomUUID()];
try {
 await db.query('begin');
 await db.query("set local statement_timeout='10s'");
 const clock=(await db.query("select (now() at time zone 'Asia/Jakarta')::text t, ((now() at time zone 'Asia/Jakarta')::time >= time '11:00' and (now() at time zone 'Asia/Jakarta')::time < time '14:00') or ((now() at time zone 'Asia/Jakarta')::time >= time '17:00' and (now() at time zone 'Asia/Jakarta')::time < time '20:00') as in_meal")).rows[0];
 assert(clock.in_meal,'Outside actual meal window; no clock override permitted');
 for(const [i,id] of users.entries()) await db.query("insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3::jsonb)",[id,`rollback-${id}@example.com`,JSON.stringify({role:i?'beneficiary':'donor',display_name:'Phase3 rollback fixture'})]);
 for(const id of listings) await db.query("insert into food_listings(id,donor_id,title,portions,remaining_portions,storage_method,cooked_at,safe_until) values($1,$2,'Phase3 rollback fixture',2,2,'room_temperature',now()-interval '1 minute',now()+interval '1 hour')",[id,users[0]]);
 await db.query("select set_config('request.jwt.claim.sub',$1,true)",[users[1]]);
 await db.query('set local role authenticated');
 const claimed=(await db.query('select public.claim_food_token($1,1) result',[listings[0]])).rows[0].result;
 assert(claimed.id); assert.equal(claimed.portions_claimed,1);
 await db.query('savepoint quota');
 await assert.rejects(db.query('select public.claim_food_token($1,1)',[listings[1]]),/Meal quota exhausted/);
 await db.query('rollback to savepoint quota');
 await db.query('reset role');
 const stock=(await db.query('select id,remaining_portions from food_listings where id=any($1::uuid[])',[listings])).rows;
 assert.equal(stock.find(x=>x.id===listings[0]).remaining_portions,1);
 assert.equal(stock.find(x=>x.id===listings[1]).remaining_portions,2);
 assert.equal((await db.query('select count(*)::int n from food_claims where claimant_id=$1',[users[1]])).rows[0].n,1);
 console.log(JSON.stringify({result:'PASS',scope:'real deployed RPC; authenticated SQL role with privileged JWT context; sequential individual quota, not concurrent race or Server Action',clock}));
} finally {
 await db.query('rollback');
 const rows=(await db.query('select count(*)::int n from auth.users where id=any($1::uuid[])',[users])).rows[0].n;
 assert.equal(rows,0,'new fixture users must not persist');
 assert.equal((await db.query('select count(*)::int n from food_listings where id=any($1::uuid[])',[listings])).rows[0].n,0);
 console.log('PASS: new transaction fixtures absent after ROLLBACK; preexisting fixtures untouched.');
 await db.end();
}
