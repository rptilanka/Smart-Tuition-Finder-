import { createHash } from "node:crypto";
import http from "node:http";
import { URLSearchParams } from "node:url";

const PORT = Number(process.env.PAYHERE_NOTIFY_PORT || 8787);
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const MERCHANT_SECRET =
  process.env.PAYHERE_API_KEY || process.env.VITE_PAYHERE_API_KEY || "";

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
  await fetch(`${SUPABASE_URL}/rest/v1/tutor_profiles?id=eq.${tutorId}`, {
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

const server = http.createServer(async (req, res) => {
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
    if (statusCode === 2 || statusCode === 3) {
      await applyTutorProStatus({
        tutorId: body.custom_1,
        planId: body.custom_2,
      });
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        order_id: body.order_id,
        status_code: body.status_code,
        status_message: body.status_message,
      }),
    );
  });
});

server.listen(PORT, () => {
  console.log(
    `PayHere notify server listening on http://localhost:${PORT}/api/payhere/notify`,
  );
});
