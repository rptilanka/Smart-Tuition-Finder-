export const DEFAULT_VIDEO_PROVIDER = (import.meta.env.VITE_LIVE_PROVIDER || "mesh")
  .toLowerCase()
  .trim();

const PROVIDER_TOKEN_ENDPOINT = import.meta.env.VITE_LIVE_PROVIDER_TOKEN_ENDPOINT || "";

export function getLiveProviderConfig() {
  return {
    provider: DEFAULT_VIDEO_PROVIDER,
    tokenEndpoint: PROVIDER_TOKEN_ENDPOINT,
  };
}

export async function fetchProviderJoinToken({
  meetingId,
  userId,
  role,
  passcode = "",
  joinToken = "",
  accessToken = "",
  userName = "",
}) {
  if (!PROVIDER_TOKEN_ENDPOINT) {
    return {
      provider: DEFAULT_VIDEO_PROVIDER,
      token: "",
      roomId: "",
      metadata: { mode: "client-mesh-fallback" },
    };
  }

  const response = await fetch(PROVIDER_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      meetingId,
      userId,
      role,
      passcode,
      joinToken,
      accessToken,
      userName,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Provider token request failed (${response.status}): ${text}`);
  }
  const payload = await response.json();
  const roomUrl = payload.roomUrl || payload.room_url || payload.metadata?.roomUrl || "";
  return {
    provider: payload.provider || DEFAULT_VIDEO_PROVIDER,
    token: payload.token || "",
    roomId: payload.roomId || payload.room_id || "",
    metadata: { ...(payload.metadata || {}), ...(roomUrl ? { roomUrl } : {}) },
  };
}
