/**
 * @route   GET /api/match/status
 * @desc    Get matched users for the current user
 * @access  Protected
 */

export default function handler(req, res) {
  if (req.method === 'GET') {
    // TODO: Return match status
    return res.status(200).json({ message: 'Match status fetched (placeholder)' });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
