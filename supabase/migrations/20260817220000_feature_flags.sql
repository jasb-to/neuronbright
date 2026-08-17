create table if not exists public.platform_feature_flags (
  key text primary key,
  label text not null,
  description text not null,
  enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.platform_feature_flag_changes (
  id uuid primary key default gen_random_uuid(),
  flag_key text not null references public.platform_feature_flags(key) on delete cascade,
  enabled boolean not null,
  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now()
);

insert into public.platform_feature_flags (key,label,description,enabled) values
('maintenance_mode','Maintenance mode','Place the application into controlled maintenance mode.',false),
('new_reporting','New reporting','Enable the latest governance reporting experience.',true),
('live_monitoring','Live monitoring','Enable live operational monitoring surfaces.',true),
('beta_features','Beta features','Expose features still under controlled rollout.',false)
on conflict (key) do nothing;

alter table public.platform_feature_flags enable row level security;
alter table public.platform_feature_flag_changes enable row level security;
