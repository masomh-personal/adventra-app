import supabase from '@/lib/supabaseClient';
import type { User, CreateUserData } from '@/types/user';

/**
 * Create a new user record in the database.
 * @param userData - User info to insert (id, email, etc.)
 * @returns Result or error
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  const { data, error } = await supabase.from('users').insert([userData] as unknown[]).select().single();

  if (error) throw new Error(error.message);
  return data as User;
}

/**
 * Fetch a user by ID
 * @param id - User ID
 * @returns User or null
 */
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return data as User | null;
}
