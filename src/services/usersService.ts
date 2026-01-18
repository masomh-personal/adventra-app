import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { User } from '@/types/user';

/**
 * Create a new user record in the database.
 * @param userData - User info to insert (user_id, name, email, etc.)
 * @returns Result or error
 */
export async function createUser(userData: {
    user_id: string;
    name: string;
    email: string;
}): Promise<User> {
    try {
        const document = await databases.createDocument(
            databaseId,
            COLLECTION_IDS.USER,
            userData.user_id, // Use user_id as document ID
            {
                user_id: userData.user_id,
                name: userData.name,
                email: userData.email,
            },
        );

        return {
            user_id: document.user_id as string,
            name: document.name as string,
            email: document.email as string,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}

/**
 * Fetch a user by ID
 * @param id - User ID
 * @returns User or null
 */
export async function getUserById(id: string): Promise<User | null> {
    try {
        const document = await databases.getDocument(databaseId, COLLECTION_IDS.USER, id);

        return {
            user_id: document.user_id as string,
            name: document.name as string,
            email: document.email as string,
        };
    } catch (_error) {
        // Document not found or other error
        return null;
    }
}
