const LIVE_REMINDER_DISPATCH_ENDPOINT =
  import.meta.env.VITE_LIVE_REMINDER_DISPATCH_ENDPOINT ||
  "http://localhost:8787/api/live/reminders/dispatch";

export async function dispatchLiveRemindersNow() {
  const response = await fetch(LIVE_REMINDER_DISPATCH_ENDPOINT, { method: "POST" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Reminder dispatch failed (${response.status}): ${text}`);
  }
  return response.json();
}
