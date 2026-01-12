import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiError, ApiSuccess } from '@/types/api';

/**
 * @route   GET /api/match/status
 * @desc    Get matched users for the current user
 * @access  Protected
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccess | ApiError>,
): void {
    if (req.method === 'GET') {
        // TODO: Return match status
        return res.status(200).json({ message: 'Match status fetched (placeholder)' });
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
