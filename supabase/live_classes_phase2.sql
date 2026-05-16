-- Phase 2+ schema upgrades for final-project live classes.

alter table public.live_meetings
  add column if not exists waiting_room_enabled boolean not null default true,
  add column if not exists is_locked boolean not null default false,
  add column if not exists passcode_hash text,
  add column if not exists secure_join_token text,
  add column if not exists provider_name text not null default 'mesh',
  add column if not exists provider_room_id text;

alter table public.live_meeting_participants
  add column if not exists is_muted boolean not null default false,
  add column if not exists is_removed boolean not null default false,
  add column if not exists can_share_screen boolean not null default true,
  add column if not exists role_label text;

create table if not exists public.live_meeting_waiting_room (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null,
  note text not null default '',
  unique (meeting_id, user_id)
);

create table if not exists public.live_meeting_reactions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check (length(trim(emoji)) between 1 and 12),
  created_at timestamptz not null default now()
);

create table if not exists public.live_meeting_polls (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_meeting_poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.live_meeting_polls(id) on delete cascade,
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  option_index integer not null check (option_index >= 0),
  created_at timestamptz not null default now(),
  unique (poll_id, voter_id)
);

create table if not exists public.live_meeting_questions (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  is_answered boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.live_meeting_audit_logs (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.live_meeting_reminders (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.live_meetings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_at timestamptz not null,
  channel text not null default 'email' check (channel in ('email', 'email_whatsapp')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists live_waiting_room_pending_idx
  on public.live_meeting_waiting_room(meeting_id, status, requested_at);

create index if not exists live_reactions_meeting_idx
  on public.live_meeting_reactions(meeting_id, created_at desc);

create index if not exists live_polls_meeting_idx
  on public.live_meeting_polls(meeting_id, created_at desc);

create index if not exists live_questions_meeting_idx
  on public.live_meeting_questions(meeting_id, created_at desc);

create index if not exists live_reminders_pending_idx
  on public.live_meeting_reminders(reminder_at, status);

drop trigger if exists trg_live_meeting_polls_updated_at on public.live_meeting_polls;
create trigger trg_live_meeting_polls_updated_at
before update on public.live_meeting_polls
for each row
execute function public.set_updated_at();

alter table public.live_meeting_waiting_room enable row level security;
alter table public.live_meeting_reactions enable row level security;
alter table public.live_meeting_polls enable row level security;
alter table public.live_meeting_poll_votes enable row level security;
alter table public.live_meeting_questions enable row level security;
alter table public.live_meeting_audit_logs enable row level security;
alter table public.live_meeting_reminders enable row level security;

drop policy if exists "participants_read_waiting_room" on public.live_meeting_waiting_room;
create policy "participants_read_waiting_room"
on public.live_meeting_waiting_room
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
);

drop policy if exists "students_create_waiting_request" on public.live_meeting_waiting_room;
create policy "students_create_waiting_request"
on public.live_meeting_waiting_room
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id
      and m.status in ('scheduled', 'live')
  )
);

drop policy if exists "tutor_decides_waiting_room" on public.live_meeting_waiting_room;
create policy "tutor_decides_waiting_room"
on public.live_meeting_waiting_room
for update
to authenticated
using (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
);

drop policy if exists "participants_read_reactions" on public.live_meeting_reactions;
create policy "participants_read_reactions"
on public.live_meeting_reactions
for select
to authenticated
using (
  exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_reactions.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "participants_send_reactions" on public.live_meeting_reactions;
create policy "participants_send_reactions"
on public.live_meeting_reactions
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_reactions.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "participants_read_polls" on public.live_meeting_polls;
create policy "participants_read_polls"
on public.live_meeting_polls
for select
to authenticated
using (
  exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_polls.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "tutor_manage_polls" on public.live_meeting_polls;
create policy "tutor_manage_polls"
on public.live_meeting_polls
for all
to authenticated
using (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
);

drop policy if exists "participants_read_poll_votes" on public.live_meeting_poll_votes;
create policy "participants_read_poll_votes"
on public.live_meeting_poll_votes
for select
to authenticated
using (
  exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_poll_votes.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "participants_vote_polls" on public.live_meeting_poll_votes;
create policy "participants_vote_polls"
on public.live_meeting_poll_votes
for insert
to authenticated
with check (
  voter_id = auth.uid()
  and exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_poll_votes.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "participants_read_questions" on public.live_meeting_questions;
create policy "participants_read_questions"
on public.live_meeting_questions
for select
to authenticated
using (
  exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_questions.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "participants_send_questions" on public.live_meeting_questions;
create policy "participants_send_questions"
on public.live_meeting_questions
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_questions.meeting_id
      and p.user_id = auth.uid()
      and p.left_at is null
  )
);

drop policy if exists "tutor_update_questions" on public.live_meeting_questions;
create policy "tutor_update_questions"
on public.live_meeting_questions
for update
to authenticated
using (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
);

drop policy if exists "tutor_reads_audit_logs" on public.live_meeting_audit_logs;
create policy "tutor_reads_audit_logs"
on public.live_meeting_audit_logs
for select
to authenticated
using (
  exists (
    select 1 from public.live_meetings m
    where m.id = meeting_id and m.tutor_id = auth.uid()
  )
);

drop policy if exists "participants_insert_audit_logs" on public.live_meeting_audit_logs;
create policy "participants_insert_audit_logs"
on public.live_meeting_audit_logs
for insert
to authenticated
with check (
  exists (
    select 1 from public.live_meeting_participants p
    where p.meeting_id = live_meeting_audit_logs.meeting_id
      and p.user_id = auth.uid()
  )
);

drop policy if exists "users_read_own_reminders" on public.live_meeting_reminders;
create policy "users_read_own_reminders"
on public.live_meeting_reminders
for select
to authenticated
using (user_id = auth.uid());
