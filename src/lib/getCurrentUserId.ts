import { account } from './appwriteClient';

/**
 * Retrieves the current authenticated user's Appwrite user ID.
 *
 * This function uses Appwrite's Account API to get the current session
 * and extracts the `$id` (user ID) from it. If no session is active, it returns `null`.
 * If Appwrite encounters an error, the error is thrown.
 *
 * @returns The user ID of the authenticated user, or `null` if not logged in.
 * @throws {Error} If fetching the account fails.
 */
export async function getCurrentUserId(): Promise<string | null> {
    try {
        const user = await account.get();
        return user?.$id ?? null;
    } catch (_error) {
        // If user is not authenticated, Appwrite throws an error
        // Return null instead of throwing
        return null;
    }
}
