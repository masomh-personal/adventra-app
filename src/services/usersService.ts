import supabase from '@/lib/supabaseClient';
import type { User, CreateUserData } from '@/types/user';

/**
 * Create a new user record in the database.
 * @param userData - User info to insert (id, email, etc.)
 * @returns Result or error
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('users') as any).insert([userData]).select().single();

  if (error) throw new Error(error instanceof Error ? error.message : String(error));
  if (!data) throw new Error('User data was not returned from database');
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
