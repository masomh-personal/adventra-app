/**
 * @route   POST /api/match
 * @desc    Submit a swipe action (like/dislike)
 * @access  Protected
 */

export default function handler(req, res) {
  if (req.method === 'POST') {
    // TODO: Handle swipe action
    return res.status(200).json({ message: 'Swipe action submitted (placeholder)' });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
