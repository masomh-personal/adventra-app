// Appwrite collection types
// Note: Appwrite uses document IDs, but we'll use custom IDs for user_id references
// Appwrite stores data as documents with attributes matching the schema

export interface AppwriteUser {
    $id: string; // Appwrite document ID (will use user_id as $id)
    user_id: string;
    name: string;
    email: string;
}

export interface AppwriteUserProfile {
    $id: string; // Appwrite document ID (will use user_id as $id)
    user_id: string;
    bio?: string | null;
    adventure_preferences?: string[] | null;
    skill_summary?: string | null; // JSON stored as string in Appwrite
    profile_image_url?: string | null;
    birthdate?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
    dating_preferences?: string | null;
}

export interface AppwriteProfile {
    $id: string;
    id: string;
    full_name?: string | null;
    created_at?: string | null;
}

export interface AppwriteMatch {
    $id: string;
    user_id: string;
    matched_user_id: string;
    status?: string | null;
    created_at?: string | null;
}

export interface AppwriteMessage {
    $id: string;
    message_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    conversation_id?: string | null;
    created_at?: string | null;
}

export interface AppwriteConversation {
    $id: string;
    conversation_id: string;
    user_1_id: string;
    user_2_id: string;
    last_message_timestamp?: string | null;
}

// Helper type for Appwrite database responses
export type AppwriteDocument<T> = T & {
    $id: string;
    $createdAt?: string;
    $updatedAt?: string;
    $permissions?: string[];
    $collectionId?: string;
    $databaseId?: string;
};

// Collection IDs - these should match what's set up in Appwrite
export const COLLECTION_IDS = {
    USER: 'user',
    USERPROFILE: 'userprofile',
    PROFILES: 'profiles',
    MATCHES: 'matches',
    MESSAGES: 'messages',
    CONVERSATIONS: 'conversations',
} as const;
