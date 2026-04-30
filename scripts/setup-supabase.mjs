#!/usr/bin/env node
/**
 * One-shot Supabase setup for Smart Tuition Finder.
 *
 * Creates the `avatars` storage bucket (public read) using the service
 * role key. Bucket creation can't be done from the browser with the
 * publishable key — that's why this lives in a server-side script.
 *
 * Usage:
 *   1. Add to .env.local (do NOT commit this key):
 *        SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   ← from Supabase
 *                                                    Project Settings → API
 *   2. Run:
 *        node scripts/setup-supabase.mjs
 *
 * After running, also paste `supabase/schema.sql` into the Supabase SQL
 * editor (one click) to install `tutor_accounts`, `student_accounts`, RLS, and the
 * on_auth_user_created trigger. SQL DDL can't be executed via the
 * REST API, so it stays a manual step.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, "..", ".env.local");

function loadEnvFile(path) {
  const env = {};
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return env;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const fileEnv = loadEnvFile(ENV_PATH);
const env = { ...fileEnv, ...process.env };

const url =
  env.SUPABASE_URL ||
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL;

const serviceKey =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.SUPABASE_SECRET_KEY ||
  env.SUPABASE_SERVICE_KEY;

if (!url) {
  console.error(
    "[setup] Missing Supabase URL. Add VITE_SUPABASE_URL or SUPABASE_URL to .env.local."
  );
  process.exit(1);
}

if (!serviceKey) {
  console.error(
    "[setup] Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "        Find it in Supabase → Project Settings → API → 'service_role' secret.\n" +
      "        Add it as: SUPABASE_SERVICE_ROLE_KEY=your-secret-here\n" +
      "        (Keep this key out of git — .env.local is already in .gitignore.)"
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const BUCKET = "avatars";

async function ensureBucket() {
  const { data: buckets, error: listError } =
    await admin.storage.listBuckets();
  if (listError) throw listError;

  const existing = buckets.find((b) => b.name === BUCKET);
  if (existing) {
    if (!existing.public) {
      const { error } = await admin.storage.updateBucket(BUCKET, {
        public: true
      });
      if (error) throw error;
      console.log(`[setup] '${BUCKET}' bucket exists — switched to public.`);
    } else {
      console.log(`[setup] '${BUCKET}' bucket already exists (public). ✓`);
    }
    return;
  }

  const { error } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"]
  });
  if (error) throw error;
  console.log(`[setup] Created public '${BUCKET}' bucket. ✓`);
}

async function main() {
  console.log(`[setup] Project: ${url}`);
  await ensureBucket();
  console.log(
    "\n[setup] Done. Final manual step:\n" +
      "        Open Supabase → SQL Editor → paste supabase/schema.sql → Run.\n" +
      "        That installs tutor_accounts, student_accounts, RLS + auth trigger.\n"
  );
}

main().catch((err) => {
  console.error("[setup] Failed:", err.message ?? err);
  process.exit(1);
});
