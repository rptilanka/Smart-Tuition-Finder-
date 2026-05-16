import { supabase } from "./supabase";

const DEFAULT_ICE_SERVERS = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

export function buildRtcConfig() {
  const iceServersRaw = import.meta.env.VITE_WEBRTC_ICE_SERVERS;
  if (!iceServersRaw) return { iceServers: DEFAULT_ICE_SERVERS };
  try {
    const parsed = JSON.parse(iceServersRaw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { iceServers: parsed };
    }
  } catch (_error) {
    // Fallback to default STUN when env JSON is invalid.
  }
  return { iceServers: DEFAULT_ICE_SERVERS };
}

export function createSignalingChannel({
  meetingId,
  userId,
  onSignal,
  onPresenceSync,
  onSubscribed,
  onError,
}) {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (!meetingId || !userId) throw new Error("Meeting and user IDs are required.");

  const channel = supabase.channel(`live-room:${meetingId}`, {
    config: { presence: { key: userId } },
  });

  channel.on("broadcast", { event: "signal" }, ({ payload }) => {
    if (!payload || payload.to !== userId) return;
    onSignal?.(payload);
  });

  channel.on("presence", { event: "sync" }, () => {
    const state = channel.presenceState();
    const peerIds = Object.keys(state).filter((id) => id !== userId);
    onPresenceSync?.(peerIds, state);
  });

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.track({ userId, joinedAt: new Date().toISOString() }).catch((error) => {
        onError?.(error);
      });
      onSubscribed?.();
      return;
    }
    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
      onError?.(new Error(`Realtime channel status: ${status}`));
    }
  });

  return channel;
}

export async function sendSignal(channel, payload) {
  if (!channel) return;
  await channel.send({ type: "broadcast", event: "signal", payload });
}

export async function closeSignalingChannel(channel) {
  if (!supabase || !channel) return;
  try {
    await channel.untrack();
  } catch (_error) {
    // ignore untrack failures during teardown
  }
  await supabase.removeChannel(channel);
}
