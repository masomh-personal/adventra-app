import supabase from '@/lib/supabaseClient';
import type { CreateProfileData, UserProfile } from '@/types/user';

/**
 * Create or update a user profile.
 * @param profileData - Profile info (user_id, bio, etc.)
 * @returns Updated profile
 */
export async function upsertProfile(profileData: CreateProfileData): Promise<UserProfile> {
    const { data, error } = await (supabase.from('profiles') as any)
        .upsert(profileData)
        .select()
        .single();

    if (error) throw new Error(error instanceof Error ? error.message : String(error));
    if (!data) throw new Error('Profile data was not returned from database');
    return data as UserProfile;
}

/**
 * Get profile by user ID.
 * @param userId - Associated user ID
 * @returns Profile or null
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await (supabase.from('profiles') as any)
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) throw new Error(error instanceof Error ? error.message : String(error));
    return (data as UserProfile) || null;
}
