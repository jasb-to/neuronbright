create or replace function public.bootstrap_organisation(
  organisation_name text default 'NEURONBRIGHT',
  organisation_industry text default 'AI & Technology',
  organisation_size text default '1–5,000 employees'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_org uuid;
  new_org uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select organisation_id into existing_org
  from public.memberships
  where user_id = auth.uid()
  order by created_at
  limit 1;

  if existing_org is not null then
    return existing_org;
  end if;

  insert into public.organisations (name, industry, size, governance_lead, contact_email)
  values (
    coalesce(nullif(trim(organisation_name), ''), 'NEURONBRIGHT'),
    organisation_industry,
    organisation_size,
    coalesce(auth.jwt() ->> 'email', 'Governance Team'),
    auth.jwt() ->> 'email'
  )
  returning id into new_org;

  insert into public.memberships (organisation_id, user_id, role)
  values (new_org, auth.uid(), 'owner');

  return new_org;
end;
$$;

grant execute on function public.bootstrap_organisation(text, text, text) to authenticated;
