/**
 * @route   GET /api/profiles/[id]
 * @desc    Fetch or update a user profile by ID
 * @access  Protected
 */

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // TODO: Fetch profile by ID
    return res.status(200).json({ message: `Fetch profile for ID: ${id}` });
  }

  if (req.method === 'PUT') {
    // TODO: Update profile by ID
    return res.status(200).json({ message: `Update profile for ID: ${id}` });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
