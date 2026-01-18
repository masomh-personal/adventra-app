import type { NextApiRequest, NextApiResponse } from 'next';
import { account, databases, databaseId } from '@/lib/appwriteServer';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { ApiError, ApiSuccess } from '@/types/api';
import { ID } from 'appwrite';

interface SignupRequestBody {
    email?: string;
    password?: string;
    fullName?: string;
}

/**
 * @route   POST /api/auth/signup
 * @desc    Handle new user signup requests
 * @access  Public
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccess | ApiError>,
): Promise<void> {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password, fullName } = req.body as SignupRequestBody;

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Sign up the user using Appwrite Auth (server-side)
        // Note: Server-side signup creates the user but doesn't create a session
        // The client should handle session creation after signup
        const user = await account.create(ID.unique(), email, password, fullName);

        if (!user) {
            return res.status(400).json({ error: 'User creation failed' });
        }

        // Insert additional user profile data into 'profiles' collection
        try {
            await databases.createDocument(databaseId, COLLECTION_IDS.PROFILES, user.$id, {
                id: user.$id,
                full_name: fullName,
                created_at: new Date().toISOString(),
            });
        } catch (profileError) {
            const errorMessage =
                profileError instanceof Error ? profileError.message : String(profileError);
            return res.status(500).json({ error: errorMessage });
        }

        return res.status(201).json({ message: 'User signed up successfully', data: user });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Server error';
        return res.status(500).json({ error: errorMessage });
    }
}
