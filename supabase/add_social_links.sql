-- Run in Supabase → SQL Editor (table name matches tutor_accounts unless you renamed it).

alter table public.tutor_profiles
  add column if not exists social_facebook_url text,
  add column if not exists social_twitter_url text,
  add column if not exists social_instagram_url text,
  add column if not exists social_whatsapp_url text;
