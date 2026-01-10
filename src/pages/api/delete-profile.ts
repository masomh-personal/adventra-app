import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseAdmin from '@/lib/supabaseServer';
import type { ApiError, ApiSuccess } from '@/types/api';

interface DeleteProfileRequestBody {
  userId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>
): Promise<void> {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = req.body as DeleteProfileRequestBody;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Step 1: Delete from auth.users (using the service role key)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      return res.status(500).json({
        error: 'Failed to delete user from authentication',
      });
    }

    // Step 2: Delete from public.user
    const { error: userError } = await supabaseAdmin.from('user').delete().eq('user_id', userId);

    if (userError) {
      return res.status(500).json({
        error: 'Failed to delete user data from database',
      });
    }

    // Step 3: Return success
    return res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred during deletion';
    return res.status(500).json({ error: errorMessage });
  }
}
