import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import type { CreateProfileData, UserProfile } from '@/types/user';

/**
 * Create or update a user profile.
 * @param profileData - Profile info (user_id, bio, etc.)
 * @returns Updated profile
 */
export async function upsertProfile(profileData: CreateProfileData): Promise<UserProfile> {
    try {
        // Appwrite doesn't have upsert, so we try to update first, then create if it fails
        try {
            const document = await databases.updateDocument(
                databaseId,
                COLLECTION_IDS.USERPROFILE,
                profileData.user_id, // Use user_id as document ID
                {
                    user_id: profileData.user_id,
                    bio: profileData.bio || null,
                    adventure_preferences: profileData.adventure_preferences || null,
                    skill_summary: profileData.skill_summary
                        ? JSON.stringify(profileData.skill_summary)
                        : null,
                    profile_image_url: profileData.profile_image_url || null,
                    birthdate: profileData.birthdate || null,
                    instagram_url: profileData.instagram_url || null,
                    facebook_url: profileData.facebook_url || null,
                    dating_preferences: profileData.dating_preferences || null,
                },
            );

            return {
                user_id: document.user_id as string,
                bio: (document.bio as string) || null,
                adventure_preferences: (document.adventure_preferences as string[]) || null,
                skill_summary: document.skill_summary
                    ? (JSON.parse(document.skill_summary as string) as Record<string, string>)
                    : null,
                profile_image_url: (document.profile_image_url as string) || null,
                birthdate: (document.birthdate as string) || null,
                instagram_url: (document.instagram_url as string) || null,
                facebook_url: (document.facebook_url as string) || null,
                dating_preferences: (document.dating_preferences as string) || null,
            };
        } catch (_updateError) {
            // Document doesn't exist, create it
            const document = await databases.createDocument(
                databaseId,
                COLLECTION_IDS.USERPROFILE,
                profileData.user_id, // Use user_id as document ID
                {
                    user_id: profileData.user_id,
                    bio: profileData.bio || null,
                    adventure_preferences: profileData.adventure_preferences || null,
                    skill_summary: profileData.skill_summary
                        ? JSON.stringify(profileData.skill_summary)
                        : null,
                    profile_image_url: profileData.profile_image_url || null,
                    birthdate: profileData.birthdate || null,
                    instagram_url: profileData.instagram_url || null,
                    facebook_url: profileData.facebook_url || null,
                    dating_preferences: profileData.dating_preferences || null,
                },
            );

            return {
                user_id: document.user_id as string,
                bio: (document.bio as string) || null,
                adventure_preferences: (document.adventure_preferences as string[]) || null,
                skill_summary: document.skill_summary
                    ? (JSON.parse(document.skill_summary as string) as Record<string, string>)
                    : null,
                profile_image_url: (document.profile_image_url as string) || null,
                birthdate: (document.birthdate as string) || null,
                instagram_url: (document.instagram_url as string) || null,
                facebook_url: (document.facebook_url as string) || null,
                dating_preferences: (document.dating_preferences as string) || null,
            };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}

/**
 * Get profile by user ID.
 * @param userId - Associated user ID
 * @returns Profile or null
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
    try {
        const document = await databases.getDocument(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
            userId, // Use userId as document ID
        );

        return {
            user_id: document.user_id as string,
            bio: (document.bio as string) || null,
            adventure_preferences: (document.adventure_preferences as string[]) || null,
            skill_summary: document.skill_summary
                ? (JSON.parse(document.skill_summary as string) as Record<string, string>)
                : null,
            profile_image_url: (document.profile_image_url as string) || null,
            birthdate: (document.birthdate as string) || null,
            instagram_url: (document.instagram_url as string) || null,
            facebook_url: (document.facebook_url as string) || null,
            dating_preferences: (document.dating_preferences as string) || null,
        };
    } catch (_error) {
        // Document not found or other error
        return null;
    }
}
