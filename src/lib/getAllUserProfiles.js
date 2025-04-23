import supabase from '@/lib/supabaseClient';

/**
 * Fetches all user profiles from the database and randomizes them.
 *
 * @returns {Promise<Array>} List of user profiles
 */
export async function getAllUserProfiles() {
  const { data, error } = await supabase
    .from('userprofile')
    .select(
      `user_id, bio, adventure_preferences, skill_summary, profile_image_url, birthdate, instagram_url, facebook_url, dating_preferences, user:user_id (name, email)`
    );

  if (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }

  // Randomize the profiles
  return data.sort(() => Math.random() - 0.5);
}
