import fs from 'node:fs';
import pg from 'pg';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
export const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i=l.indexOf('='); return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]; }));
export const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
export const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
export async function connect() {
  const hosts = env.SUPABASE_DB_HOST ? [env.SUPABASE_DB_HOST] : [`db.${ref}.supabase.co`, ...['ap-southeast-1','ap-southeast-2','ap-south-1','us-east-1','eu-central-1'].flatMap(r=>[0,1].map(n=>`aws-${n}-${r}.pooler.supabase.com`))];
  for (const host of hosts) {
    const db=new pg.Client({host,port:5432,user:host.startsWith('db.')?'postgres':`postgres.${ref}`,password:env.SUPABASE_PASSWORD,database:'postgres',ssl:{rejectUnauthorized:true, ...(env.SUPABASE_DB_SSL_CA ? {ca:fs.readFileSync(env.SUPABASE_DB_SSL_CA,'utf8')} : {})},connectionTimeoutMillis:6000});
    try { await db.connect(); return db; } catch { await db.end().catch(()=>{}); }
  }
  throw new Error('No direct/pooler Postgres connection succeeded; set SUPABASE_DB_HOST to project session pooler.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
 const db=await connect();
 try {
  if(process.argv[2]) throw new Error('This helper is read-only; migration application requires separate explicit approval.');
  await db.query('begin read only');
  console.log(JSON.stringify((await db.query("select current_database(), version(), (select count(*) from pg_tables where schemaname='public') as tables")).rows));
 } finally {await db.end();}
}
