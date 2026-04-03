-- Run in Supabase SQL editor to enable persistence from POST /api/review

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  input jsonb not null,
  risk_level text not null,
  recommendation text not null,
  signals jsonb not null default '[]'::jsonb,
  rules_version text not null,
  explanation text,
  model text
);

alter table public.reviews enable row level security;

-- MVP: allow service role only (API uses SUPABASE_SERVICE_ROLE_KEY)
-- For anon access later, add policies as needed.

comment on table public.reviews is 'Payment Risk Reviewer — stored review outcomes';
