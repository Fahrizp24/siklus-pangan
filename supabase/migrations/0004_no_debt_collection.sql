begin;
-- No backfill: historical invoice rows are NOT evidence of payment.
alter table public.waste_batches add column paid_at timestamptz;
comment on column public.waste_batches.paid_at is 'Set only after subsidy/deposit settlement under NO DEBT. NULL historical rows must not be reported as paid.';
create or replace function public.process_waste_handover(p_token text) returns jsonb language plpgsql security definer set search_path=public as $$
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
 if coalesce(donor.credit_balance,0)<charge then raise exception 'Insufficient donor balance'; end if;
 update public.donor_subsidies set remaining_amount=remaining_amount-subsidy where donor_id=donor.id;
 update public.profiles set credit_balance=coalesce(credit_balance,0)-charge where id=donor.id;
 update public.profiles set credit_balance=coalesce(credit_balance,0)+gross where id=processor.id;
 if charge>0 then insert into public.financial_transactions(user_id,waste_batch_id,amount,type,purpose,description) values(donor.id,b.id,-charge,'prepaid_deposit','donor_charge','Waste handover charge'); end if;
 insert into public.financial_transactions(user_id,waste_batch_id,amount,type,purpose,description) values(processor.id,b.id,gross,'prepaid_deposit','processor_incentive','Full Rp600/kg processor incentive');
 if subsidy>0 then insert into public.financial_transactions(user_id,waste_batch_id,amount,type,purpose,description) values(donor.id,b.id,subsidy,'prepaid_deposit','welcome_subsidy','Platform funded lifetime welcome subsidy'); end if;
 update public.waste_batches set processor_id=processor.id,is_collected=true,collected_at=now(),paid_at=now(),rate_per_kg=600,subsidy_amount=subsidy,donor_charge=charge,processor_credit=gross where id=b.id;
 return jsonb_build_object('id',b.id,'processor_credit',gross,'donor_charge',charge,'subsidy_amount',subsidy,'already_processed',false);
end $$;
create or replace function public.submit_dispute_strike(p_listing_id uuid,p_reason text) returns jsonb language plpgsql security definer set search_path=public as $$
declare p public.profiles; f public.food_listings; d public.strike_disputes;
begin
 select * into p from public.profiles where id=auth.uid() for update;
 if not found or p.role<>'beneficiary' or p.is_banned then raise exception 'Active beneficiary required'; end if;
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
-- Donor scans the beneficiary's token; never allows self-confirmation by claimant.
create function public.collect_food_claim(p_token text) returns jsonb language plpgsql security definer set search_path=public as $$
declare p public.profiles; c public.food_claims; f public.food_listings;
begin
 if auth.uid() is null or p_token is null or p_token!~'^[a-f0-9]{32}$' then raise exception 'Invalid collection token'; end if;
 -- KEY SHARE avoids conflicting with dispute's donor FK check; no financial/profile mutation.
 select * into p from public.profiles where id=auth.uid() for key share;
 if not found or p.role<>'donor' or p.is_banned then raise exception 'Active donor required'; end if;
 select * into c from public.food_claims where qr_token=p_token;
 if not found then raise exception 'Unknown collection token'; end if;
 select * into f from public.food_listings where id=c.listing_id for update;
 if not found or f.donor_id<>p.id then raise exception 'Listing donor required'; end if;
 select * into c from public.food_claims where id=c.id for update;
 if c.is_collected then return jsonb_build_object('id',c.id,'collected_at',c.collected_at,'already_collected',true); end if;
 if f.safe_until<=now() or f.status not in ('active','claimed') or f.food_condition<>'safe_for_consumption' then raise exception 'Listing unavailable'; end if;
 if not exists(select 1 from public.profiles where id=c.claimant_id and role='beneficiary' and not is_banned) then raise exception 'Active beneficiary required'; end if;
 update public.food_claims set is_collected=true,collected_at=now() where id=c.id returning * into c;
 return jsonb_build_object('id',c.id,'collected_at',c.collected_at,'already_collected',false);
end $$;
revoke all on function public.collect_food_claim(text) from public,anon;
grant execute on function public.collect_food_claim(text) to authenticated;
notify pgrst,'reload schema';
commit;
