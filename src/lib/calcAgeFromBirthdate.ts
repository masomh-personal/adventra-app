/**
 * Calculates age based on a birthdate string (YYYY-MM-DD).
 * @param birthdate - Birthdate as string or Date object
 * @returns Age as number or null if invalid
 */
export function calcAgeFromBirthdate(birthdate: string | Date | null | undefined): number | null {
  if (!birthdate) return null;

  const dob = new Date(birthdate);
  if (isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) age--;

  return age;
}
