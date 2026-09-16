// Run: node scripts/verify-phase3-readonly.mjs. SELECT only; no fixture writes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { connect } from './phase3-db.mjs';
const db = await connect();
try {
  await db.query('begin read only');
  const migration=['0003_phase3.sql','0004_no_debt_collection.sql'].map(f=>fs.readFileSync(`supabase/migrations/${f}`,'utf8')).join('\n');
  const latest=new Map([...migration.matchAll(/create (?:or replace )?function public\.(\w+)\([^]*?as \$\$([^]*?)\$\$;/g)].map(m=>[m[1],m]));
  const sourceChecks=[];
  for(const match of latest.values()) {
    const rows=(await db.query("select prosrc,proconfig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and proname=$1",[match[1]])).rows;
    assert.equal(rows.length,1); assert.equal(rows[0].prosrc.trim(),match[2].trim(),`deployed body differs: ${match[1]}`);
    assert(rows[0].proconfig.includes('search_path=public'));
    sourceChecks.push({name:match[1],sha256:createHash('sha256').update(rows[0].prosrc.trim()).digest('hex')});
  }
  assert.equal(sourceChecks.length,8);
  console.log(JSON.stringify({deployedFunctionBodiesMatch:sourceChecks},null,2));
  const claimSource=(await db.query("select prosrc from pg_proc where oid='public.claim_food_token(uuid,integer)'::regprocedure")).rows[0].prosrc;
  const mealExpression=claimSource.match(/meal_slot:=(case[^]*?end);/)[1];
  const boundaries=[['2026-09-16T03:59:59Z',null],['2026-09-16T04:00:00Z','lunch'],['2026-09-16T06:59:59Z','lunch'],['2026-09-16T07:00:00Z',null],['2026-09-16T10:00:00Z','dinner'],['2026-09-16T12:59:59Z','dinner'],['2026-09-16T13:00:00Z',null],['2026-09-16T16:59:59Z',null],['2026-09-16T17:00:00Z',null]];
  for(const [instant,expected] of boundaries) {
    const row=(await db.query(`select ${mealExpression} slot,t::date::text as day from (select $1::timestamptz at time zone 'Asia/Jakarta' t) x`,[instant])).rows[0];
    assert.equal(row.slot,expected); assert.equal(row.day,instant==='2026-09-16T17:00:00Z'?'2026-09-17':'2026-09-16');
  }
  console.log(`PASS: ${boundaries.length} deterministic meal/day boundaries from deployed SQL expression; no production clock change.`);
  const functions = (await db.query("select p.proname, p.prosecdef, has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute, has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('claim_food_token','create_waste_batch','process_waste_handover','submit_dispute_strike','collect_food_claim') order by 1")).rows;
  assert.equal(functions.length, 5);
  for (const f of functions) { assert(f.prosecdef); assert(!f.anon_execute); assert(f.authenticated_execute); }
  const rls = (await db.query("select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relname in ('profiles','food_listings','food_claims','strike_disputes','waste_batches','financial_transactions','donor_subsidies') order by 1")).rows;
  assert.equal(rls.length, 7); assert(rls.every(r => r.relrowsecurity));
  const listing = (await db.query('select id,status,remaining_portions from food_listings where id=$1',['2a02ea19-32b6-43ac-b4d2-71c2eeead97b'])).rows;
  const claim = (await db.query('select id,listing_id,portions_claimed,is_collected from food_claims where id=$1',['cdc6fe4c-5c90-4c88-8a20-911c2c54ad8f'])).rows;
  const batches = (await db.query('select id,billing_mode,weight_kg,rate_per_kg,is_collected,subsidy_amount,donor_charge,processor_credit from waste_batches where id=any($1::uuid[]) order by billing_mode',[['c2d5a6e6-f2ad-4866-8541-dcd101a0b797','35566cea-4830-4208-9403-1b220d192cb4']])).rows;
  const ledger = (await db.query('select waste_batch_id,type,purpose,amount from financial_transactions where waste_batch_id=any($1::uuid[]) order by waste_batch_id,purpose',[['c2d5a6e6-f2ad-4866-8541-dcd101a0b797','35566cea-4830-4208-9403-1b220d192cb4']])).rows;
  console.log(JSON.stringify({functions,rls,listing,claim,batches,ledger},null,2));
  console.log('PASS: read-only Phase3 RPC grants and seven RLS tables.');
  console.log(listing.length===1 && claim.length===1 && batches.length===2 && ledger.length===5 ? 'Historical fixtures present (not replayed).' : 'GAP: historical fixtures incomplete/absent; no cleanup inference.');
} finally { await db.end(); }
