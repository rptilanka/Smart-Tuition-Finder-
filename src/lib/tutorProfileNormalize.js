const MAX_BIO = 2000;
const MAX_QUALIFICATIONS = 4000;
const MAX_AVAILABILITY = 4000;
const MAX_PROFILE_SUBJECT = 120;
const MAX_PROFILE_LOCATION = 120;
const MAX_WHATSAPP_NUMBER = 32;
const MAX_SOCIAL_URL = 500;
const MAX_SUBJECT_ROWS = 24;
const MAX_VIDEO_ROWS = 8;
const MAX_SUBJECT_LEN = 120;
const MAX_GRADE_TOKEN = 80;
const MAX_VIDEO_TITLE = 140;
const MAX_VIDEO_DESC = 400;

function clampStr(v, max) {
  if (v == null) return "";
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

export function normalizeSocialHref(raw) {
  const trimmed = clampStr(raw ?? "", MAX_SOCIAL_URL).trim();
  if (!trimmed) return "";
  const withProto = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/+/g, "")}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.href.slice(0, MAX_SOCIAL_URL);
  } catch {
    return "";
  }
}

function parseYouTubeId(raw) {
  if (!raw || typeof raw !== "string") return null;
  const u = raw.trim();
  if (!u) return null;
  try {
    const url = new URL(u);
    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace(/^\/embed\//, "").split("/")[0] || null;
      }
      const v = url.searchParams.get("v");
      return v || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeThumbnailFromUrl(videoUrl) {
  const id = parseYouTubeId(videoUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function normalizeSubjectsGrades(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  for (const row of input) {
    if (out.length >= MAX_SUBJECT_ROWS) break;
    if (!row || typeof row !== "object") continue;
    const subject = clampStr(row.subject, MAX_SUBJECT_LEN).trim();
    let grades = [];
    if (Array.isArray(row.grades)) {
      grades = row.grades
        .map((g) => clampStr(g, MAX_GRADE_TOKEN).trim())
        .filter(Boolean)
        .slice(0, 16);
    } else if (row.grades != null) {
      grades = String(row.grades)
        .split(/[,;|]/)
        .map((g) => g.trim())
        .filter(Boolean)
        .map((g) => clampStr(g, MAX_GRADE_TOKEN))
        .slice(0, 16);
    }
    if (!subject && grades.length === 0) continue;
    out.push({ subject, grades });
  }
  return out;
}

export function normalizeDemoVideos(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  for (const row of input) {
    if (out.length >= MAX_VIDEO_ROWS) break;
    if (!row || typeof row !== "object") continue;
    const title = clampStr(row.title, MAX_VIDEO_TITLE).trim();
    const video_url = clampStr(row.video_url ?? row.videoUrl, 500).trim();
    const description = clampStr(row.description, MAX_VIDEO_DESC).trim();
    const source = clampStr(row.source, 24).trim().toLowerCase();
    if (!title && !video_url) continue;
    if (video_url && !/^https?:\/\//i.test(video_url)) continue;
    const id =
      typeof row.id === "string" && row.id.length > 0
        ? row.id
        : crypto.randomUUID();
    out.push({
      id,
      title,
      description,
      video_url,
      source: source === "upload" ? "upload" : "youtube",
    });
  }
  return out;
}

const FALLBACK_VIDEO_THUMB =
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=60";

export function demoVideoRowToCardShape(row) {
  if (!row?.video_url) return null;
  const source = row.source === "upload" ? "upload" : "youtube";
  const thumb =
    source === "youtube" ? youtubeThumbnailFromUrl(row.video_url) : "";
  return {
    id: row.id,
    title: row.title || "Demo lesson",
    description: row.description || "",
    videoUrl: row.video_url,
    thumbnail: thumb || FALLBACK_VIDEO_THUMB,
    duration: row.duration || undefined,
    source,
  };
}

export function subjectsGradesFromDb(raw) {
  return normalizeSubjectsGrades(Array.isArray(raw) ? raw : []);
}

export function demoVideosFromDb(raw) {
  const arr = Array.isArray(raw) ? raw : [];
  return arr
    .filter((r) => r && typeof r === "object")
    .map((r, index) => ({
      id:
        typeof r.id === "string" && r.id.length > 0
          ? r.id
          : `imported-${index}-${String(r.video_url ?? r.videoUrl ?? "").slice(-12)}`,
      title: clampStr(r.title, MAX_VIDEO_TITLE),
      description: clampStr(r.description, MAX_VIDEO_DESC),
      video_url: clampStr(r.video_url ?? r.videoUrl, 500),
      source:
        clampStr(r.source, 24).trim().toLowerCase() === "upload"
          ? "upload"
          : "youtube",
    }))
    .slice(0, MAX_VIDEO_ROWS);
}

export function sanitizeTutorProfilePatch(patch) {
  if (!patch || typeof patch !== "object") return {};
  const out = {};

  if (patch.name !== undefined) {
    const trimmed = String(patch.name).trim().slice(0, 80);
    if (trimmed) out.name = trimmed;
  }
  if (patch.bio !== undefined) {
    out.bio = clampStr(patch.bio, MAX_BIO);
  }
  if (patch.avatar_url !== undefined) {
    out.avatar_url =
      patch.avatar_url === null ? null : clampStr(patch.avatar_url, 2000);
  }
  if (patch.cover_image !== undefined) {
    out.cover_image =
      patch.cover_image === null ? null : clampStr(patch.cover_image, 2000);
  }
  if (patch.qualifications_experience !== undefined) {
    out.qualifications_experience = clampStr(
      patch.qualifications_experience,
      MAX_QUALIFICATIONS,
    );
  }
  if (patch.subjects_grades !== undefined) {
    out.subjects_grades = normalizeSubjectsGrades(patch.subjects_grades);
  }
  if (patch.demo_videos !== undefined) {
    out.demo_videos = normalizeDemoVideos(patch.demo_videos);
  }
  if (patch.availability_booking !== undefined) {
    out.availability_booking = clampStr(
      patch.availability_booking,
      MAX_AVAILABILITY,
    );
  }
  if (patch.whatsapp_number !== undefined) {
    out.whatsapp_number = clampStr(
      patch.whatsapp_number,
      MAX_WHATSAPP_NUMBER,
    ).trim();
  }
  if (patch.profile_subject !== undefined) {
    out.profile_subject = clampStr(
      patch.profile_subject,
      MAX_PROFILE_SUBJECT,
    ).trim();
  }
  if (patch.profile_location !== undefined) {
    out.profile_location = clampStr(
      patch.profile_location,
      MAX_PROFILE_LOCATION,
    ).trim();
  }
  if (patch.years_experience !== undefined) {
    const n = Number(patch.years_experience);
    out.years_experience = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : null;
  }
  if (patch.hourly_rate !== undefined) {
    const n = Number(patch.hourly_rate);
    out.hourly_rate = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : null;
  }
  if (patch.reviews_count !== undefined) {
    const n = Number(patch.reviews_count);
    out.reviews_count = Number.isFinite(n) && n >= 0 ? Math.trunc(n) : null;
  }

  for (const key of [
    "social_facebook_url",
    "social_twitter_url",
    "social_instagram_url",
    "social_whatsapp_url",
  ]) {
    if (patch[key] !== undefined) {
      const u = normalizeSocialHref(patch[key]);
      out[key] = u || null;
    }
  }

  return out;
}
