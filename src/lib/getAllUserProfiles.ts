import { databases, databaseId } from './appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { FullUserProfile } from '@/types/user';
import { calcAgeFromBirthdate } from './calcAgeFromBirthdate';

/**
 * Fetches all user profiles from the database and randomizes them.
 * Note: Appwrite doesn't support joins, so we fetch userprofile and user separately, then combine.
 *
 * @returns List of user profiles
 */
export async function getAllUserProfiles(): Promise<FullUserProfile[]> {
    try {
        // Fetch all user profiles
        const profilesResponse = await databases.listDocuments(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
        );

        if (!profilesResponse.documents || profilesResponse.documents.length === 0) {
            return [];
        }

        // Fetch all users (we'll match them by user_id)
        const usersResponse = await databases.listDocuments(databaseId, COLLECTION_IDS.USER);

        // Create a map of users by user_id for quick lookup
        const usersMap = new Map<string, { name: string; email: string }>();
        usersResponse.documents.forEach(userDoc => {
            usersMap.set(userDoc.user_id as string, {
                name: userDoc.name as string,
                email: userDoc.email as string,
            });
        });

        // Transform Appwrite response to match our type
        const profiles: FullUserProfile[] = profilesResponse.documents.map(doc => {
            const userId = doc.user_id as string;
            const user = usersMap.get(userId) || null;

            const profile: FullUserProfile = {
                user_id: userId,
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
                user,
                age: doc.birthdate ? calcAgeFromBirthdate(doc.birthdate as string) : null,
            };

            return profile;
        });

        // Randomize the profiles
        return profiles.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error('Error fetching user profiles:', error);
        return [];
    }
}
