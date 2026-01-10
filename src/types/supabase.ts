import type { SupabaseClient } from '@supabase/supabase-js';

// Database type will be generated from Supabase schema
// For now, use a placeholder that allows any tables
export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
}

// Supabase client types
export type TypedSupabaseClient = SupabaseClient<Database>;

// You can generate Database types from Supabase using:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
// For now, we'll create a placeholder

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
      profiles: {
        Row: {
          user_id: string;
          // Add other profile fields as needed
          [key: string]: unknown;
        };
        Insert: {
          user_id: string;
          [key: string]: unknown;
        };
        Update: {
          user_id?: string;
          [key: string]: unknown;
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
    };
  };
}
