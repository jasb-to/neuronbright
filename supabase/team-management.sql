create type public.invitation_status as enum ('Pending', 'Accepted', 'Revoked', 'Expired');

create table public.organisation_invitations (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  email text not null,
  role public.member_role not null default 'viewer',
  invited_by uuid references auth.users(id) on delete set null,
  status public.invitation_status not null default 'Pending',
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  unique (organisation_id, email)
);

create index organisation_invitations_org_idx on public.organisation_invitations(organisation_id, status);
create index organisation_invitations_email_idx on public.organisation_invitations(lower(email));

alter table public.organisation_invitations enable row level security;

create policy "organisation members can read invitations"
on public.organisation_invitations for select
using (public.is_org_member(organisation_id));

create policy "organisation admins can create invitations"
on public.organisation_invitations for insert to authenticated
with check (
  public.is_org_member(organisation_id)
  and exists (
    select 1 from public.memberships m
    where m.organisation_id = organisation_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  )
);

create policy "organisation admins can update invitations"
on public.organisation_invitations for update
using (
  exists (
    select 1 from public.memberships m
    where m.organisation_id = organisation_invitations.organisation_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from public.memberships m
    where m.organisation_id = organisation_invitations.organisation_id
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  )
);
