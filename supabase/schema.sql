create extension if not exists "pgcrypto";

create type public.member_role as enum ('owner', 'admin', 'governance', 'reviewer', 'viewer');
create type public.ai_lifecycle_stage as enum ('Discover', 'Assess', 'Approve', 'Monitor', 'Review', 'Retire');
create type public.evidence_status as enum ('Verified', 'Pending', 'Missing');
create type public.control_status as enum ('Complete', 'In Progress', 'Missing');
create type public.remediation_status as enum ('Open', 'In progress', 'Complete');

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  size text,
  governance_lead text,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'viewer',
  created_at timestamptz not null default now(),
  unique (organisation_id, user_id)
);

create table public.ai_systems (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  provider text not null,
  model text,
  owner text,
  department text,
  risk_level text check (risk_level in ('Low', 'Medium', 'High')),
  status text check (status in ('Healthy', 'Review')) default 'Review',
  evidence_score integer not null default 0 check (evidence_score between 0 and 100),
  purpose text,
  data_types jsonb not null default '[]'::jsonb,
  lifecycle_stage public.ai_lifecycle_stage not null default 'Discover',
  approval_owner text,
  last_reviewed date,
  next_review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  ai_system_id uuid not null references public.ai_systems(id) on delete cascade,
  overall_score integer not null check (overall_score between 0 and 100),
  overall_level text not null check (overall_level in ('Low', 'Medium', 'High')),
  dimensions jsonb not null default '[]'::jsonb,
  assessed_at timestamptz not null default now()
);

create table public.controls (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  ai_system_id uuid references public.ai_systems(id) on delete cascade,
  external_id text not null,
  name text not null,
  description text,
  area text,
  required boolean not null default true,
  status public.control_status not null default 'Missing',
  evidence_required jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  ai_system_id uuid references public.ai_systems(id) on delete set null,
  control_id uuid references public.controls(id) on delete set null,
  name text not null,
  source text,
  storage_path text,
  status public.evidence_status not null default 'Pending',
  framework text,
  expires_at date,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.remediation_tasks (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  ai_system_id uuid references public.ai_systems(id) on delete set null,
  control_id uuid references public.controls(id) on delete set null,
  title text not null,
  description text,
  framework text,
  owner text,
  due_date date,
  priority text check (priority in ('Critical', 'High', 'Medium', 'Low')) default 'Medium',
  status public.remediation_status not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index memberships_user_idx on public.memberships(user_id);
create index ai_systems_org_idx on public.ai_systems(organisation_id);
create index risk_assessments_system_idx on public.risk_assessments(ai_system_id);
create index controls_org_idx on public.controls(organisation_id);
create index evidence_org_idx on public.evidence(organisation_id);
create index remediation_org_idx on public.remediation_tasks(organisation_id);
create index audit_org_idx on public.audit_log(organisation_id, created_at desc);

alter table public.organisations enable row level security;
alter table public.memberships enable row level security;
alter table public.ai_systems enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.controls enable row level security;
alter table public.evidence enable row level security;
alter table public.remediation_tasks enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.organisation_id = target_org and m.user_id = auth.uid()
  );
$$;

create policy "members can read their organisations" on public.organisations
  for select using (public.is_org_member(id));

create policy "members can read memberships" on public.memberships
  for select using (user_id = auth.uid() or public.is_org_member(organisation_id));

create policy "members manage ai systems" on public.ai_systems
  for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));

create policy "members manage risk assessments" on public.risk_assessments
  for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));

create policy "members manage controls" on public.controls
  for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));

create policy "members manage evidence" on public.evidence
  for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));

create policy "members manage remediation" on public.remediation_tasks
  for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));

create policy "members read audit log" on public.audit_log
  for select using (public.is_org_member(organisation_id));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organisations_touch before update on public.organisations for each row execute function public.touch_updated_at();
create trigger ai_systems_touch before update on public.ai_systems for each row execute function public.touch_updated_at();
create trigger controls_touch before update on public.controls for each row execute function public.touch_updated_at();
create trigger evidence_touch before update on public.evidence for each row execute function public.touch_updated_at();
create trigger remediation_touch before update on public.remediation_tasks for each row execute function public.touch_updated_at();
