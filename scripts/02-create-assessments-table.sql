-- Create assessments table
create table public.assessments (
  id uuid not null default extensions.uuid_generate_v4 (),
  shop_id uuid not null,
  answers jsonb not null,
  comments text null,
  photo_urls jsonb null,
  created_at timestamp without time zone null default now(),
  status text null default 'open'::text,
  constraint assessments_pkey primary key (id),
  constraint assessments_shop_id_fkey foreign KEY (shop_id) references shops (id),
  constraint assessments_status_check check (
    (
      status = any (
        array[
          'open'::text,
          'finished'::text,
          'send'::text,
          'reported'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

-- Enable RLS
alter table public.assessments enable row level security;

-- Create policies for authenticated users
create policy "Users can view all assessments" on public.assessments
  for select using (auth.role() = 'authenticated');

create policy "Users can insert assessments" on public.assessments
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update assessments" on public.assessments
  for update using (auth.role() = 'authenticated');
