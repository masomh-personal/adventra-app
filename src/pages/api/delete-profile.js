import supabaseAdmin from '@/lib/supabaseServer'; // This is for server-side (service role key)

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Step 1: Delete from auth.users (using the service role key)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      return res
        .status(500)
        .json({ error: 'Failed to delete user from authentication', details: authError });
    }

    // Step 2: Delete from public.user
    const { error: userError } = await supabaseAdmin.from('user').delete().eq('user_id', userId);

    if (userError) {
      return res
        .status(500)
        .json({ error: 'Failed to delete user data from database', details: userError });
    }

    // Step 3: Return success
    return res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'An error occurred during deletion', details: err.message });
  }
}
