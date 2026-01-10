import supabase from '@/lib/supabaseClient';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';
import type { FullUserProfile } from '@/types/user';

/**
 * Fetches the full user profile including profile data and user info (name, email).
 * Requires a foreign key from `userprofile.user_id` → `user.user_id`
 *
 * @param uid - Supabase Auth UUID (user_id)
 * @returns Full user profile or null on error
 */
export async function getFullUserProfile(uid: string | null | undefined): Promise<FullUserProfile | null> {
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
      instagram_url,
      facebook_url,
      dating_preferences,
      user_id,
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

  if (!data) return null;

  const profileData = data as {
    bio?: string | null;
    adventure_preferences?: string[] | null;
    skill_summary?: Record<string, string> | null;
    profile_image_url?: string | null;
    birthdate?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
    dating_preferences?: string | null;
    user_id: string;
    user?: {
      name: string;
      email: string;
    } | null;
  };

  // Compute age from birthdate in userprofile table
  const age = profileData?.birthdate ? calcAgeFromBirthdate(profileData.birthdate) : null;

  return {
    ...profileData,
    age, // Add it at the root level for easy consumption
  } as FullUserProfile;
}
