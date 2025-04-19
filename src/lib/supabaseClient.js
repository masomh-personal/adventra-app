import { createClient } from '@supabase/supabase-js';

// Environment variables for public keys (client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables for the client.');
}

// Client-side (public) supabase client using anon key
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseAnon;
