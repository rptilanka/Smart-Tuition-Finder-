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
