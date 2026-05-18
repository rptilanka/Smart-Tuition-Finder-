-- Run in Supabase → SQL Editor.
--
-- IMPORTANT: replace "tutor_accounts" below with your actual table name if
-- you set VITE_SUPABASE_TUTOR_PROFILES_TABLE to something else in .env.local.
-- The app defaults to "tutor_accounts" when that env var is not set.

alter table public.tutor_accounts
  add column if not exists social_facebook_url text,
  add column if not exists social_twitter_url text,
  add column if not exists social_instagram_url text,
  add column if not exists social_whatsapp_url text;
