/**
 * @route   GET /api/users
 * @desc    Fetch all user profiles from Supabase
 * @access  Public
 */

import supabase from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data: profiles, error } = await supabase.from('profiles').select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ profiles });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
