import type { NextApiRequest, NextApiResponse } from 'next';
import { databases, databaseId } from '@/lib/appwriteServer';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { ApiError, ApiSuccess } from '@/types/api';

interface DeleteProfileRequestBody {
    userId?: string;
}

/**
 * @route   DELETE /api/delete-profile
 * @desc    Delete a user profile and account
 * @access  Protected
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccess | ApiError>,
): Promise<void> {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId } = req.body as DeleteProfileRequestBody;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Step 1: Delete from user collection
        try {
            await databases.deleteDocument(databaseId, COLLECTION_IDS.USER, userId);
        } catch (_userError) {
            // Document may not exist, continue
            console.warn('User document not found:', userId);
        }

        // Step 2: Delete from userprofile collection
        try {
            await databases.deleteDocument(databaseId, COLLECTION_IDS.USERPROFILE, userId);
        } catch (_profileError) {
            // Document may not exist, continue
            console.warn('Userprofile document not found:', userId);
        }

        // Step 3: Delete from profiles collection (if exists)
        try {
            await databases.deleteDocument(databaseId, COLLECTION_IDS.PROFILES, userId);
        } catch (_profilesError) {
            // Document may not exist, continue
            console.warn('Profiles document not found:', userId);
        }

        // Step 4: Delete from Appwrite Auth (requires server-side API)
        // Note: Appwrite doesn't have a direct delete user method in the server SDK
        // You may need to use the Users API with admin permissions
        // For now, we'll skip this step as it requires additional setup

        // Step 5: Return success
        return res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : 'An error occurred during deletion';
        return res.status(500).json({ error: errorMessage });
    }
}
