-- Secure join helpers for live meetings (token-based join)
-- Run this in Supabase SQL Editor with a privileged role.

create extension if not exists pgcrypto;

-- Returns meeting details ONLY if:
-- - caller is the tutor who owns the meeting, OR
-- - caller provides the correct secure join token
create or replace function public.get_meeting_for_join(
  p_meeting_id uuid,
  p_join_token text default ''
)
returns table (
  id uuid,
  tutor_id uuid,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  waiting_room_enabled boolean,
  is_locked boolean,
  provider_name text,
  provider_room_id text,
  has_passcode boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.live_meetings%rowtype;
begin
  select * into m from public.live_meetings where live_meetings.id = p_meeting_id;
  if not found then
    return;
  end if;

  if auth.uid() = m.tutor_id then
    return query
      select
        m.id,
        m.tutor_id,
        m.title,
        m.description,
        m.starts_at,
        m.ends_at,
        m.status,
        m.waiting_room_enabled,
        m.is_locked,
        m.provider_name,
        m.provider_room_id,
        (m.passcode_hash is not null and length(trim(m.passcode_hash)) > 0) as has_passcode;
    return;
  end if;

  if coalesce(m.secure_join_token, '') = '' then
    raise exception 'Invalid or missing secure join link.';
  end if;

  if trim(coalesce(p_join_token, '')) <> trim(m.secure_join_token) then
    raise exception 'Invalid or missing secure join link.';
  end if;

  return query
    select
      m.id,
      m.tutor_id,
      m.title,
      m.description,
      m.starts_at,
      m.ends_at,
      m.status,
      m.waiting_room_enabled,
      m.is_locked,
      m.provider_name,
      m.provider_room_id,
      (m.passcode_hash is not null and length(trim(m.passcode_hash)) > 0) as has_passcode;
end;
$$;

grant execute on function public.get_meeting_for_join(uuid, text) to authenticated;

-- PostgREST schema-cache lookups can be sensitive to argument ordering.
-- This overload accepts parameters in the opposite order and delegates.
create or replace function public.get_meeting_for_join(
  p_join_token text,
  p_meeting_id uuid
)
returns table (
  id uuid,
  tutor_id uuid,
  title text,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  waiting_room_enabled boolean,
  is_locked boolean,
  provider_name text,
  provider_room_id text,
  has_passcode boolean
)
language sql
security definer
set search_path = public
as $$
  select * from public.get_meeting_for_join(p_meeting_id, p_join_token);
$$;

grant execute on function public.get_meeting_for_join(text, uuid) to authenticated;

-- Joins a meeting securely (enforces token/passcode/lock/waiting-room server-side)
create or replace function public.join_meeting_secure(
  p_meeting_id uuid,
  p_role text,
  p_passcode text default '',
  p_join_token text default ''
)
returns public.live_meeting_participants
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.live_meetings%rowtype;
  waiting public.live_meeting_waiting_room%rowtype;
  hashed text;
  is_hex_sha boolean;
  result_row public.live_meeting_participants;
begin
  if p_role not in ('tutor', 'student') then
    raise exception 'Invalid role.';
  end if;

  select * into m from public.live_meetings where live_meetings.id = p_meeting_id;
  if not found then
    raise exception 'Meeting not found.';
  end if;

  if m.status in ('ended', 'cancelled') then
    raise exception 'This meeting is not joinable.';
  end if;

  if p_role = 'tutor' then
    if auth.uid() <> m.tutor_id then
      raise exception 'Only meeting owner can host.';
    end if;
  else
    if m.is_locked then
      raise exception 'Meeting is locked by host.';
    end if;

    if coalesce(m.secure_join_token, '') = '' then
      raise exception 'Invalid or missing secure join link.';
    end if;

    if trim(coalesce(p_join_token, '')) <> trim(m.secure_join_token) then
      raise exception 'Invalid or missing secure join link.';
    end if;

    if m.waiting_room_enabled then
      select * into waiting
      from public.live_meeting_waiting_room
      where meeting_id = m.id
        and user_id = auth.uid();

      if not found then
        insert into public.live_meeting_waiting_room(meeting_id, user_id, status)
        values (m.id, auth.uid(), 'pending');
        raise exception 'Waiting for tutor approval.';
      end if;

      if waiting.status = 'pending' then
        raise exception 'Waiting for tutor approval.';
      end if;

      if waiting.status = 'denied' then
        raise exception 'Join request denied by tutor.';
      end if;
    end if;
  end if;

  if coalesce(m.passcode_hash, '') <> '' then
    is_hex_sha := (length(m.passcode_hash) = 64 and m.passcode_hash ~ '^[0-9a-fA-F]+$');
    if is_hex_sha then
      hashed := encode(digest(convert_to(trim(coalesce(p_passcode, '')), 'utf8'), 'sha256'), 'hex');
      if hashed <> m.passcode_hash then
        raise exception 'Incorrect meeting passcode.';
      end if;
    else
      if trim(coalesce(p_passcode, '')) <> trim(m.passcode_hash) then
        raise exception 'Incorrect meeting passcode.';
      end if;
    end if;
  end if;

  insert into public.live_meeting_participants(
    meeting_id,
    user_id,
    role,
    joined_at,
    left_at,
    last_heartbeat_at,
    hand_raised
  )
  values (
    m.id,
    auth.uid(),
    p_role,
    now(),
    null,
    now(),
    false
  )
  on conflict (meeting_id, user_id)
  do update set
    role = excluded.role,
    joined_at = excluded.joined_at,
    left_at = null,
    last_heartbeat_at = excluded.last_heartbeat_at,
    hand_raised = false
  returning * into result_row;

  return result_row;
end;
$$;

grant execute on function public.join_meeting_secure(uuid, text, text, text) to authenticated;
