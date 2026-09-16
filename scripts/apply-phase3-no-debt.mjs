// Explicitly authorized migration only; no fixture writes/deletion.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { connect } from './phase3-db.mjs';
if(process.env.PHASE3_APPLY_NO_DEBT!=='1') throw Error('Explicit migration opt-in required');
const db=await connect();
const snapshot=async()=> (await db.query("select coalesce(jsonb_agg(to_jsonb(t) order by id),'[]'::jsonb) rows from financial_transactions t")).rows[0].rows;
try {
 assert.equal(db.connection.stream.authorized,true);
 const before=await snapshot();
 await db.query(fs.readFileSync('supabase/migrations/0004_no_debt_collection.sql','utf8'));
 assert.deepEqual(await snapshot(),before,'Historical ledger changed');
 const r=(await db.query("select count(*)::int n from waste_batches where paid_at is not null")).rows[0];
 assert.equal(r.n,0,'Migration must not backfill historical payment evidence');
 console.log(JSON.stringify({applied:'0004_no_debt_collection.sql',tlsAuthorized:db.connection.stream.authorized,protocol:db.connection.stream.getProtocol(),historicalLedgerUnchanged:true,historicalPaidBackfill:0}));
} finally {await db.end();}
