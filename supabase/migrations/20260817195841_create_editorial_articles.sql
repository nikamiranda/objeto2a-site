create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  published_slug text unique check (published_slug is null or published_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  draft jsonb not null default '{}'::jsonb,
  published jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  has_unpublished_changes boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_publish_state check (
    (published is null and published_slug is null and status = 'draft')
    or (published is not null and published_slug is not null and status = 'published')
  )
);

alter table public.articles enable row level security;

revoke all on table public.articles from anon, authenticated;
grant select, insert, update, delete on table public.articles to service_role;

create index if not exists articles_published_at_idx
  on public.articles (published_at desc)
  where published is not null;

create index if not exists articles_updated_at_idx
  on public.articles (updated_at desc);
