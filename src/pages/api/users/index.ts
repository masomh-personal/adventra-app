import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabaseClient';
import type { ApiError, UsersResponse } from '@/types/api';
import type { UserProfile } from '@/types/user';

/**
 * @route   GET /api/users
 * @desc    Fetch all user profiles from Supabase
 * @access  Public
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse | ApiError>,
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data: profiles, error } = await supabase.from('profiles').select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ profiles: (profiles as UserProfile[]) || [] });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error: errorMessage });
  }
}
