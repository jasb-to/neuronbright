create type public.assurance_stage as enum ('Specified','Authorized','Implemented','Executing','Verified','Effective','Maintained');
create type public.assurance_state as enum ('GREEN','AMBER','RED','UNKNOWN','REVALIDATION_REQUIRED');

create table public.assurance_controls (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  ai_system_id uuid references public.ai_systems(id) on delete cascade,
  control_id uuid references public.controls(id) on delete cascade,
  external_id text not null,
  name text not null,
  target_percent numeric(5,2) not null default 100,
  state public.assurance_state not null default 'UNKNOWN',
  owner text,
  last_verified_at timestamptz,
  last_effective_at timestamptz,
  revalidation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assurance_events (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  assurance_control_id uuid not null references public.assurance_controls(id) on delete cascade,
  stage public.assurance_stage not null,
  actor text not null,
  basis text not null,
  evidence_ref text,
  observed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index assurance_controls_org_idx on public.assurance_controls(organisation_id);
create index assurance_events_control_idx on public.assurance_events(assurance_control_id, observed_at desc);
create index assurance_events_org_idx on public.assurance_events(organisation_id, observed_at desc);

alter table public.assurance_controls enable row level security;
alter table public.assurance_events enable row level security;

create policy "members manage assurance controls" on public.assurance_controls for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));
create policy "members manage assurance events" on public.assurance_events for all using (public.is_org_member(organisation_id)) with check (public.is_org_member(organisation_id));

create trigger assurance_controls_touch before update on public.assurance_controls for each row execute function public.touch_updated_at();

comment on table public.assurance_controls is 'Continuous assurance state for AI controls; distinct from policy/control design status.';
comment on table public.assurance_events is 'Evidence-backed lifecycle transitions for continuous control assurance.';
