-- Creative CV schema
-- Apply in the Supabase SQL editor, or via MCP, once a project is linked.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('job_seeker', 'recruiter')),
  company text,
  phone text,
  headline text,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  company text not null,
  location text not null,
  province text,
  type text not null,
  industry text not null,
  salary_min integer,
  salary_max integer,
  salary_label text,
  description text not null,
  requirements text[] not null default '{}',
  featured boolean not null default false,
  posted_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  cover_note text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (job_id, seeker_id)
);

create table if not exists public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  keywords text,
  industry text,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_cvs (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  file_url text,
  label text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  phone text,
  package_id text not null,
  addon_ids text[] not null default '{}',
  goals text,
  cv_file_name text,
  amount integer not null,
  currency text not null default 'ZAR',
  status text not null default 'pending_payment',
  paystack_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.generator_cvs (
  id uuid primary key default gen_random_uuid(),
  email text,
  payload jsonb not null,
  paid boolean not null default false,
  paystack_reference text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.job_alerts enable row level security;
alter table public.saved_cvs enable row level security;
alter table public.orders enable row level security;
alter table public.generator_cvs enable row level security;

create policy "public can read jobs"
  on public.jobs for select
  using (true);

create policy "recruiters insert own jobs"
  on public.jobs for insert
  with check (
    recruiter_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'recruiter'
    )
  );

create policy "users read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "users insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "users update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "seekers insert applications"
  on public.applications for insert
  with check (seeker_id = auth.uid());

create policy "seekers read own applications"
  on public.applications for select
  using (seeker_id = auth.uid());

create policy "recruiters read applications for own jobs"
  on public.applications for select
  using (
    exists (
      select 1 from public.jobs j
      where j.id = applications.job_id and j.recruiter_id = auth.uid()
    )
  );

create policy "seekers manage own alerts"
  on public.job_alerts for all
  using (seeker_id = auth.uid())
  with check (seeker_id = auth.uid());

create policy "seekers manage own saved cvs"
  on public.saved_cvs for all
  using (seeker_id = auth.uid())
  with check (seeker_id = auth.uid());

-- Orders and generator drafts are written by the service role from API routes.
create policy "no direct client order access"
  on public.orders for select
  using (false);

create policy "no direct client generator access"
  on public.generator_cvs for select
  using (false);
