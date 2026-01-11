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
      `user_id, bio, adventure_preferences, skill_summary, profile_image_url, birthdate, instagram_url, facebook_url, dating_preferences, user:user_id (name, email)`,
    );

  if (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }

  if (!data) return [];

  // Transform Supabase response (joined relations are arrays) to match our type
  const profiles: FullUserProfile[] = data.map((item: any) => ({
    user_id: item.user_id,
    bio: item.bio,
    adventure_preferences: item.adventure_preferences,
    skill_summary: item.skill_summary,
    profile_image_url: item.profile_image_url,
    birthdate: item.birthdate,
    instagram_url: item.instagram_url,
    facebook_url: item.facebook_url,
    dating_preferences: item.dating_preferences,
    user: Array.isArray(item.user) && item.user.length > 0 ? item.user[0] : null,
  }));

  // Randomize the profiles
  return profiles.sort(() => Math.random() - 0.5);
}
