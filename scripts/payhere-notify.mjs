import { createHash, createHmac } from "node:crypto";
import http from "node:http";
import { URLSearchParams } from "node:url";

const PORT = Number(process.env.PAYHERE_NOTIFY_PORT || 8787);
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const MERCHANT_SECRET =
  process.env.PAYHERE_API_KEY || process.env.VITE_PAYHERE_API_KEY || "";
const TUTOR_TABLE = process.env.SUPABASE_TUTOR_TABLE || process.env.VITE_SUPABASE_TUTOR_PROFILES_TABLE || "tutor_profiles";
const LIVE_TOKEN_SECRET = process.env.LIVE_TOKEN_SECRET || "dev-live-token-secret";
const LIVE_PROVIDER = (process.env.VITE_LIVE_PROVIDER || "mesh").toLowerCase();
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const STUDENT_TABLE = process.env.SUPABASE_STUDENT_TABLE || "student_accounts";
const DAILY_API_KEY = process.env.DAILY_API_KEY || "";
const DAILY_SUBDOMAIN =
  process.env.DAILY_SUBDOMAIN || process.env.VITE_DAILY_SUBDOMAIN || "";

function corsHeaders(origin) {
  const o = origin && String(origin) !== "null" ? String(origin) : "*";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function md5Upper(value) {
  return createHash("md5").update(String(value)).digest("hex").toUpperCase();
}

function parseFormBody(rawBody) {
  const params = new URLSearchParams(rawBody);
  return {
    merchant_id: params.get("merchant_id") || "",
    order_id: params.get("order_id") || "",
    payhere_amount: params.get("payhere_amount") || "",
    payhere_currency: params.get("payhere_currency") || "",
    status_code: params.get("status_code") || "",
    md5sig: params.get("md5sig") || "",
    status_message: params.get("status_message") || "",
    authorization_token: params.get("authorization_token") || "",
    custom_1: params.get("custom_1") || "",
    custom_2: params.get("custom_2") || "",
  };
}

function verifyNotification(body) {
  if (!MERCHANT_SECRET) return false;
  const local = md5Upper(
    `${body.merchant_id}${body.order_id}${body.payhere_amount}${body.payhere_currency}${body.status_code}${md5Upper(MERCHANT_SECRET)}`,
  );
  return local === body.md5sig;
}

async function applyTutorProStatus({ tutorId, planId }) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !tutorId) return;
  const verified_marks = 5;
  const payload = {
    profile_boost: true,
    verified_marks,
    is_verified_blue_mark: true,
    pro_plan_id: planId || "pro-plus",
  };
  await fetch(`${SUPABASE_URL}/rest/v1/${TUTOR_TABLE}?id=eq.${tutorId}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
}

function addDays(iso, days) {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

async function supabaseRequest(path, method, body, extraHeaders = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${method} ${path} failed: ${response.status} ${text}`);
  }
  return response;
}

async function attachJoinLinkToSubscription(studentId, tutorId) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !studentId || !tutorId) return;
  try {
    // Find tutor's latest active/scheduled meeting
    const meetings = await supabaseGet(
      `live_meetings?tutor_id=eq.${tutorId}&status=in.(scheduled,live)&order=starts_at.desc&limit=1&select=id,title,secure_join_token,status,starts_at`,
    );
    const meeting = meetings?.[0];
    if (!meeting) return; // no meeting yet — student will see it when one is created

    const token = meeting.secure_join_token ? `?token=${encodeURIComponent(meeting.secure_join_token)}` : "";
    const joinLink = `/live/join/${meeting.id}${token}`;

    // Update the active subscription metadata with the join link
    await supabaseRequest(
      `tutor_student_subscriptions?student_id=eq.${studentId}&tutor_id=eq.${tutorId}&status=eq.active`,
      "PATCH",
      {
        metadata: {
          join_link: joinLink,
          meeting_id: meeting.id,
          meeting_title: meeting.title,
          meeting_status: meeting.status,
          invite_sent_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      },
      { Prefer: "return=minimal" },
    );
    console.log(`[notify] join link attached for student=${studentId} tutor=${tutorId} meeting=${meeting.id}`);
  } catch (e) {
    console.warn("[notify] attachJoinLinkToSubscription failed:", e.message);
  }
}

async function applyStudentTutorSubscription({
  studentId,
  tutorId,
  orderId,
  paymentId,
  amount,
  currency,
}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !studentId || !tutorId) return;

  const nowIso = new Date().toISOString();
  await supabaseRequest(
    `tutor_student_subscriptions?student_id=eq.${studentId}&tutor_id=eq.${tutorId}&status=eq.active`,
    "PATCH",
    {
      status: "expired",
      updated_at: nowIso,
      metadata: { replaced_by_order: orderId },
    },
    { Prefer: "return=minimal" },
  );

  await supabaseRequest(
    "tutor_student_subscriptions",
    "POST",
    {
      student_id: studentId,
      tutor_id: tutorId,
      status: "active",
      start_at: nowIso,
      end_at: addDays(nowIso, 30),
      billing_provider: "payhere",
      provider_order_id: orderId,
      provider_payment_id: paymentId,
      amount_lkr: Number(amount || 0),
      metadata: { currency: currency || "LKR" },
    },
    { Prefer: "resolution=merge-duplicates,return=minimal" },
  );
}

function signLiveToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", LIVE_TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyLiveToken(token) {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", LIVE_TOKEN_SECRET).update(body).digest("base64url");
  if (expected !== sig) return null;
  const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (Number(parsed.exp || 0) < Date.now()) return null;
  return parsed;
}

async function dispatchLiveReminders() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return { sent: 0, failed: 0 };
  const nowIso = new Date().toISOString();
  const windowIso = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/live_meeting_reminders?status=eq.pending&reminder_at=gte.${encodeURIComponent(nowIso)}&reminder_at=lte.${encodeURIComponent(windowIso)}`,
    {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!response.ok) return { sent: 0, failed: 0 };
  const reminders = await response.json();
  let sent = 0;
  for (const reminder of reminders) {
    console.log(
      `[live-reminder] meeting=${reminder.meeting_id} user=${reminder.user_id} channel=${reminder.channel}`,
    );
    await supabaseRequest(`live_meeting_reminders?id=eq.${reminder.id}`, "PATCH", {
      status: "sent",
      sent_at: new Date().toISOString(),
    });
    sent += 1;
  }
  return { sent, failed: 0 };
}

function hashPasscodeSha256(value) {
  const passcode = String(value || "").trim();
  if (!passcode) return "";
  return createHash("sha256").update(passcode, "utf8").digest("hex");
}

async function getAuthUser(accessToken) {
  const token = String(accessToken || "").trim();
  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON_KEY,
    },
  });
  if (!response.ok) return null;
  const body = await response.json();
  if (body?.user?.id) return body.user;
  if (body?.id) return body;
  return null;
}

async function supabaseGet(path) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase GET ${path}: ${response.status} ${text}`);
  }
  return response.json();
}

function isTutorProRow(row) {
  if (!row) return false;
  return Boolean(
    row.profile_boost ??
      row.is_profile_boosted ??
      row.is_verified_blue_mark ??
      Number(row.verified_marks) > 0,
  );
}

function isActiveSubscriptionRow(row) {
  if (!row || row.status !== "active") return false;
  const now = Date.now();
  const start = row.start_at ? new Date(row.start_at).getTime() : 0;
  const end = row.end_at ? new Date(row.end_at).getTime() : 0;
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && end > now;
}

async function validateLiveMeetingJoin({
  user,
  meeting,
  clientRole,
  passcode = "",
  joinToken = "",
}) {
  const userId = user?.id;
  if (!meeting || !userId) throw new Error("Invalid meeting or user.");

  if (meeting.status === "ended" || meeting.status === "cancelled") {
    throw new Error("This meeting is not joinable.");
  }

  const actualRole = meeting.tutor_id === userId ? "tutor" : "student";
  if (String(clientRole || "").toLowerCase() !== actualRole) {
    throw new Error("Role does not match this account for the meeting.");
  }

  if (actualRole === "tutor") {
    const rows = await supabaseGet(
      `${TUTOR_TABLE}?id=eq.${userId}&select=id,profile_boost,is_profile_boosted,is_verified_blue_mark,verified_marks`,
    );
    const tutorRow = rows?.[0];
    if (!isTutorProRow(tutorRow)) {
      throw new Error("Tutor Pro subscription is required.");
    }
  } else {
    const [studentRows, subRows] = await Promise.all([
      supabaseGet(`${STUDENT_TABLE}?id=eq.${userId}&select=id`),
      supabaseGet(
        `tutor_student_subscriptions?student_id=eq.${userId}&tutor_id=eq.${meeting.tutor_id}&select=status,start_at,end_at&order=end_at.desc&limit=1`,
      ),
    ]);
    if (!studentRows?.[0]) throw new Error("Student account not found.");
    const sub = subRows?.[0];
    if (!isActiveSubscriptionRow(sub)) {
      throw new Error("Active subscription to this tutor is required.");
    }
  }

  if (meeting.is_locked && actualRole !== "tutor") {
    throw new Error("Meeting is locked by host.");
  }

  if (actualRole !== "tutor" && meeting.secure_join_token) {
    if (
      String(joinToken || "").trim() !== String(meeting.secure_join_token || "").trim()
    ) {
      throw new Error("Invalid or missing secure join link.");
    }
  }

  if (meeting.passcode_hash) {
    const hashed = hashPasscodeSha256(passcode);
    if (hashed !== meeting.passcode_hash) {
      throw new Error("Incorrect meeting passcode.");
    }
  }

  if (actualRole === "student" && meeting.waiting_room_enabled) {
    const waitingPath = `live_meeting_waiting_room?meeting_id=eq.${meeting.id}&user_id=eq.${userId}&select=id,status`;
    const waitingRows = await supabaseGet(waitingPath);
    const row = waitingRows?.[0];
    if (!row) {
      await supabaseRequest("live_meeting_waiting_room", "POST", {
        meeting_id: meeting.id,
        user_id: userId,
        status: "pending",
      });
      throw new Error("Waiting for tutor approval.");
    }
    if (row.status === "pending") throw new Error("Waiting for tutor approval.");
    if (row.status === "denied") throw new Error("Join request denied by tutor.");
  }

  return actualRole;
}

function dailyRoomNameFromMeetingId(meetingId) {
  return `stf${String(meetingId || "").replace(/-/g, "")}`.slice(0, 48);
}

function buildDailyRoomUrl(roomName) {
  const raw = String(DAILY_SUBDOMAIN || "")
    .replace(/^https?:\/\//i, "")
    .replace(/\.daily\.co$/i, "")
    .trim();
  if (!raw) throw new Error("DAILY_SUBDOMAIN is not configured (e.g. myteam for myteam.daily.co).");
  return `https://${raw}.daily.co/${encodeURIComponent(roomName)}`;
}

async function ensureDailyRoom(roomName) {
  if (!DAILY_API_KEY) throw new Error("DAILY_API_KEY is not configured on the server.");
  const headers = { Authorization: `Bearer ${DAILY_API_KEY}` };
  const probe = await fetch(`https://api.daily.co/v1/rooms/${encodeURIComponent(roomName)}`, {
    headers,
  });
  if (probe.ok) return roomName;
  if (probe.status !== 404) {
    const text = await probe.text();
    throw new Error(`Daily room lookup failed (${probe.status}): ${text}`);
  }
  const created = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: roomName,
      privacy: "private",
      properties: {
        max_participants: 250,
        enable_screenshare: true,
        enable_chat: false,
      },
    }),
  });
  if (created.ok || created.status === 409) return roomName;
  const errText = await created.text();
  throw new Error(`Daily create room failed (${created.status}): ${errText}`);
}

async function mintDailyMeetingToken(roomName, displayName, isOwner) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DAILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: String(displayName || "Participant").slice(0, 64),
        is_owner: Boolean(isOwner),
        exp,
      },
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Daily meeting token failed (${response.status}): ${text}`);
  }
  const body = await response.json();
  if (!body?.token) throw new Error("Daily did not return a meeting token.");
  return body.token;
}

async function handleLiveProviderToken(req, res) {
  const origin = req.headers.origin;
  const write = (status, payload) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    });
    res.end(JSON.stringify(payload));
  };

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      write(500, { ok: false, message: "Supabase is not configured on the server." });
      return;
    }

    const body = await readJsonBody(req);
    const meetingId = body.meetingId;
    const clientRole = String(body.role || "").toLowerCase();
    const passcode = body.passcode ?? "";
    const joinToken = body.joinToken ?? "";
    const accessToken = body.accessToken ?? "";

    if (!meetingId || !clientRole) {
      write(400, { ok: false, message: "meetingId and role are required." });
      return;
    }

    const user = await getAuthUser(accessToken);
    if (!user) {
      write(401, {
        ok: false,
        message: "Sign in required. Ensure VITE_SUPABASE_ANON_KEY is set on the notify server and pass accessToken from the client.",
      });
      return;
    }

    if (body.userId && body.userId !== user.id) {
      write(403, { ok: false, message: "Session does not match requested user." });
      return;
    }

    const meetings = await supabaseGet(`live_meetings?id=eq.${meetingId}&select=*`);
    const meeting = meetings?.[0];
    if (!meeting) {
      write(404, { ok: false, message: "Meeting not found." });
      return;
    }

    let actualRole;
    try {
      actualRole = await validateLiveMeetingJoin({
        user,
        meeting,
        clientRole,
        passcode,
        joinToken,
      });
    } catch (gateError) {
      const msg = gateError?.message || "Not allowed to join.";
      write(403, { ok: false, message: msg });
      return;
    }

    const providerName = String(meeting.provider_name || LIVE_PROVIDER || "mesh").toLowerCase();

    if (providerName === "daily") {
      if (!DAILY_SUBDOMAIN) {
        write(500, { ok: false, message: "DAILY_SUBDOMAIN is not configured." });
        return;
      }
      const roomName = dailyRoomNameFromMeetingId(meeting.id);
      await ensureDailyRoom(roomName);
      if (meeting.provider_room_id !== roomName) {
        await fetch(`${SUPABASE_URL}/rest/v1/live_meetings?id=eq.${meeting.id}`, {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ provider_room_id: roomName, updated_at: new Date().toISOString() }),
        });
      }
      const displayName =
        body.userName ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Participant";
      const dToken = await mintDailyMeetingToken(
        roomName,
        displayName,
        actualRole === "tutor",
      );
      const roomUrl = buildDailyRoomUrl(roomName);
      write(200, {
        ok: true,
        provider: "daily",
        token: dToken,
        roomId: roomName,
        roomUrl,
        metadata: { mode: "daily", roomUrl },
      });
      return;
    }

    const meshToken = signLiveToken({
      meetingId: meeting.id,
      userId: user.id,
      role: actualRole,
      provider: "mesh",
      exp: Date.now() + 10 * 60 * 1000,
    });
    write(200, {
      ok: true,
      provider: "mesh",
      token: meshToken,
      roomId: meeting.id,
      metadata: { signedBy: "notify-server", mode: "mesh" },
    });
  } catch (error) {
    write(500, { ok: false, message: error.message || "Live token error" });
  }
}

const server = http.createServer(async (req, res) => {
  if (
    req.method === "OPTIONS" &&
    (req.url === "/api/live/provider-token" ||
      req.url === "/api/live/verify-token" ||
      req.url === "/api/live/reminders/dispatch")
  ) {
    res.writeHead(204, corsHeaders(req.headers.origin));
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/live/provider-token") {
    await handleLiveProviderToken(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/live/verify-token") {
    try {
      const payload = await readJsonBody(req);
      const decoded = verifyLiveToken(payload.token);
      if (!decoded) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          ...corsHeaders(req.headers.origin),
        });
        res.end(JSON.stringify({ ok: false, message: "Invalid live token" }));
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        ...corsHeaders(req.headers.origin),
      });
      res.end(JSON.stringify({ ok: true, decoded }));
      return;
    } catch (error) {
      res.writeHead(500, {
        "Content-Type": "application/json",
        ...corsHeaders(req.headers.origin),
      });
      res.end(JSON.stringify({ ok: false, message: error.message }));
      return;
    }
  }

  if (req.method === "POST" && req.url === "/api/live/reminders/dispatch") {
    try {
      const result = await dispatchLiveReminders();
      res.writeHead(200, {
        "Content-Type": "application/json",
        ...corsHeaders(req.headers.origin),
      });
      res.end(JSON.stringify({ ok: true, ...result }));
      return;
    } catch (error) {
      res.writeHead(500, {
        "Content-Type": "application/json",
        ...corsHeaders(req.headers.origin),
      });
      res.end(JSON.stringify({ ok: false, message: error.message }));
      return;
    }
  }

  if (req.method !== "POST" || req.url !== "/api/payhere/notify") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, message: "Not found" }));
    return;
  }

  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk.toString();
  });
  req.on("end", async () => {
    const body = parseFormBody(raw);
    const isValid = verifyNotification(body);
    if (!isValid) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, message: "Invalid md5sig" }));
      return;
    }

    const statusCode = Number(body.status_code);
    try {
      if (statusCode === 2 || statusCode === 3) {
        if (body.order_id.startsWith("STUSUB-")) {
          await applyStudentTutorSubscription({
            studentId: body.custom_1,
            tutorId: body.custom_2,
            orderId: body.order_id,
            paymentId: body.authorization_token,
            amount: body.payhere_amount,
            currency: body.payhere_currency,
          });
          // Auto-attach the tutor's latest meeting invite link to the subscription
          await attachJoinLinkToSubscription(body.custom_1, body.custom_2);
        } else {
          await applyTutorProStatus({
            tutorId: body.custom_1,
            planId: body.custom_2,
          });
        }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, order_id: body.order_id, status_code: body.status_code }));
    } catch (applyError) {
      console.error("[notify] apply error:", applyError.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, message: applyError.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(
    `PayHere notify server listening on http://localhost:${PORT}/api/payhere/notify`,
  );
});
