-- Create shops table
create table public.shops (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  brand text not null,
  location text not null,
  contact_email text not null,
  created_at timestamp without time zone null default now(),
  constraint shops_pkey primary key (id)
) TABLESPACE pg_default;

-- Enable RLS
alter table public.shops enable row level security;

-- Create policy for authenticated users
create policy "Users can view all shops" on public.shops
  for select using (auth.role() = 'authenticated');

create policy "Users can insert shops" on public.shops
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update shops" on public.shops
  for update using (auth.role() = 'authenticated');
