const STORAGE_KEY = "stf-tutor-pro-status";

function readStore() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota / private mode write errors.
  }
}

export function getTutorProStatus(tutorId) {
  if (!tutorId) return null;
  const store = readStore();
  const row = store[tutorId];
  if (!row || typeof row !== "object") return null;
  return {
    planId: typeof row.planId === "string" ? row.planId : "pro",
    isBoosted: Boolean(row.isBoosted),
    verifiedBlueMark: Boolean(row.verifiedBlueMark),
    verifiedMarks: Number.isFinite(Number(row.verifiedMarks))
      ? Math.max(0, Math.trunc(Number(row.verifiedMarks)))
      : 0,
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : null
  };
}

export function saveTutorProStatus(tutorId, patch) {
  if (!tutorId || !patch || typeof patch !== "object") return null;
  const store = readStore();
  const current = getTutorProStatus(tutorId) ?? {
    planId: "pro",
    isBoosted: false,
    verifiedBlueMark: false,
    verifiedMarks: 0,
    updatedAt: null
  };
  const next = {
    ...current,
    ...patch,
    verifiedMarks: Number.isFinite(Number(patch.verifiedMarks))
      ? Math.max(0, Math.trunc(Number(patch.verifiedMarks)))
      : current.verifiedMarks,
    updatedAt: new Date().toISOString()
  };
  store[tutorId] = next;
  writeStore(store);
  return next;
}

export function withTutorProDecorations(tutor) {
  if (!tutor) return tutor;
  const status = getTutorProStatus(tutor.id);
  const fromRowMarks =
    Number(tutor.verified_marks ?? tutor.verifiedMarks ?? tutor.pro_verified_marks) || 0;
  const derivedMarks = Math.max(fromRowMarks, status?.verifiedMarks ?? 0);
  const hasVerifiedBlueMark = Boolean(
    tutor.verified_blue_mark ?? tutor.is_verified_blue_mark ?? status?.verifiedBlueMark ?? derivedMarks > 0
  );
  const derivedBoost = Boolean(
    tutor.profile_boost ?? tutor.is_profile_boosted ?? status?.isBoosted
  );
  return {
    ...tutor,
    isProfileBoosted: derivedBoost,
    verifiedBlueMark: hasVerifiedBlueMark,
    verifiedMarks: derivedMarks
  };
}
