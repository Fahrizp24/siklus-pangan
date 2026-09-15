// Apply Supabase migrations via direct Postgres connection.
// Reads .env.local; builds DSN from SUPABASE_PASSWORD + project ref.
// ponytail: dev-only pg client; swap to supabase CLI `db push` when CI exists.
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const root = process.cwd();
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const ref = env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];
if (!ref || !env.SUPABASE_PASSWORD) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_PASSWORD in .env.local");
  process.exit(1);
}

const dsn = `postgresql://postgres:${encodeURIComponent(env.SUPABASE_PASSWORD)}@db.${ref}.supabase.co:5432/postgres`;
const client = new pg.Client({ connectionString: dsn, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("Connected to Postgres.");

  const migrationFile = process.argv[2] ?? "supabase/migrations/0001_initial_schema.sql";
  const sql = fs.readFileSync(path.join(root, migrationFile), "utf8");
  await client.query(sql);
  console.log(`Applied: ${migrationFile}`);

  const { rows: tables } = await client.query(`
    select c.relname as table_name, c.relrowsecurity as rls
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
    order by c.relname;
  `);
  console.log("Tables + RLS status:");
  for (const t of tables) console.log(`  - ${t.table_name} (RLS: ${t.rls ? "ON" : "OFF"})`);

  const { rows: enums } = await client.query(`
    select t.typname, string_agg(e.enumlabel, ', ' order by e.enumsortorder) as values
    from pg_type t join pg_enum e on e.enumtypid = t.oid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
    group by t.typname order by t.typname;
  `);
  console.log("Enums:");
  for (const e of enums) console.log(`  - ${e.typname}: ${e.values}`);
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
