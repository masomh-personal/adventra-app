import supabase from '@/lib/supabaseClient';

export interface MatchData {
  user_id: string;
  matched_user_id: string;
  status?: string;
  created_at?: string;
}

/**
 * Record a match between two users.
 * @param matchData - Contains user IDs (e.g., user_id, matched_user_id)
 * @returns New match record
 */
export async function createMatch(matchData: MatchData): Promise<MatchData> {
  const { data, error } = await (supabase.from('matches') as any)
    .insert([matchData])
    .select()
    .single();

  if (error) throw new Error(error instanceof Error ? error.message : String(error));
  if (!data) throw new Error('Match data was not returned from database');
  return data as MatchData;
}

/**
 * Get matches for a user.
 * @param userId - User ID to fetch matches for
 * @returns List of matches
 */
export async function getUserMatches(userId: string): Promise<MatchData[]> {
  const { data, error } = await supabase.from('matches').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);
  return (data as MatchData[]) ?? [];
}
