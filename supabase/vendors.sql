create type public.vendor_risk as enum ('Low', 'Medium', 'High');
create type public.vendor_status as enum ('Approved', 'Review', 'Blocked');

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  name text not null,
  category text not null,
  owner text,
  risk public.vendor_risk not null default 'Medium',
  status public.vendor_status not null default 'Review',
  framework_coverage integer not null default 0 check (framework_coverage between 0 and 100),
  evidence_score integer not null default 0 check (evidence_score between 0 and 100),
  last_reviewed date,
  next_review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vendor_systems (
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  ai_system_id uuid not null references public.ai_systems(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (vendor_id, ai_system_id)
);

create index vendors_org_idx on public.vendors(organisation_id);
create index vendor_systems_system_idx on public.vendor_systems(ai_system_id);

alter table public.vendors enable row level security;
alter table public.vendor_systems enable row level security;

create policy "members manage vendors" on public.vendors for all
using (public.is_org_member(organisation_id))
with check (public.is_org_member(organisation_id));

create policy "members manage vendor system links" on public.vendor_systems for all
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and public.is_org_member(v.organisation_id)
  )
)
with check (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and public.is_org_member(v.organisation_id)
  )
);

create trigger vendors_touch before update on public.vendors for each row execute function public.touch_updated_at();
