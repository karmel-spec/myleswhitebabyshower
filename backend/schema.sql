-- The Story Garden — Supabase schema.
-- Paste this whole file into the Supabase SQL editor and click Run.

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  party text,
  cant_eat text,
  address text
);

create table book_claims (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_name text,
  title text not null
);

create table predictions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  arrival text,
  weight text,
  length text,
  hair text
);

create table guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message text not null,
  photo_url text
);

create table advice (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  message text not null
);

create table advice_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  advice_id uuid not null references advice(id) on delete cascade,
  message text not null
);

create table quiz_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  question int not null,
  side text not null check (side in ('a','b'))
);

create table album (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  caption text,
  photo_url text not null
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  party text,
  status text not null default 'await' check (status in ('coming','await','regret')),
  book text,
  address text,
  thank_you boolean not null default false
);

-- Row-level security: guests (anon) may drop things in the mailbox but never
-- read private data back out; only the signed-in hosts see everything.
alter table rsvps enable row level security;
alter table book_claims enable row level security;
alter table predictions enable row level security;
alter table guestbook enable row level security;
alter table advice enable row level security;
alter table advice_comments enable row level security;
alter table quiz_votes enable row level security;
alter table album enable row level security;
alter table guests enable row level security;

-- write-only for guests (hosts read later)
create policy "anon insert" on rsvps for insert to anon with check (true);
create policy "hosts read" on rsvps for select to authenticated using (true);

create policy "anon insert" on predictions for insert to anon with check (true);
create policy "hosts read" on predictions for select to authenticated using (true);

-- shared walls: guests write and read
create policy "anon insert" on book_claims for insert to anon with check (true);
create policy "anyone reads" on book_claims for select using (true);

create policy "anon insert" on guestbook for insert to anon with check (true);
create policy "anyone reads" on guestbook for select using (true);

create policy "anon insert" on advice for insert to anon with check (true);
create policy "anyone reads" on advice for select using (true);

create policy "anon insert" on advice_comments for insert to anon with check (true);
create policy "anyone reads" on advice_comments for select using (true);

create policy "anon insert" on quiz_votes for insert to anon with check (true);
create policy "anyone reads" on quiz_votes for select using (true);

create policy "anon insert" on album for insert to anon with check (true);
create policy "anyone reads" on album for select using (true);

-- hosts only
create policy "hosts all" on guests for all to authenticated using (true) with check (true);

-- photo storage: a public bucket guests can upload into
insert into storage.buckets (id, name, public) values ('album','album',true);
create policy "anon upload" on storage.objects for insert to anon
  with check (bucket_id = 'album');
create policy "host upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'album');
