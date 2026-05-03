export function withTutorProDecorations(tutor) {
  if (!tutor) return tutor;
  const fromRowMarks =
    Number(
      tutor.verified_marks ?? tutor.verifiedMarks ?? tutor.pro_verified_marks,
    ) || 0;
  const derivedMarks = fromRowMarks;
  const hasVerifiedBlueMark = Boolean(
    tutor.verified_blue_mark ?? tutor.is_verified_blue_mark ?? derivedMarks > 0,
  );
  const derivedBoost = Boolean(tutor.profile_boost ?? tutor.is_profile_boosted);
  return {
    ...tutor,
    isProfileBoosted: derivedBoost,
    verifiedBlueMark: hasVerifiedBlueMark,
    verifiedMarks: derivedMarks,
  };
}
