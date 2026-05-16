# Smart Tuition Finder - Final Year Project

This is a React + Tailwind + Framer Motion web platform for the **Smart Tuition Finder** final year project.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Framer Motion
- Gemini API (chatbot)

## Run Locally
1. Install dependencies:
	- `npm install --legacy-peer-deps`
2. Create a `.env.local` file from `.env.example` and add:
	- `VITE_GEMINI_API_KEY` — for the chatbot
	- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — for tutor/student auth and profiles
3. **Supabase → Authentication → Providers → Email:** for **immediate sign-up and redirect to the dashboard** (no confirmation step), turn **off** “Confirm email”. If it stays on, `signUp` returns **no session** until the user confirms by email; the app then sends them to the login page instead.
4. Start development server:
	- `npm run dev`

## Build
- `npm run build`

## Gemini Chatbot
- UI component: `src/components/GeminiChatbot.jsx`
- Mounted in: `src/App.jsx`
- If the key is missing, the chatbot shows a setup message in the chat panel.

## In-App Live Classes (Zoom-like)

This project now includes native live classes with paid access control and final-project features:

- Tutors must have Pro status to create/host meetings.
- Students must have an active subscription to a specific tutor to join that tutor's meetings.
- Live room supports group video/audio, screen share, chat, reactions, raise-hand.
- Security and moderation include waiting room, lock meeting, passcode, and host controls.
- Polls and Q&A are supported during live sessions.

### 1) Apply database schema

Run this SQL in Supabase SQL editor:

- `supabase/live_classes_schema.sql`
- `supabase/live_classes_phase2.sql`

It creates/extends:

- `tutor_student_subscriptions`
- `live_meetings`
- `live_meeting_participants`
- `live_meeting_chat_messages`
- `live_meeting_waiting_room`
- `live_meeting_reactions`
- `live_meeting_polls`
- `live_meeting_poll_votes`
- `live_meeting_questions`
- `live_meeting_audit_logs`
- `live_meeting_reminders`

with required indexes, triggers, and RLS policies.

### 2) Required environment variables

Add these in `.env.local`:

- Existing PayHere keys:
  - `VITE_PAYHERE_MERCHANT_ID`
  - `VITE_PAYHERE_API_KEY`
  - `VITE_PAYHERE_NOTIFY_URL`
  - `VITE_PAYHERE_RETURN_URL`
  - `VITE_PAYHERE_CANCEL_URL`
- Optional:
  - `VITE_STUDENT_TUTOR_SUBSCRIPTION_PRICE_LKR` (default: `1500`)
  - `VITE_LIVE_PROVIDER` (`mesh` by default)
  - `VITE_LIVE_PROVIDER_TOKEN_ENDPOINT` (example: `http://localhost:8787/api/live/provider-token`)
  - `VITE_LIVE_REMINDER_DISPATCH_ENDPOINT` (example: `http://localhost:8787/api/live/reminders/dispatch`)
  - `VITE_WEBRTC_ICE_SERVERS` (JSON array for STUN/TURN servers)

Example ICE config:

```json
[{"urls":["stun:stun.l.google.com:19302"]},{"urls":["turn:your-turn-host:3478"],"username":"turn-user","credential":"turn-password"}]
```

### 3) Run secure PayHere notify server

Start the local notify endpoint:

- `npm run payhere:notify`

Server file:

- `scripts/payhere-notify.mjs`

Required server env:

- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYHERE_API_KEY`
- `VITE_SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `LIVE_TOKEN_SECRET` (recommended for signed live provider tokens)

Notify + live helper APIs handled:

- Tutor Pro payment orders -> updates tutor Pro status.
- Student subscription orders (`STUSUB-*`) -> expires previous active sub and inserts a new 30-day active subscription.
- `POST /api/live/provider-token` -> returns short-lived signed provider join token.
- `POST /api/live/verify-token` -> verifies signed provider token.
- `POST /api/live/reminders/dispatch` -> dispatches pending reminders due in the next 5 minutes.

### 4) Main live routes

- Tutor host panel: `/live/host`
- Tutor meeting room: `/live/meeting/:meetingId`
- Student join room: `/live/join/:meetingId`

### 5) Production note (TURN)

For reliable group calls across strict NAT/firewall networks, configure TURN (for example, Coturn) and set it in `VITE_WEBRTC_ICE_SERVERS`.

### 6) Final-project feature checklist

- HD audio/video controls (mute/unmute, camera on/off)
- Screen sharing (start/stop)
- Reactions
- Waiting room admit/deny
- Host moderation (mute all, participant mute/remove)
- Meeting security (passcode + secure tokenized join link + lock)
- Polls and Q&A panels
- Scheduled reminders via dispatch endpoint
