-- Live classes + paid access schema for Smart Tuition Finder.
-- Run this in Supabase SQL editor with a privileged role.

create extension if not exists pgcrypto;

create table if not exists public.tutor_student_subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  tutor_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  start_at timestamptz not null default now(),
  end_at timestamptz not null,
  billing_provider text not null default 'payhere',
  provider_order_id text,
  provider_payment_id text,
  amount_lkr numeric(12,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tutor_student_subscriptions_unique_order unique (provider_order_id)
);

create unique index if not exists tutor_student_subscriptions_active_unique
  on public.tutor_student_subscriptions(student_id, tutor_id)
  where status = 'active';

create index if not exists tutor_student_subscriptions_student_idx
  on public.tutor_student_subscriptions(student_id);

create index if not exists tutor_student_subscriptions_tutor_idx
  on public.tutor_student_subscriptions(tutor_id);

create table if not exists public.live_meetings (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'ended', 'cancelled')),
  room_key text not null unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint live_meetings_time_window check (ends_at > starts_at)
);

create index if not exists live_meetings_tutor_idx
  on public.live_meetings(tutor_id);

create index if not exists live_meetings_status_idx
  on public.live_meetings(status, starts_at desc);

create table if not exists public.live_meeting_participants (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('tutor', 'student')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  last_heartbeat_at timestamptz not null default now(),
  hand_raised boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint live_meeting_participants_unique_join unique (meeting_id, user_id)
);

create index if not exists live_meeting_participants_meeting_idx
  on public.live_meeting_participants(meeting_id, joined_at desc);

create table if not exists public.live_meeting_chat_messages (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists live_meeting_chat_messages_meeting_idx
  on public.live_meeting_chat_messages(meeting_id, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tutor_student_subscriptions_updated_at on public.tutor_student_subscriptions;
create trigger trg_tutor_student_subscriptions_updated_at
before update on public.tutor_student_subscriptions
for each row
execute function public.set_updated_at();

drop trigger if exists trg_live_meetings_updated_at on public.live_meetings;
create trigger trg_live_meetings_updated_at
before update on public.live_meetings
for each row
execute function public.set_updated_at();

drop trigger if exists trg_live_meeting_participants_updated_at on public.live_meeting_participants;
create trigger trg_live_meeting_participants_updated_at
before update on public.live_meeting_participants
for each row
execute function public.set_updated_at();

alter table public.tutor_student_subscriptions enable row level security;
alter table public.live_meetings enable row level security;
alter table public.live_meeting_participants enable row level security;
alter table public.live_meeting_chat_messages enable row level security;

create or replace function public.has_active_tutor_subscription(p_student_id uuid, p_tutor_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.tutor_student_subscriptions s
    where s.student_id = p_student_id
      and s.tutor_id = p_tutor_id
      and s.status = 'active'
      and s.start_at <= now()
      and s.end_at > now()
  );
$$;

drop policy if exists "students_view_own_subscriptions" on public.tutor_student_subscriptions;
create policy "students_view_own_subscriptions"
on public.tutor_student_subscriptions
for select
to authenticated
using (student_id = auth.uid());

drop policy if exists "tutors_view_own_subscribers" on public.tutor_student_subscriptions;
create policy "tutors_view_own_subscribers"
on public.tutor_student_subscriptions
for select
to authenticated
using (tutor_id = auth.uid());

drop policy if exists "tutor_insert_own_meetings" on public.live_meetings;
create policy "tutor_insert_own_meetings"
on public.live_meetings
for insert
to authenticated
with check (tutor_id = auth.uid());

drop policy if exists "tutor_manage_own_meetings" on public.live_meetings;
create policy "tutor_manage_own_meetings"
on public.live_meetings
for update
to authenticated
using (tutor_id = auth.uid())
with check (tutor_id = auth.uid());

drop policy if exists "tutor_delete_own_meetings" on public.live_meetings;
create policy "tutor_delete_own_meetings"
on public.live_meetings
for delete
to authenticated
using (tutor_id = auth.uid());

drop policy if exists "tutor_read_own_meetings" on public.live_meetings;
create policy "tutor_read_own_meetings"
on public.live_meetings
for select
to authenticated
using (tutor_id = auth.uid());

drop policy if exists "students_read_subscribed_tutor_meetings" on public.live_meetings;
create policy "students_read_subscribed_tutor_meetings"
on public.live_meetings
for select
to authenticated
using (
  has_active_tutor_subscription(auth.uid(), tutor_id)
);

drop policy if exists "participant_can_view_participants" on public.live_meeting_participants;
create policy "participant_can_view_participants"
on public.live_meeting_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.live_meeting_participants p
    where p.meeting_id = live_meeting_participants.meeting_id
      and p.user_id = auth.uid()
  )
);

drop policy if exists "tutor_can_join_own_meetings" on public.live_meeting_participants;
create policy "tutor_can_join_own_meetings"
on public.live_meeting_participants
for insert
to authenticated
with check (
  exists (
    select 1
    from public.live_meetings m
    where m.id = meeting_id
      and m.tutor_id = auth.uid()
  )
);

drop policy if exists "student_can_join_subscribed_meetings" on public.live_meeting_participants;
create policy "student_can_join_subscribed_meetings"
on public.live_meeting_participants
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.live_meetings m
    where m.id = meeting_id
      and has_active_tutor_subscription(auth.uid(), m.tutor_id)
      and m.status in ('scheduled', 'live')
  )
);

drop policy if exists "participant_can_update_self_presence" on public.live_meeting_participants;
create policy "participant_can_update_self_presence"
on public.live_meeting_participants
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "participants_can_read_chat_messages" on public.live_meeting_chat_messages;
create policy "participants_can_read_chat_messages"
on public.live_meeting_chat_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.live_meeting_participants p
    where p.meeting_id = live_meeting_chat_messages.meeting_id
      and p.user_id = auth.uid()
  )
);

drop policy if exists "participants_can_send_chat_messages" on public.live_meeting_chat_messages;
create policy "participants_can_send_chat_messages"
on public.live_meeting_chat_messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.live_meeting_participants p
    where p.meeting_id = live_meeting_chat_messages.meeting_id
      and p.user_id = auth.uid()
  )
);
