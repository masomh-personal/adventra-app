// Using string types for flexibility with mock data
// In production, you might want stricter types like AdventurePreference[]

export interface User {
    user_id: string;
    name: string;
    email: string;
}

export interface UserProfile {
    user_id: string;
    bio?: string | null;
    adventure_preferences?: string[] | null; // Flexible for mock data
    skill_summary?: Record<string, string> | null; // Flexible for mock data
    profile_image_url?: string | null;
    birthdate?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
    dating_preferences?: string | null; // Flexible for mock data
}

export interface FullUserProfile extends UserProfile {
    user?: {
        name: string;
        email: string;
    } | null;
    age?: number | null;
}

export interface CreateUserData {
    user_id: string;
    name: string;
    email: string;
    birthdate: string;
}

export interface CreateProfileData {
    user_id: string;
    bio?: string;
    adventure_preferences?: string[];
    skill_summary?: Record<string, string>;
    profile_image_url?: string;
    birthdate?: string;
    instagram_url?: string;
    facebook_url?: string;
    dating_preferences?: string;
}
