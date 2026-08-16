insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;

create policy "members can read organisation evidence"
on storage.objects for select
to authenticated
using (
  bucket_id = 'evidence'
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

create policy "members can upload organisation evidence"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'evidence'
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

create policy "members can update organisation evidence"
on storage.objects for update
to authenticated
using (
  bucket_id = 'evidence'
  and public.is_org_member((storage.foldername(name))[1]::uuid)
)
with check (
  bucket_id = 'evidence'
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);

create policy "members can delete organisation evidence"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'evidence'
  and public.is_org_member((storage.foldername(name))[1]::uuid)
);
