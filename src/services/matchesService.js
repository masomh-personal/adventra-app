import { supabase } from '@/lib/supabaseClient';

/**
 * Record a match between two users.
 * @param {Object} matchData - Contains user IDs (e.g., user_id, matched_user_id)
 * @returns {Object} New match record
 */
export async function createMatch(matchData) {
  const { data, error } = await supabase.from('matches').insert([matchData]);

  if (error) throw new Error(error.message);
  return data[0];
}

/**
 * Get matches for a user.
 * @param {string} userId - User ID to fetch matches for
 * @returns {Array} List of matches
 */
export async function getUserMatches(userId) {
  const { data, error } = await supabase.from('matches').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
}
