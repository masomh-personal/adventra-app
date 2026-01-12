import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import { Query, ID } from 'appwrite';

export interface MatchData {
    user_id: string;
    matched_user_id: string;
    status?: string;
    created_at?: string;
}

/**
 * Record a match between two users.
 * @param matchData - Contains user IDs (e.g., user_id, matched_user_id)
 * @returns New match record
 */
export async function createMatch(matchData: MatchData): Promise<MatchData> {
    try {
        const document = await databases.createDocument(
            databaseId,
            COLLECTION_IDS.MATCHES,
            ID.unique(), // Use auto-generated ID
            {
                user_id: matchData.user_id,
                matched_user_id: matchData.matched_user_id,
                status: matchData.status || null,
                created_at: matchData.created_at || new Date().toISOString(),
            },
        );

        return {
            user_id: document.user_id as string,
            matched_user_id: document.matched_user_id as string,
            status: (document.status as string) || null,
            created_at: (document.created_at as string) || null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}

/**
 * Get matches for a user.
 * @param userId - User ID to fetch matches for
 * @returns List of matches
 */
export async function getUserMatches(userId: string): Promise<MatchData[]> {
    try {
        const response = await databases.listDocuments(databaseId, COLLECTION_IDS.MATCHES, [
            Query.equal('user_id', userId),
        ]);

        return response.documents.map(doc => ({
            user_id: doc.user_id as string,
            matched_user_id: doc.matched_user_id as string,
            status: (doc.status as string) || null,
            created_at: (doc.created_at as string) || null,
        }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}
