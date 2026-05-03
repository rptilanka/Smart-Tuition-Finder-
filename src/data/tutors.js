export const tutorsById = {};

const defaultBio = [];

const defaultQualifications = [];

const defaultCertifications = [];

const defaultSpecialSkills = [];

const defaultSubjectsTaught = [];

const defaultDemoVideos = [];

const defaultReviews = [];

const defaultAvailability = [];

export function resolveTutor(id) {
  return tutorsById[id] ?? null;
}

export function getTutorProfile(id) {
  const base = tutorsById[id];
  if (!base) return null;

  return {
    ...base,
    avatarAccent: base.accent ?? "linear-gradient(135deg,#14b8a6,#0ea5e9)",
    coverImage:
      base.coverImage ??
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80",
    subject: base.profile_subject ?? base.subject ?? "",
    location: base.profile_location ?? base.location ?? "",
    reviewsCount: base.reviews_count ?? base.reviewsCount ?? null,
    yearsExperience: base.years_experience ?? base.yearsExperience ?? null,
    hourlyRate: base.hourly_rate ?? base.hourlyRate ?? null,
    bio: base.bio ?? defaultBio,
    qualifications: base.qualifications ?? defaultQualifications,
    certifications: base.certifications ?? defaultCertifications,
    specialSkills: base.specialSkills ?? defaultSpecialSkills,
    subjectsTaught: base.subjectsTaught ?? defaultSubjectsTaught,
    demoVideos: base.demoVideos ?? defaultDemoVideos,
    reviews: base.reviews ?? defaultReviews,
    availability: base.availability ?? defaultAvailability,
    profileUrl: base.profileUrl ?? `/tutor/${id}`,
  };
}
