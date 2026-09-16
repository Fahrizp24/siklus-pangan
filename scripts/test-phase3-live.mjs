import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import ts from 'typescript';
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
import {connect,admin,env} from './phase3-db.mjs';
if (process.env.PHASE3_ALLOW_FIXTURE_WRITES !== '1') throw new Error('Live fixture writes disabled. Explicit approval required; fixtures are retained, never cleaned up.');
const db=await connect(), ids=[], evidence={}; let session;
function load(relative,mocks={}) {
 const filename=path.resolve(relative),mod=new Module(filename); mod.filename=filename; mod.paths=Module._nodeModulePaths(path.dirname(filename));
 const require=Module.createRequire(import.meta.url); mod.require=id=>Object.hasOwn(mocks,id)?mocks[id]:require(id);
 mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename); return mod.exports;
}
const mocks={'@/lib/supabase/server':{createClient:async()=>session}};
const food=load('src/actions/food.ts',{...mocks,'@/lib/rules/expiry':load('src/lib/rules/expiry.ts')});
const actions=load('src/actions/transactions.ts',mocks);
async function account(role,organization=false) {
 const email=`phase3-${randomUUID()}@example.com`,password=randomUUID()+'!Aa1';
 const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{role,display_name:'Phase3 isolated fixture',is_organization:organization,organization_capacity:organization?4:null}}); assert.ifError(error); ids.push(data.user.id);
 const client=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const login=await client.auth.signInWithPassword({email,password}); assert.ifError(login.error); return {id:data.user.id,client};
}
async function ok(promise){const r=await promise; assert.equal(r.success,true,JSON.stringify(r)); return r.data;}
async function no(promise){const r=await promise;assert.equal(r.success,false,JSON.stringify(r));}
async function listing(portions=10){return ok(food.createFoodListing({title:'Phase3 fixture',portions,cooked_at:new Date(Date.now()-60000).toISOString(),storage_method:'room_temperature',risky_ingredients:[],dietary_tags:[]}));}
try {
 assert.equal((await db.query("select count(*)::int n from pg_proc join pg_namespace n on n.oid=pronamespace where n.nspname='public' and proname in ('claim_food_token','create_waste_batch','process_waste_handover','submit_dispute_strike')")).rows[0].n,4);
 const donor=await account('donor'),org=await account('beneficiary',true),org2=await account('beneficiary',true),individual=await account('beneficiary'),processor=await account('processor'),other=await account('processor');
 evidence.users=ids;
 session=donor.client; const f=await listing(4); evidence.listing=f.id;
 assert.equal((await db.query('select remaining_portions from food_listings where id=$1',[f.id])).rows[0].remaining_portions,4);
 session=org.client; const c=await ok(actions.claimFoodToken({listing_id:f.id,portions:2})); evidence.claim=c.id;
 await no(actions.claimFoodToken({listing_id:f.id,portions:2}));
 await no(actions.submitDisputeStrike({listing_id:f.id,reason:'Belum diambil'}));
 session=donor.client; await ok(actions.collectFoodClaim({token:c.qr_token}));
 session=org.client;
 const dispute=await ok(actions.submitDisputeStrike({listing_id:f.id,reason:'Bau basi'})); evidence.dispute=dispute.id;
 assert.equal((await ok(actions.submitDisputeStrike({listing_id:f.id,reason:'retry'}))).id,dispute.id);
 const state=(await db.query('select f.status,p.strikes_count,d.penalty_applied,extract(epoch from d.response_deadline-d.created_at)::int seconds from food_listings f join profiles p on p.id=f.donor_id join strike_disputes d on d.listing_id=f.id where f.id=$1',[f.id])).rows[0];
 assert.deepEqual(state,{status:'recalled',strikes_count:0,penalty_applied:false,seconds:86400});
 await no(actions.claimFoodToken({listing_id:f.id,portions:1}));
 session=donor.client; const race=await listing(2); evidence.race_listing=race.id;
 const raced=await Promise.all([org,org2].map(u=>u.client.rpc('claim_food_token',{p_listing_id:race.id,p_portions:2})));
 assert.equal(raced.filter(r=>!r.error).length,1); assert.equal((await db.query('select remaining_portions from food_listings where id=$1',[race.id])).rows[0].remaining_portions,0);
 session=donor.client; const low=await listing(1);
 session=org.client;await no(actions.claimFoodToken({listing_id:low.id,portions:1}));
 session=donor.client; const meal1=await listing(),meal2=await listing(); session=individual.client;
 const time=(await db.query("select (now() at time zone 'Asia/Jakarta')::time::text t")).rows[0].t; const inMeal=(time>='11:00'&&time<'14:00')||(time>='17:00'&&time<'20:00');
 if(inMeal){await ok(actions.claimFoodToken({listing_id:meal1.id,portions:1})); await no(actions.claimFoodToken({listing_id:meal2.id,portions:1}));}else{await no(actions.claimFoodToken({listing_id:meal1.id,portions:1}));}
 evidence.individual_live_window=inMeal?'quota enforced':'outside-window rejected';
 for(const u of [donor,org,processor]) {
  assert((await u.client.from('food_claims').insert({listing_id:meal1.id,claimant_id:u.id,qr_token:randomUUID(),portions_claimed:1})).error);
  assert((await u.client.from('profiles').update({credit_balance:999999}).eq('id',u.id)).error);
  assert((await u.client.from('waste_batches').update({is_collected:true}).eq('donor_id',donor.id)).error);
 }
 const anon=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false}});
 assert((await anon.rpc('claim_food_token',{p_listing_id:meal1.id,p_portions:1})).error);
 const radar=await anon.from('food_radar').select('*').eq('id',meal1.id);assert.ifError(radar.error);assert.equal(radar.data.length,1);assert(!('donor_id' in radar.data[0]));
 assert.equal((await org.client.from('food_listings').select('*').eq('id',meal1.id)).data.length,0);
 session=donor.client;
 await no(actions.createWasteBatch({weight_kg:0,target_category:'bsf_maggot',billing_mode:'prepaid'}));
 await no(actions.createWasteBatch({weight_kg:1,target_category:'bsf_maggot',billing_mode:'prepaid',rate_per_kg:1}));
 const batch=await ok(actions.createWasteBatch({weight_kg:25,target_category:'bsf_maggot',billing_mode:'prepaid'}));evidence.prepaid_batch=batch.id;
 session=processor.client; await no(actions.processWasteHandover({token:batch.qr_handover_token}));
 assert.equal((await db.query('select remaining_amount::float v from donor_subsidies where donor_id=$1',[donor.id])).rows[0].v,12000);
 await db.query('update profiles set credit_balance=5000 where id=$1',[donor.id]);
 const handovers=await Promise.all([actions.processWasteHandover({token:batch.qr_handover_token}),actions.processWasteHandover({token:batch.qr_handover_token})]);
 for(const h of handovers)assert.equal(h.success,true);assert.equal(handovers.filter(h=>h.data.already_processed).length,1);
 assert.equal(handovers[0].data.processor_credit,15000);assert.equal(handovers[0].data.donor_charge,3000);assert.equal(handovers[0].data.subsidy_amount,12000);
 session=other.client;await no(actions.processWasteHandover({token:batch.qr_handover_token}));
 session=donor.client;const invoice=await ok(actions.createWasteBatch({weight_kg:2,target_category:'compost_biogas',billing_mode:'monthly_invoice'}));evidence.invoice_batch=invoice.id;
 session=processor.client;const billed=await ok(actions.processWasteHandover({token:invoice.qr_handover_token}));assert.equal(billed.donor_charge,1200);
 assert.equal((await db.query('select credit_balance::float v from profiles where id=$1',[donor.id])).rows[0].v,800);
 assert.equal((await db.query('select credit_balance::float v from profiles where id=$1',[processor.id])).rows[0].v,16200);
 assert.equal((await db.query("select count(*)::int n from financial_transactions where waste_batch_id=any($1::uuid[])",[[batch.id,invoice.id]])).rows[0].n,5);
 assert.equal((await db.query("select amount::float v from financial_transactions where waste_batch_id=$1 and type='prepaid_deposit' and purpose='donor_charge'",[invoice.id])).rows[0].v,-1200);
 await donor.client.auth.updateUser({data:{role:'admin',credit_balance:999999}});
 assert.equal((await db.query('select remaining_amount::float v from donor_subsidies where donor_id=$1',[donor.id])).rows[0].v,0);
 assert.equal((await db.query('select role from profiles where id=$1',[donor.id])).rows[0].role,'donor');
 // Invoice can consume subsidy, leaving donor deposit untouched.
 const donor2=await account('donor');session=donor2.client;
 const free=await ok(actions.createWasteBatch({weight_kg:10,target_category:'poultry_fish',billing_mode:'monthly_invoice'}));evidence.subsidized_invoice=free.id;
 session=processor.client;const paid=await ok(actions.processWasteHandover({token:free.qr_handover_token}));assert.equal(paid.donor_charge,0);assert.equal(paid.processor_credit,6000);assert.equal(paid.subsidy_amount,6000);
 console.log('PASS real Server Actions + Auth/PostgREST + SQL: food, organization stock race, meal gate, dispute, prepaid/invoice/subsidy, retry race, RLS, anonymity');
 console.log(JSON.stringify(evidence));
} finally {
 console.log('FIXTURES RETAINED (no cleanup):', JSON.stringify({ ...evidence, users: ids }));
 await db.end();
}
