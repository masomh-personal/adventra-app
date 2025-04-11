import supabase from '@/lib/supabaseClient';
import calcAgeFromBirthdate from '@/lib/calcAgeFromBirthdate';

/**
 * Fetches the full user profile including profile data and user info (name, email, birthdate).
 * Requires a foreign key from `userprofile.user_id` → `user.user_id`
 *
 * @param {string} uid - Supabase Auth UUID (user_id)
 * @returns {Promise<object|null>} Full user profile or null on error
 */
export default async function getFullUserProfile(uid) {
  if (!uid) return null;

  const { data, error } = await supabase
    .from('userprofile')
    .select(
      `
      bio,
      adventure_preferences,
      skill_summary,
      profile_image_url,
      birthdate,
      user:user_id (
        name,
        email
      )
    `
    )
    .eq('user_id', uid)
    .single();

  if (error) {
    console.error('Error fetching full user profile:', error);
    return null;
  }

  // Compute age from birthdate in userprofile table
  const age = data?.birthdate ? calcAgeFromBirthdate(data.birthdate) : null;

  return {
    ...data,
    age, // Add it at the root level for easy consumption
  };
}
