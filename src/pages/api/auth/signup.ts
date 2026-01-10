import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '@/lib/supabaseClient';
import type { ApiError, ApiSuccess } from '@/types/api';

interface SignupRequestBody {
  email?: string;
  password?: string;
  fullName?: string;
}

/**
 * @route   POST /api/auth/signup
 * @desc    Handle new user signup requests
 * @access  Public
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, fullName } = req.body as SignupRequestBody;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Sign up the user using Supabase Auth
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    if (!userData?.user) {
      return res.status(400).json({ error: 'User creation failed' });
    }

    // Insert additional user profile data into 'profiles' table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase.from('profiles') as any).insert([
      {
        id: userData.user.id, // Supabase assigns a UUID user id
        full_name: fullName,
        created_at: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      const errorMessage = profileError instanceof Error ? profileError.message : String(profileError);
      return res.status(500).json({ error: errorMessage });
    }

    return res.status(201).json({ message: 'User signed up successfully', data: userData });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error: errorMessage });
  }
}
