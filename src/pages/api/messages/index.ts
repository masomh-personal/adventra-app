import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiError, ApiSuccess } from '@/types/api';

/**
 * @route   GET /api/messages
 * @desc    Retrieve user messages
 * @access  Protected
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccess | ApiError>
): void {
  if (req.method === 'GET') {
    // TODO: Fetch user messages
    return res.status(200).json({ message: 'Messages fetched (placeholder)' });
  }

  if (req.method === 'POST') {
    // TODO: Send new message
    return res.status(200).json({ message: 'Message sent (placeholder)' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
