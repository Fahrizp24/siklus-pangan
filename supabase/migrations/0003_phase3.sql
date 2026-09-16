begin;
-- Monetary subsidy is separate from deposits: never overwrite existing balances.
create table public.donor_subsidies (
 donor_id uuid primary key references public.profiles(id) on delete cascade,
 granted_amount numeric(12,2) not null default 12000 check(granted_amount=12000),
 remaining_amount numeric(12,2) not null default 12000 check(remaining_amount between 0 and 12000),
 granted_at timestamptz not null default now()
);
alter table public.donor_subsidies enable row level security;
create policy "donor reads subsidy" on public.donor_subsidies for select to authenticated using(donor_id=auth.uid() or public.is_admin());
grant select on public.donor_subsidies to authenticated;
revoke all on public.donor_subsidies from anon;
revoke insert,update,delete on public.donor_subsidies from authenticated;
insert into public.donor_subsidies(donor_id) select id from public.profiles where role='donor';
create function public.grant_donor_subsidy() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.role='donor' then insert into public.donor_subsidies(donor_id) values(new.id) on conflict do nothing; end if;
 return new;
end $$;
create trigger donor_signup_subsidy after insert on public.profiles for each row execute function public.grant_donor_subsidy();
-- Prevent auth metadata selecting admin or later changing financial/quota identity.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if coalesce(new.raw_user_meta_data->>'role','beneficiary') not in ('donor','beneficiary','processor') then raise exception 'Invalid signup role'; end if;
 insert into public.profiles(id,display_name,role,phone_number,address,is_organization,organization_capacity)
 values(new.id,coalesce(new.raw_user_meta_data->>'display_name',split_part(new.email,'@',1)),coalesce(new.raw_user_meta_data->>'role','beneficiary')::public.user_role,new.raw_user_meta_data->>'phone_number',new.raw_user_meta_data->>'address',coalesce((new.raw_user_meta_data->>'is_organization')::boolean,false),nullif(new.raw_user_meta_data->>'organization_capacity','')::integer);
 return new;
end $$;
-- Column privileges, rather than a security-definer trigger, protect sensitive values.
drop trigger trg_guard_profile_columns on public.profiles;
revoke insert,update,delete on public.profiles from authenticated,anon;
grant update(display_name,phone_number,address) on public.profiles to authenticated;
revoke all on public.public_profiles from anon,authenticated;
revoke insert,update,delete on public.food_claims,public.strike_disputes,public.waste_batches,public.financial_transactions from authenticated,anon;
revoke update,delete on public.food_listings from authenticated,anon;
-- Keep FHR-10 session insert, but enforce expiry/stock/role in DB as well.
create function public.guard_food_insert() returns trigger language plpgsql set search_path=public as $$
declare risk boolean; hours integer;
begin
 if current_user in ('authenticated','anon') then
  if not exists(select 1 from public.profiles where id=auth.uid() and id=new.donor_id and role='donor' and not is_banned) then raise exception 'Active donor required'; end if;
  select exists(select 1 from unnest(new.risky_ingredients) i where lower(i) similar to '%(santan|susu|milk|coconut|mayo|mayones|seafood|udang|ikan|telur|egg|daging_cincang)%') into risk;
  hours:=case new.storage_method when 'heated_display' then case when risk then 4 else 6 end when 'refrigerated' then case when risk then 6 else 8 end when 'sealed_container' then case when risk then 3 else 5 end else case when risk then 2 else 4 end end;
  new.safe_until:=new.cooked_at+make_interval(hours=>hours);
  if new.cooked_at>now() or new.safe_until<=now() then raise exception 'Unsafe cooking time'; end if;
  new.remaining_portions:=new.portions; new.status:='active'; new.food_condition:='safe_for_consumption';
 end if;
 return new;
end $$;
create trigger guard_food_insert before insert on public.food_listings for each row execute function public.guard_food_insert();
-- No public donor identifiers: feed is a deliberately limited projection.
drop policy "active listings visible" on public.food_listings;
create policy "owners read listings" on public.food_listings for select to authenticated using(donor_id=auth.uid() or public.is_admin());
create view public.food_radar as select id,title,image_url,remaining_portions,risky_ingredients,dietary_tags,storage_method,cooked_at,safe_until,handling_notes from public.food_listings where status='active' and food_condition='safe_for_consumption' and safe_until>now() and remaining_portions>0;
grant select on public.food_radar to anon,authenticated;
alter table public.food_claims add column meal_date date, add column meal_window text check(meal_window in ('lunch','dinner'));
create index claim_meal_quota on public.food_claims(claimant_id,meal_date,meal_window);
alter table public.strike_disputes add column response_deadline timestamptz not null default(now()+interval '24 hours');
create unique index dispute_reporter_listing on public.strike_disputes(listing_id,reported_by);
alter table public.waste_batches alter column rate_per_kg set default 600;
alter table public.waste_batches add column billing_mode text not null default 'prepaid' check(billing_mode in ('prepaid','monthly_invoice')),
 add column subsidy_amount numeric(12,2) not null default 0 check(subsidy_amount>=0),
 add column donor_charge numeric(12,2) not null default 0 check(donor_charge>=0),
 add column processor_credit numeric(12,2) not null default 0 check(processor_credit>=0);
-- Existing enum kept; purpose explicitly differentiates incentive/subsidy/debit.
alter table public.financial_transactions add column purpose text check(purpose in ('donor_charge','processor_incentive','welcome_subsidy'));
create unique index handover_ledger_once on public.financial_transactions(waste_batch_id,purpose) where purpose is not null;
create function public.claim_food_token(p_listing_id uuid,p_portions integer) returns jsonb language plpgsql security definer set search_path=public as $$
declare p public.profiles; f public.food_listings; c public.food_claims; t timestamp:=now() at time zone 'Asia/Jakarta'; meal_slot text; used integer;
begin
 select * into p from public.profiles where id=auth.uid() for update;
 if not found or p.role<>'beneficiary' or p.is_banned then raise exception 'Active beneficiary required'; end if;
 if p_portions is null or p_portions<1 then raise exception 'Invalid portions'; end if;
 select * into f from public.food_listings where id=p_listing_id for update;
 if not found or f.status<>'active' or f.food_condition<>'safe_for_consumption' or f.safe_until<=now() then raise exception 'Listing unavailable'; end if;
 if p.is_organization then
  if p.organization_capacity is null or f.remaining_portions*2::bigint<p.organization_capacity or p_portions>p.organization_capacity then raise exception 'Organization threshold/capacity exceeded'; end if;
 else
  meal_slot:=case when t::time>='11:00' and t::time<'14:00' then 'lunch' when t::time>='17:00' and t::time<'20:00' then 'dinner' end;
  if meal_slot is null or p_portions<>1 then raise exception 'Outside meal meal_slot or individual portion limit'; end if;
  select coalesce(sum(portions_claimed),0) into used from public.food_claims where claimant_id=p.id and (created_at at time zone 'Asia/Jakarta')::date=t::date and ((meal_slot='lunch' and (created_at at time zone 'Asia/Jakarta')::time>='11:00' and (created_at at time zone 'Asia/Jakarta')::time<'14:00') or (meal_slot='dinner' and (created_at at time zone 'Asia/Jakarta')::time>='17:00' and (created_at at time zone 'Asia/Jakarta')::time<'20:00'));
  if used>=1 then raise exception 'Meal quota exhausted'; end if;
 end if;
 if p_portions>f.remaining_portions then raise exception 'Insufficient portions'; end if;
 insert into public.food_claims(listing_id,claimant_id,portions_claimed,qr_token,meal_date,meal_window) values(f.id,p.id,p_portions,replace(gen_random_uuid()::text,'-',''),t::date,meal_slot) returning * into c;
 update public.food_listings set remaining_portions=remaining_portions-p_portions,status=case when remaining_portions=p_portions then 'claimed'::public.listing_status else status end where id=f.id;
 return jsonb_build_object('id',c.id,'qr_token',c.qr_token,'portions_claimed',c.portions_claimed);
end $$;
create function public.create_waste_batch(p_weight_kg numeric,p_target_category public.waste_category,p_image_url text,p_billing_mode text) returns jsonb language plpgsql security definer set search_path=public as $$
declare b public.waste_batches;
begin
 if not exists(select 1 from public.profiles where id=auth.uid() and role='donor' and not is_banned) then raise exception 'Active donor required'; end if;
 if p_weight_kg is null or p_weight_kg<=0 or p_weight_kg>999999.99 or p_weight_kg<>round(p_weight_kg,2) or p_weight_kg::text in ('NaN','Infinity','-Infinity') or p_billing_mode is null or p_billing_mode not in ('prepaid','monthly_invoice') or p_target_category is null or (p_image_url is not null and (length(p_image_url)>2048 or p_image_url!~'^https?://')) then raise exception 'Invalid waste data'; end if;
 insert into public.waste_batches(donor_id,weight_kg,target_category,image_url,billing_mode,rate_per_kg,qr_handover_token) values(auth.uid(),p_weight_kg,p_target_category,p_image_url,p_billing_mode,600,replace(gen_random_uuid()::text,'-','')) returning * into b;
 return jsonb_build_object('id',b.id,'qr_handover_token',b.qr_handover_token,'rate_per_kg',b.rate_per_kg);
end $$;
create function public.process_waste_handover(p_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare b public.waste_batches; donor public.profiles; processor public.profiles; gross numeric; subsidy numeric; charge numeric;
begin
 if auth.uid() is null or p_token is null or p_token!~'^[a-f0-9]{32}$' then raise exception 'Invalid handover'; end if;
 select * into b from public.waste_batches where qr_handover_token=p_token for update;
 if not found then raise exception 'Unknown handover'; end if;
 -- Consistent profile lock order prevents deadlocks between concurrent batches.
 perform id from public.profiles where id in (b.donor_id,auth.uid()) order by id for update;
 select * into processor from public.profiles where id=auth.uid();
 select * into donor from public.profiles where id=b.donor_id;
 if processor.role<>'processor' or processor.is_banned or donor.role<>'donor' or donor.is_banned then raise exception 'Active participants required'; end if;
 if b.is_collected then
  if b.processor_id<>auth.uid() then raise exception 'Already collected by another processor'; end if;
  return jsonb_build_object('id',b.id,'processor_credit',b.processor_credit,'donor_charge',b.donor_charge,'subsidy_amount',b.subsidy_amount,'already_processed',true);
 end if;
 -- All new handovers use fixed user-approved tariff, never QR/client amounts.
 gross:=round(b.weight_kg*600,2);
 select least(remaining_amount,gross) into subsidy from public.donor_subsidies where donor_id=donor.id for update;
 subsidy:=coalesce(subsidy,0); charge:=gross-subsidy;
 if b.billing_mode='prepaid' and coalesce(donor.credit_balance,0)<charge then raise exception 'Insufficient donor balance'; end if;
 update public.donor_subsidies set remaining_amount=remaining_amount-subsidy where donor_id=donor.id;
 if b.billing_mode='prepaid' then update public.profiles set credit_balance=coalesce(credit_balance,0)-charge where id=donor.id; end if;
 update public.profiles set credit_balance=coalesce(credit_balance,0)+gross where id=processor.id;
 if charge>0 then insert into public.financial_transactions(user_id,waste_batch_id,amount,type,purpose,description) values(donor.id,b.id,-charge,case when b.billing_mode='prepaid' then 'prepaid_deposit'::public.transaction_type else 'monthly_invoice'::public.transaction_type end,'donor_charge','Waste handover charge'); end if;
 insert into public.financial_transactions(user_id,waste_batch_id,amount,type,purpose,description) values(processor.id,b.id,gross,'prepaid_deposit','processor_incentive','Full Rp600/kg processor incentive');
 if subsidy>0 then insert into public.financial_transactions(user_id,waste_batch_id,amount,type,purpose,description) values(donor.id,b.id,subsidy,'prepaid_deposit','welcome_subsidy','Platform funded lifetime welcome subsidy'); end if;
 update public.waste_batches set processor_id=processor.id,is_collected=true,collected_at=now(),rate_per_kg=600,subsidy_amount=subsidy,donor_charge=charge,processor_credit=gross where id=b.id;
 return jsonb_build_object('id',b.id,'processor_credit',gross,'donor_charge',charge,'subsidy_amount',subsidy,'already_processed',false);
end $$;
create function public.submit_dispute_strike(p_listing_id uuid,p_reason text) returns jsonb language plpgsql security definer set search_path=public as $$
declare f public.food_listings; d public.strike_disputes;
begin
 if not exists(select 1 from public.profiles where id=auth.uid() and role='beneficiary' and not is_banned) then raise exception 'Active beneficiary required'; end if;
 if p_reason is null or length(trim(p_reason)) not between 1 and 2000 then raise exception 'Invalid reason'; end if;
 select * into f from public.food_listings where id=p_listing_id for update;
 if not found or f.safe_until<=now() then raise exception 'Report must precede safe_until'; end if;
 if not exists(select 1 from public.food_claims where listing_id=f.id and claimant_id=auth.uid() and is_collected) then raise exception 'Collected claim required'; end if;
 select * into d from public.strike_disputes where listing_id=f.id and reported_by=auth.uid();
 if found then return jsonb_build_object('id',d.id,'response_deadline',d.response_deadline); end if;
 insert into public.strike_disputes(donor_id,listing_id,reported_by,reason,response_deadline) values(f.donor_id,f.id,auth.uid(),trim(p_reason),now()+interval '24 hours') returning * into d;
 update public.food_listings set status='recalled' where id=f.id;
 return jsonb_build_object('id',d.id,'response_deadline',d.response_deadline);
end $$;
revoke all on function public.claim_food_token(uuid,integer),public.create_waste_batch(numeric,public.waste_category,text,text),public.process_waste_handover(text),public.submit_dispute_strike(uuid,text) from public,anon;
grant execute on function public.claim_food_token(uuid,integer),public.create_waste_batch(numeric,public.waste_category,text,text),public.process_waste_handover(text),public.submit_dispute_strike(uuid,text) to authenticated;
notify pgrst,'reload schema';
commit;
