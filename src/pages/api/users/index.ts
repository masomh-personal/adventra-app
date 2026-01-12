import type { NextApiRequest, NextApiResponse } from 'next';
import { databases, databaseId } from '@/lib/appwriteServer';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { ApiError, UsersResponse } from '@/types/api';
import type { UserProfile } from '@/types/user';

/**
 * @route   GET /api/users
 * @desc    Fetch all user profiles from Appwrite
 * @access  Public
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UsersResponse | ApiError>,
): Promise<void> {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const response = await databases.listDocuments(databaseId, COLLECTION_IDS.USERPROFILE);

        const profiles: UserProfile[] = response.documents.map(doc => ({
            user_id: doc.user_id as string,
            bio: (doc.bio as string) || null,
            adventure_preferences: (doc.adventure_preferences as string[]) || null,
            skill_summary: doc.skill_summary
                ? (JSON.parse(doc.skill_summary as string) as Record<string, string>)
                : null,
            profile_image_url: (doc.profile_image_url as string) || null,
            birthdate: (doc.birthdate as string) || null,
            instagram_url: (doc.instagram_url as string) || null,
            facebook_url: (doc.facebook_url as string) || null,
            dating_preferences: (doc.dating_preferences as string) || null,
        }));

        return res.status(200).json({ profiles });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Server error';
        return res.status(500).json({ error: errorMessage });
    }
}
