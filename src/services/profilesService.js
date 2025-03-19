import { supabase } from '@/lib/supabaseClient';

/**
 * Create or update a user profile.
 * @param {Object} profileData - Profile info (user_id, bio, etc.)
 * @returns {Object} Updated profile
 */
export async function upsertProfile(profileData) {
  const { data, error } = await supabase.from('profiles').upsert(profileData).select().single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get profile by user ID.
 * @param {string} userId - Associated user ID
 * @returns {Object} Profile or null
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
