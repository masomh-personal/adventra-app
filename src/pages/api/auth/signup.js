/**
 * @route   POST /api/auth/signup
 * @desc    Handle new user signup requests
 * @access  Public
 */

import supabase from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Sign up the user using Supabase Auth
    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    // Insert additional user profile data into 'profiles' table
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: user.user.id, // Supabase assigns a UUID user id
        full_name: fullName,
        created_at: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    return res.status(201).json({ message: 'User signed up successfully', user });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
