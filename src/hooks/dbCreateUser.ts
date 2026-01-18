import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { User } from '@/types/user';

export interface DbCreateUserParams {
    user_id: string;
    name: string;
    email: string;
    birthdate?: string;
}

/**
 * Inserts a user into `user` collection and a matching profile into `userprofile` collection.
 *
 * @param userData
 * @param userData.user_id - Appwrite Auth user ID ($id)
 * @param userData.name - Full name
 * @param userData.email - Email
 * @param userData.birthdate - Optional ISO string
 * @returns The inserted user record
 */
export async function dbCreateUser({
    user_id,
    name,
    email,
    birthdate,
}: DbCreateUserParams): Promise<User> {
    try {
        // Create user document (use user_id as document ID)
        await databases.createDocument(databaseId, COLLECTION_IDS.USER, user_id, {
            user_id,
            name,
            email,
        });

        // Create or update userprofile document (use user_id as document ID)
        try {
            await databases.updateDocument(databaseId, COLLECTION_IDS.USERPROFILE, user_id, {
                user_id,
                birthdate: birthdate || null,
            });
        } catch (_updateError) {
            // If document doesn't exist, create it
            await databases.createDocument(databaseId, COLLECTION_IDS.USERPROFILE, user_id, {
                user_id,
                birthdate: birthdate || null,
            });
        }

        // Return user data
        return {
            user_id,
            name,
            email,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[DB Insert Error] Failed to create user:', errorMessage);
        throw new Error('Failed to create user in database');
    }
}
