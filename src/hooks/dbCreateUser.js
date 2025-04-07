import supabase from '@/lib/supabaseClient';

/**
 * Inserts a new user into the custom `public.user` table.
 * Call this right after successful Supabase auth signup.
 *
 * NOTE: This intentionally does not insert bio, status, etc. — those can be handled later on the profile page.
 *
 * @param {Object} userData - Data to insert
 * @param {string} userData.user_id - UUID from Supabase Auth
 * @param {string} userData.name - Full name
 * @param {string} userData.email - Email address
 * @returns {Promise<Object>} Inserted user record
 */
export async function dbCreateUser({ user_id, name, email }) {
  const { data, error } = await supabase
    .from('user')
    .insert([{ user_id, name, email }])
    .select()
    .single();

  if (error) {
    console.error('[DB Insert Error] Failed to create user:', error.message);
    throw new Error('Failed to create user in database');
  }

  return data;
}
