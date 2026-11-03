-- My Thirties : sauvegarde automatique mensuelle (un fichier JSON par mois, les 12 derniers gardés),
-- dans un espace de stockage privé rangé au nom de la propriétaire ; personne d'autre ne peut le lire.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('backups', 'backups', false, 15728640, array['application/json'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "backups owner read" on storage.objects;
drop policy if exists "backups owner write" on storage.objects;
drop policy if exists "backups owner update" on storage.objects;
drop policy if exists "backups owner delete" on storage.objects;
create policy "backups owner read" on storage.objects for select to authenticated
  using (bucket_id = 'backups' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "backups owner write" on storage.objects for insert to authenticated
  with check (bucket_id = 'backups' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "backups owner update" on storage.objects for update to authenticated
  using (bucket_id = 'backups' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'backups' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "backups owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'backups' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
