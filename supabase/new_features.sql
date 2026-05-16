-- Run this in Supabase SQL Editor

-- Saved tutors
create table if not exists public.student_saved_tutors (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  tutor_id uuid not null references public.tutor_profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(student_id, tutor_id)
);
alter table public.student_saved_tutors enable row level security;
drop policy if exists "student_manage_saved" on public.student_saved_tutors;
create policy "student_manage_saved" on public.student_saved_tutors
  for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());

-- Tutor reviews
create table if not exists public.tutor_reviews (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null,
  student_id uuid not null,
  rating int not null check (rating between 1 and 5),
  body text,
  reviewer_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tutor_id, student_id)
);
alter table public.tutor_reviews enable row level security;
drop policy if exists "anyone_read_reviews" on public.tutor_reviews;
drop policy if exists "student_write_review" on public.tutor_reviews;
drop policy if exists "student_update_review" on public.tutor_reviews;
create policy "anyone_read_reviews" on public.tutor_reviews for select using (true);
create policy "student_write_review" on public.tutor_reviews for insert to authenticated with check (student_id = auth.uid());
create policy "student_update_review" on public.tutor_reviews for update to authenticated using (student_id = auth.uid());

-- Messages between students and tutors
create table if not exists public.student_tutor_messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null,
  to_user_id uuid not null,
  from_role text not null check (from_role in ('student', 'tutor')),
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);
alter table public.student_tutor_messages enable row level security;
drop policy if exists "user_read_messages" on public.student_tutor_messages;
drop policy if exists "user_send_message" on public.student_tutor_messages;
drop policy if exists "user_mark_read" on public.student_tutor_messages;
create policy "user_read_messages" on public.student_tutor_messages
  for select to authenticated using (from_user_id = auth.uid() or to_user_id = auth.uid());
create policy "user_send_message" on public.student_tutor_messages
  for insert to authenticated with check (from_user_id = auth.uid());
create policy "user_mark_read" on public.student_tutor_messages
  for update to authenticated using (to_user_id = auth.uid());
