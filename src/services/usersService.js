import { supabase } from '@/lib/supabaseClient';

/**
 * Create a new user record in the database.
 * @param {Object} userData - User info to insert (id, email, etc.)
 * @returns {Object} Result or error
 */
export async function createUser(userData) {
  const { data, error } = await supabase.from('users').insert([userData]);

  if (error) throw new Error(error.message);
  return data[0]; // return created user
}

/**
 * Fetch a user by ID
 * @param {string} id - User ID
 * @returns {Object} User or null
 */
export async function getUserById(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return data;
}
