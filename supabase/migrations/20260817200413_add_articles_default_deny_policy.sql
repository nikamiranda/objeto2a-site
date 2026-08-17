create policy "articles_server_only"
on public.articles
for all
to anon, authenticated
using (false)
with check (false);
