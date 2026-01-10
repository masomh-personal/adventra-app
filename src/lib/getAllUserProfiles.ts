import supabase from '@/lib/supabaseClient';
import type { FullUserProfile } from '@/types/user';

/**
 * Fetches all user profiles from the database and randomizes them.
 *
 * @returns List of user profiles
 */
export async function getAllUserProfiles(): Promise<FullUserProfile[]> {
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
  return (data as FullUserProfile[]).sort(() => Math.random() - 0.5);
}
