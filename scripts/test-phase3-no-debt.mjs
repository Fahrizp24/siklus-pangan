// Privileged setup + authenticated SQL RPCs, not Auth/PostgREST. No persisted fixtures.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { connect } from './phase3-db.mjs';
if(process.env.PHASE3_ALLOW_ROLLBACK_FIXTURES!=='1') throw Error('Rollback fixture opt-in required');
const db=await connect(), ids=Array.from({length:4},()=>randomUUID());
const [donor,processor,beneficiary,other]=ids;
async function actor(id){await db.query('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id]);await db.query('set local role authenticated');}
async function denied(sql,params,pattern){await db.query('savepoint denied');await assert.rejects(db.query(sql,params),pattern);await db.query('rollback to savepoint denied');}
try{
 await db.query('begin'); await db.query("set local statement_timeout='10s'");
 if(process.argv.includes('--candidate')) await db.query(fs.readFileSync('supabase/migrations/0004_no_debt_collection.sql','utf8').replace(/^begin;|commit;\s*$/gm,''));
 for(const [i,id] of ids.entries()) await db.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)',[id,`rollback-${id}@example.com`,JSON.stringify({role:['donor','processor','beneficiary','donor'][i],display_name:'Rollback only',is_organization:i===2,organization_capacity:i===2?1:null})]);
 assert.equal(Number((await db.query('select remaining_amount from donor_subsidies where donor_id=$1',[donor])).rows[0].remaining_amount),12000);
 const batches=[];
 for(const mode of ['monthly_invoice','prepaid']){
  await actor(donor);
  batches.push((await db.query("select create_waste_batch(21,'compost_biogas',null,$1) r",[mode])).rows[0].r);
  await actor(processor);
  await denied('select process_waste_handover($1)',[batches.at(-1).qr_handover_token],/Insufficient donor balance/);
 }
 await db.query('reset role');
 assert.equal((await db.query('select count(*)::int n from financial_transactions where user_id=any($1::uuid[])',[ids])).rows[0].n,0);
 assert.equal(Number((await db.query('select remaining_amount from donor_subsidies where donor_id=$1',[donor])).rows[0].remaining_amount),12000);
 // Simulated trusted deposit; no payment provider/posting endpoint claimed.
 await db.query('update profiles set credit_balance=13200 where id=$1',[donor]);
 for(const b of batches){
  await actor(processor);
  const r=(await db.query('select process_waste_handover($1) r',[b.qr_handover_token])).rows[0].r;
  assert.equal(r.processor_credit,12600);assert.equal(r.already_processed,false);
  assert.equal((await db.query('select process_waste_handover($1) r',[b.qr_handover_token])).rows[0].r.already_processed,true);
 }
 await db.query('reset role');
 assert.equal(Number((await db.query('select credit_balance from profiles where id=$1',[donor])).rows[0].credit_balance),0);
 assert.equal(Number((await db.query('select credit_balance from profiles where id=$1',[processor])).rows[0].credit_balance),25200);
 assert.equal((await db.query("select count(*)::int n from financial_transactions where user_id=any($1::uuid[]) and type='monthly_invoice'",[ids])).rows[0].n,0);
 assert.equal((await db.query("select count(*)::int n from waste_batches where id=any($1::uuid[]) and paid_at is not null",[batches.map(b=>b.id)])).rows[0].n,2);
 await actor(donor);
 await denied('update profiles set credit_balance=999999 where id=$1',[donor],/permission denied/);
 const source=(await db.query("select prosrc from pg_proc where oid='public.submit_dispute_strike(uuid,text)'::regprocedure")).rows[0].prosrc;
 assert(source.indexOf('from public.profiles where id=auth.uid() for update') < source.indexOf('from public.food_listings where id=p_listing_id for update') && source.includes('from public.profiles where id=auth.uid() for update'),'dispute must lock reporter before listing');
 await db.query('reset role');
 const listing=randomUUID();
 await db.query("insert into food_listings(id,donor_id,title,portions,remaining_portions,storage_method,cooked_at,safe_until) values($1,$2,'Rollback',2,2,'room_temperature',now()-interval '1 minute',now()+interval '1 hour')",[listing,donor]);
 await actor(beneficiary);
 const claim=(await db.query('select claim_food_token($1,1) r',[listing])).rows[0].r;
 await denied('select submit_dispute_strike($1,$2)',[listing,'Basi'],/Collected claim required/);
 await actor(other);
 await denied('select collect_food_claim($1)',[claim.qr_token],/Listing donor required/);
 await actor(beneficiary);
 await denied('select collect_food_claim($1)',[claim.qr_token],/Active donor required/);
 await db.query('reset role');
 await db.query('savepoint unsafe');
 await db.query("update food_listings set cooked_at=now()-interval '2 hours',safe_until=now()-interval '1 minute' where id=$1",[listing]);
 await actor(donor);await denied('select collect_food_claim($1)',[claim.qr_token],/Listing unavailable/);
 await db.query('rollback to savepoint unsafe');
 await db.query("update food_listings set status='recalled' where id=$1",[listing]);
 await actor(donor);await denied('select collect_food_claim($1)',[claim.qr_token],/Listing unavailable/);
 await db.query('rollback to savepoint unsafe');
 await db.query('update profiles set is_banned=true where id=$1',[donor]);
 await actor(donor);await denied('select collect_food_claim($1)',[claim.qr_token],/Active donor required/);
 await db.query('rollback to savepoint unsafe');
 await actor(donor);
 const collected=(await db.query('select collect_food_claim($1) r',[claim.qr_token])).rows[0].r;
 assert.equal(collected.already_collected,false);
 const retry=(await db.query('select collect_food_claim($1) r',[claim.qr_token])).rows[0].r;
 assert.equal(retry.already_collected,true);assert.equal(retry.collected_at,collected.collected_at);
 await actor(beneficiary);
 const report=(await db.query('select submit_dispute_strike($1,$2) r',[listing,'Basi'])).rows[0].r;
 assert.equal((await db.query('select submit_dispute_strike($1,$2) r',[listing,'Basi'])).rows[0].r.id,report.id);
 await db.query('reset role');
 assert.equal((await db.query('select status from food_listings where id=$1',[listing])).rows[0].status,'recalled');
 console.log('PASS: owner collection, wrong owner/role denial, stable retry, collected-only dispute, recall and duplicate report; profile-before-listing source guard.');
 console.log('PASS: both billing modes reject insufficient funds atomically; subsidy once; full processor payment; deposit debited; retry idempotent; no invoice debt; client balance write denied.');
}finally{
 await db.query('rollback');
 assert.equal((await db.query('select count(*)::int n from auth.users where id=any($1::uuid[])',[ids])).rows[0].n,0);
 console.log('PASS: rollback fixture users absent; existing fixtures untouched.');await db.end();
}
