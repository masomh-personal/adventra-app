import { databases, databaseId } from './appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';
import type { FullUserProfile } from '@/types/user';

/**
 * Fetches the full user profile including profile data and user info (name, email).
 * Note: Appwrite doesn't support joins, so we fetch userprofile and user separately, then combine.
 *
 * @param uid - Appwrite Auth user ID (user_id)
 * @returns Full user profile or null on error
 */
export async function getFullUserProfile(
    uid: string | null | undefined,
): Promise<FullUserProfile | null> {
    if (!uid) return null;

    try {
        // Fetch user profile
        const profileDoc = await databases.getDocument(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
            uid, // Use uid as document ID
        );

        // Fetch user data
        let user: { name: string; email: string } | null = null;
        try {
            const userDoc = await databases.getDocument(databaseId, COLLECTION_IDS.USER, uid);
            user = {
                name: userDoc.name as string,
                email: userDoc.email as string,
            };
        } catch (_userError) {
            // User not found - this is okay, user will be null
            console.warn('User not found for profile:', uid);
        }

        const profileData: FullUserProfile = {
            user_id: profileDoc.user_id as string,
            bio: (profileDoc.bio as string) || null,
            adventure_preferences: (profileDoc.adventure_preferences as string[]) || null,
            skill_summary: profileDoc.skill_summary
                ? (JSON.parse(profileDoc.skill_summary as string) as Record<string, string>)
                : null,
            profile_image_url: (profileDoc.profile_image_url as string) || null,
            birthdate: (profileDoc.birthdate as string) || null,
            instagram_url: (profileDoc.instagram_url as string) || null,
            facebook_url: (profileDoc.facebook_url as string) || null,
            dating_preferences: (profileDoc.dating_preferences as string) || null,
            user,
            age: profileDoc.birthdate ? calcAgeFromBirthdate(profileDoc.birthdate as string) : null,
        };

        return profileData;
    } catch (error) {
        console.error('Error fetching full user profile:', error);
        return null;
    }
}
