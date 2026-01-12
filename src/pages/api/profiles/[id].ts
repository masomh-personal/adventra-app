import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiError, ApiSuccess } from '@/types/api';

/**
 * @route   GET /api/profiles/[id]
 * @desc    Fetch or update a user profile by ID
 * @access  Protected
 */
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccess | ApiError>,
): void {
    const { id } = req.query;
    const profileId = Array.isArray(id) ? id[0] : id;

    if (req.method === 'GET') {
        // TODO: Fetch profile by ID
        return res.status(200).json({ message: `Fetch profile for ID: ${profileId}` });
    }

    if (req.method === 'PUT') {
        // TODO: Update profile by ID
        return res.status(200).json({ message: `Update profile for ID: ${profileId}` });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
