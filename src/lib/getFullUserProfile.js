import supabase from '@/lib/supabaseClient';

/**
 * Fetches the full user profile including profile data and name/email from the related user table.
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

  return data;
}
