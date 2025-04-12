/**
 * Calculates age based on a birthdate string (YYYY-MM-DD).
 * @param {string|Date} birthdate
 * @returns {number|null} Age or null if invalid
 */
export function calcAgeFromBirthdate(birthdate) {
  if (!birthdate) return null;

  const dob = new Date(birthdate);
  if (isNaN(dob)) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) age--;

  return age;
}
