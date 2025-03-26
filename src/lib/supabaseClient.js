import { createClient } from '@supabase/supabase-js';

/**
 * Initialize and export the Supabase client.
 * This client is reused across the app to interact with Supabase services.
 */

// Environment variables (keep them secure!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
