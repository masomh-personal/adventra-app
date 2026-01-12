import type { SupabaseClient } from '@supabase/supabase-js';

// Database type will be generated from Supabase schema
// For now, use a more specific type that matches the actual schema structure
// Note: Supabase client typing will be relaxed until proper schema types are generated
export interface Database {
    public: {
        Tables: {
            userprofile: {
                Row: {
                    user_id: string;
                    bio?: string | null;
                    adventure_preferences?: string[] | null;
                    skill_summary?: Record<string, string> | null;
                    profile_image_url?: string | null;
                    birthdate?: string | null;
                    instagram_url?: string | null;
                    facebook_url?: string | null;
                    dating_preferences?: string | null;
                };
                Insert: {
                    user_id: string;
                    bio?: string | null;
                    adventure_preferences?: string[] | null;
                    skill_summary?: Record<string, string> | null;
                    profile_image_url?: string | null;
                    birthdate?: string | null;
                    instagram_url?: string | null;
                    facebook_url?: string | null;
                    dating_preferences?: string | null;
                };
                Update: {
                    user_id?: string;
                    bio?: string | null;
                    adventure_preferences?: string[] | null;
                    skill_summary?: Record<string, string> | null;
                    profile_image_url?: string | null;
                    birthdate?: string | null;
                    instagram_url?: string | null;
                    facebook_url?: string | null;
                    dating_preferences?: string | null;
                };
            };
            user: {
                Row: {
                    user_id: string;
                    name: string;
                    email: string;
                };
                Insert: {
                    user_id: string;
                    name: string;
                    email: string;
                };
                Update: {
                    user_id?: string;
                    name?: string;
                    email?: string;
                };
            };
            profiles: {
                Row: {
                    id?: string;
                    full_name?: string;
                    created_at?: string;
                    [key: string]: unknown;
                };
                Insert: {
                    id?: string;
                    full_name?: string;
                    created_at?: string;
                    [key: string]: unknown;
                };
                Update: {
                    id?: string;
                    full_name?: string;
                    created_at?: string;
                    [key: string]: unknown;
                };
            };
            matches: {
                Row: {
                    user_id: string;
                    matched_user_id: string;
                    status?: string | null;
                    created_at?: string | null;
                };
                Insert: {
                    user_id: string;
                    matched_user_id: string;
                    status?: string | null;
                    created_at?: string | null;
                };
                Update: {
                    user_id?: string;
                    matched_user_id?: string;
                    status?: string | null;
                    created_at?: string | null;
                };
            };
            messages: {
                Row: {
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    created_at?: string | null;
                    conversation_id?: string | null;
                    message_id?: string | null;
                };
                Insert: {
                    sender_id: string;
                    receiver_id: string;
                    content: string;
                    created_at?: string | null;
                    conversation_id?: string | null;
                    message_id?: string | null;
                };
                Update: {
                    sender_id?: string;
                    receiver_id?: string;
                    content?: string;
                    created_at?: string | null;
                    conversation_id?: string | null;
                    message_id?: string | null;
                };
            };
            users: {
                Row: {
                    id: string;
                    user_id: string;
                    email: string;
                    [key: string]: unknown;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    email: string;
                    [key: string]: unknown;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    email?: string;
                    [key: string]: unknown;
                };
            };
            conversations: {
                Row: {
                    conversation_id: string;
                    user_1_id: string;
                    user_2_id: string;
                    last_message_timestamp?: string | null;
                };
                Insert: {
                    conversation_id?: string;
                    user_1_id: string;
                    user_2_id: string;
                    last_message_timestamp?: string | null;
                };
                Update: {
                    conversation_id?: string;
                    user_1_id?: string;
                    user_2_id?: string;
                    last_message_timestamp?: string | null;
                };
            };
        };
    };
}

// Supabase client types
export type TypedSupabaseClient = SupabaseClient<Database>;

// You can generate Database types from Supabase using:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
// For now, we'll use the interface defined above
