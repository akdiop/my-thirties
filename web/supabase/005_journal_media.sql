-- My Thirties : photos et mémos vocaux du journal, dans un espace de stockage privé.
-- Chaque fichier est rangé dans un dossier au nom de la propriétaire ; personne d'autre ne peut le lire.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('journal', 'journal', false, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'audio/mp4', 'audio/aac', 'audio/mpeg', 'audio/webm', 'audio/ogg'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "journal owner read" on storage.objects;
drop policy if exists "journal owner write" on storage.objects;
drop policy if exists "journal owner delete" on storage.objects;
create policy "journal owner read" on storage.objects for select to authenticated
  using (bucket_id = 'journal' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "journal owner write" on storage.objects for insert to authenticated
  with check (bucket_id = 'journal' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "journal owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'journal' and public.is_app_owner() and (storage.foldername(name))[1] = (select auth.uid())::text);
