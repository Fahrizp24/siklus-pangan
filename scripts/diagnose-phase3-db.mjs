// Read-only TLS/connectivity probe. Never prints credentials or server error messages.
import pg from 'pg';
import fs from 'node:fs';
import { env, ref } from './phase3-db.mjs';
const hosts = env.SUPABASE_DB_HOST ? [env.SUPABASE_DB_HOST] : [`db.${ref}.supabase.co`, ...['ap-southeast-1','ap-southeast-2','ap-south-1','us-east-1','eu-central-1'].flatMap(r => [0,1].map(n => `aws-${n}-${r}.pooler.supabase.com`))];
console.log(JSON.stringify({passwordPresent:!!env.SUPABASE_PASSWORD,hostConfigured:!!env.SUPABASE_DB_HOST,caConfigured:!!env.SUPABASE_DB_SSL_CA}));
for (const [index,host] of hosts.entries()) {
 const db = new pg.Client({host,port:5432,user:host.startsWith('db.')?'postgres':`postgres.${ref}`,password:env.SUPABASE_PASSWORD,database:'postgres',ssl:{rejectUnauthorized:true,...(env.SUPABASE_DB_SSL_CA?{ca:fs.readFileSync(env.SUPABASE_DB_SSL_CA,'utf8')}:{})},connectionTimeoutMillis:6000});
 try { await db.connect(); await db.query('begin read only'); console.log(JSON.stringify({candidate:index,kind:host.startsWith('db.')?'direct':'pooler',connected:true,clientTLS:{authorized:db.connection.stream.authorized,protocol:db.connection.stream.getProtocol()},upstreamTLS:(await db.query('select ssl,version from pg_stat_ssl where pid=pg_backend_pid()')).rows})); }
 catch(e) { console.log(JSON.stringify({candidate:index,kind:host.startsWith('db.')?'direct':'pooler',code:e.code??'NO_CODE',category:/certificate/i.test(e.message)?'certificate':/timeout|terminated unexpectedly/i.test(e.message)?'connect-timeout':/tenant/i.test(e.message)?'tenant-not-found':'connection-failed'})); }
 finally { await db.end().catch(()=>{}); }
}
