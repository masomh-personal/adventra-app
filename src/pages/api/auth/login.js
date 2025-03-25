/**
 * @route   POST /api/auth/login
 * @desc    Handle user login requests
 * @access  Public
 */

export default function handler(req, res) {
  if (req.method === 'POST') {
    // TODO: Authenticate user with Supabase (or placeholder logic for now)
    return res.status(200).json({ message: 'Login successful (placeholder)' });
  }

  // If method is not POST, return 405 Method Not Allowed
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
