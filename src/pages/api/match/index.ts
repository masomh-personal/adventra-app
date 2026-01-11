import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiError, ApiSuccess } from '@/types/api';

/**
 * @route   POST /api/match
 * @desc    Submit a swipe action (like/dislike)
 * @access  Protected
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>,
): void {
  if (req.method === 'POST') {
    // TODO: Handle swipe action
    return res.status(200).json({ message: 'Swipe action submitted (placeholder)' });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
