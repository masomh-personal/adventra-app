import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Environment variables for private keys (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for the server.');
}

// Server-side supabase client using service role key
// Note: Type assertions needed until proper Supabase schema types are generated
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabaseAdmin;
