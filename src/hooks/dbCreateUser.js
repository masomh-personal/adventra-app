import supabase from '@/lib/supabaseClient';

/**
 * Inserts a user into `public.user` and a matching profile into `public.userprofile`.
 *
 * @param {Object} userData
 * @param {string} userData.user_id - Supabase Auth UUID
 * @param {string} userData.name - Full name
 * @param {string} userData.email - Email
 * @param {string} [userData.birthdate] - Optional ISO string
 * @returns {Promise<Object>} - The inserted user record
 */
export async function dbCreateUser({ user_id, name, email, birthdate }) {
  const { data: userData, error: userError } = await supabase
    .from('user')
    .insert([{ user_id, name, email }])
    .select()
    .single();

  if (userError) {
    console.error('[DB Insert Error] Failed to create user:', userError.message);
    throw new Error('Failed to create user in database');
  }

  const { error: profileError } = await supabase
    .from('userprofile')
    .upsert([{ user_id, birthdate }], { onConflict: 'user_id' });

  if (profileError) {
    console.error('[DB Insert Error] Failed to create userprofile:', profileError.message);
    throw new Error('Failed to create user profile in database');
  }

  return userData;
}
