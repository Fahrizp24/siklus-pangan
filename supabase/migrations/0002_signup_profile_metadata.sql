-- Persist signup metadata passed through auth.user_metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, display_name, role, phone_number, address,
    is_organization, organization_capacity
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'role', 'beneficiary')::public.user_role,
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'address',
    coalesce((new.raw_user_meta_data ->> 'is_organization')::boolean, false),
    nullif(new.raw_user_meta_data ->> 'organization_capacity', '')::integer
  );
  return new;
end;
$$;
