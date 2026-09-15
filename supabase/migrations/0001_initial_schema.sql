-- ============================================================
-- SiklusPangan — Initial Schema (TCC 2026 UTM)
-- Enums, tables, constraints, indexes, RLS, triggers
-- ============================================================

-- 1. ENUMS ---------------------------------------------------
create type public.user_role as enum ('donor', 'beneficiary', 'processor', 'admin');
create type public.listing_status as enum ('active', 'claimed', 'expired', 'recalled');
create type public.food_condition as enum ('safe_for_consumption', 'not_safe');
create type public.storage_method as enum ('room_temperature', 'heated_display', 'refrigerated', 'sealed_container');
create type public.waste_category as enum ('bsf_maggot', 'poultry_fish', 'compost_biogas');
create type public.transaction_type as enum ('prepaid_deposit', 'monthly_invoice');

-- 2. PROFILES ------------------------------------------------
create table public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  role                  public.user_role not null default 'beneficiary',
  display_name          varchar(150) not null,
  phone_number          varchar(20),
  address               text,
  is_organization       boolean not null default false,
  organization_capacity integer check (organization_capacity is null or organization_capacity > 0),
  credit_balance        numeric(12,2) check (credit_balance is null or credit_balance >= 0) default 0,
  strikes_count         integer not null default 0 check (strikes_count >= 0),
  is_banned             boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- 3. FOOD_LISTINGS -------------------------------------------
create table public.food_listings (
  id                 uuid primary key default gen_random_uuid(),
  donor_id           uuid not null references public.profiles(id) on delete cascade,
  title              varchar(200) not null,
  image_url          text,
  portions           integer not null check (portions > 0),
  remaining_portions integer not null check (remaining_portions >= 0),
  risky_ingredients  text[] not null default '{}',
  dietary_tags       text[] not null default '{}',
  storage_method     public.storage_method not null,
  cooked_at          timestamptz not null,
  safe_until         timestamptz not null,
  handling_notes     text,
  food_condition     public.food_condition not null default 'safe_for_consumption',
  status             public.listing_status not null default 'active',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint remaining_within_total check (remaining_portions <= portions),
  constraint safe_after_cooked check (safe_until > cooked_at)
);

-- 4. FOOD_CLAIMS ---------------------------------------------
create table public.food_claims (
  id               uuid primary key default gen_random_uuid(),
  listing_id       uuid not null references public.food_listings(id) on delete cascade,
  claimant_id      uuid not null references public.profiles(id) on delete cascade,
  portions_claimed integer not null default 1 check (portions_claimed >= 1),
  qr_token         varchar(64) not null unique,
  is_collected     boolean not null default false,
  collected_at     timestamptz,
  created_at       timestamptz not null default now(),
  constraint one_claim_per_listing_per_claimant unique (listing_id, claimant_id),
  constraint collected_state_consistent check (
    (is_collected and collected_at is not null) or (not is_collected and collected_at is null)
  )
);

-- 5. STRIKE_DISPUTES -----------------------------------------
create table public.strike_disputes (
  id                  uuid primary key default gen_random_uuid(),
  donor_id            uuid not null references public.profiles(id) on delete cascade,
  listing_id          uuid not null references public.food_listings(id) on delete cascade,
  reported_by         uuid not null references public.profiles(id) on delete cascade,
  reason              text not null,
  donor_evidence_url  text,
  donor_statement     text,
  is_resolved         boolean not null default false,
  penalty_applied     boolean not null default false,
  created_at          timestamptz not null default now()
);

-- 6. WASTE_BATCHES -------------------------------------------
create table public.waste_batches (
  id                 uuid primary key default gen_random_uuid(),
  donor_id           uuid not null references public.profiles(id) on delete cascade,
  processor_id       uuid references public.profiles(id) on delete set null,
  image_url          text,
  target_category    public.waste_category not null,
  weight_kg          numeric(8,2) not null check (weight_kg > 0),
  rate_per_kg        numeric(8,2) not null default 0 check (rate_per_kg >= 0),
  is_collected       boolean not null default false,
  qr_handover_token  varchar(64) not null unique,
  collected_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint collected_requires_processor_and_time check (
    (is_collected and collected_at is not null and processor_id is not null)
    or not is_collected
  )
);

-- 7. FINANCIAL_TRANSACTIONS ----------------------------------
create table public.financial_transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  waste_batch_id  uuid references public.waste_batches(id) on delete set null,
  amount          numeric(12,2) not null check (amount <> 0),
  type            public.transaction_type not null,
  description     text,
  created_at      timestamptz not null default now()
);

-- 8. INDEXES -------------------------------------------------
create index idx_food_listings_status on public.food_listings(status);
create index idx_food_listings_donor on public.food_listings(donor_id);
create index idx_food_listings_safe_until on public.food_listings(safe_until);
create index idx_food_claims_listing on public.food_claims(listing_id);
create index idx_food_claims_claimant on public.food_claims(claimant_id);
create index idx_strike_disputes_donor on public.strike_disputes(donor_id);
create index idx_waste_batches_donor on public.waste_batches(donor_id);
create index idx_waste_batches_processor on public.waste_batches(processor_id);
create index idx_financial_transactions_user on public.financial_transactions(user_id);

-- 9. HELPERS (security definer) ------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_food_listings_updated_at
  before update on public.food_listings
  for each row execute function public.set_updated_at();

create trigger trg_waste_batches_updated_at
  before update on public.waste_batches
  for each row execute function public.set_updated_at();

-- 10. AUTO-CREATE PROFILE ON SIGNUP --------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'role', 'beneficiary')::public.user_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 11. GUARD: hanya admin boleh ubah kolom sensitif profil ----
create or replace function public.guard_profile_sensitive_columns()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role
       or new.strikes_count is distinct from old.strikes_count
       or new.is_banned is distinct from old.is_banned
       or new.credit_balance is distinct from old.credit_balance then
      raise exception 'Hanya admin yang dapat mengubah role, strikes, banned, atau credit_balance';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_guard_profile_columns
  before update on public.profiles
  for each row execute function public.guard_profile_sensitive_columns();

-- 12. PUBLIC PROFILE VIEW (kolom aman untuk radar) -----------
create view public.public_profiles as
  select id, display_name, role, is_organization, organization_capacity
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- 13. ROW LEVEL SECURITY -------------------------------------
alter table public.profiles              enable row level security;
alter table public.food_listings         enable row level security;
alter table public.food_claims           enable row level security;
alter table public.strike_disputes       enable row level security;
alter table public.waste_batches         enable row level security;
alter table public.financial_transactions enable row level security;

-- profiles
create policy "users view own profile" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "users insert own profile" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "users update own profile" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy "admins delete profiles" on public.profiles
  for delete to authenticated using (public.is_admin());

-- food_listings
create policy "active listings visible" on public.food_listings
  for select to authenticated
  using (status = 'active' or donor_id = auth.uid() or public.is_admin());
create policy "donors create listings" on public.food_listings
  for insert to authenticated
  with check (
    donor_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('donor','admin'))
  );
create policy "donors update own listings" on public.food_listings
  for update to authenticated
  using (donor_id = auth.uid() or public.is_admin())
  with check (donor_id = auth.uid() or public.is_admin());
create policy "donors delete own listings" on public.food_listings
  for delete to authenticated
  using (donor_id = auth.uid() or public.is_admin());

-- food_claims
create policy "participants view claims" on public.food_claims
  for select to authenticated
  using (
    claimant_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.food_listings fl where fl.id = listing_id and fl.donor_id = auth.uid())
  );
create policy "beneficiaries create claims" on public.food_claims
  for insert to authenticated
  with check (
    claimant_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('beneficiary','admin'))
    and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_banned)
    and exists (
      select 1 from public.food_listings fl
      where fl.id = listing_id
        and fl.status = 'active'
        and fl.food_condition = 'safe_for_consumption'
        and fl.safe_until > now()
        and fl.remaining_portions >= portions_claimed
    )
  );
create policy "donors mark claims collected" on public.food_claims
  for update to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.food_listings fl where fl.id = listing_id and fl.donor_id = auth.uid())
  )
  with check (
    public.is_admin()
    or exists (select 1 from public.food_listings fl where fl.id = listing_id and fl.donor_id = auth.uid())
  );
create policy "admins delete claims" on public.food_claims
  for delete to authenticated using (public.is_admin());

-- strike_disputes
create policy "parties view disputes" on public.strike_disputes
  for select to authenticated
  using (reported_by = auth.uid() or donor_id = auth.uid() or public.is_admin());
create policy "beneficiaries report disputes" on public.strike_disputes
  for insert to authenticated
  with check (
    reported_by = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('beneficiary','admin'))
  );
create policy "admins resolve disputes" on public.strike_disputes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete disputes" on public.strike_disputes
  for delete to authenticated using (public.is_admin());

-- waste_batches
create policy "parties view waste batches" on public.waste_batches
  for select to authenticated
  using (donor_id = auth.uid() or processor_id = auth.uid() or public.is_admin());
create policy "donors create waste batches" on public.waste_batches
  for insert to authenticated
  with check (
    donor_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('donor','admin'))
  );
create policy "parties update waste batches" on public.waste_batches
  for update to authenticated
  using (donor_id = auth.uid() or processor_id = auth.uid() or public.is_admin())
  with check (donor_id = auth.uid() or processor_id = auth.uid() or public.is_admin());
create policy "admins delete waste batches" on public.waste_batches
  for delete to authenticated using (public.is_admin());

-- financial_transactions (client read-only; tulis via service_role / admin)
create policy "users view own transactions" on public.financial_transactions
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
