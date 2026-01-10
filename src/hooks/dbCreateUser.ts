import supabase from '@/lib/supabaseClient';
import type { User } from '@/types/user';

export interface DbCreateUserParams {
  user_id: string;
  name: string;
  email: string;
  birthdate?: string;
}

/**
 * Inserts a user into `public.user` and a matching profile into `public.userprofile`.
 *
 * @param userData
 * @param userData.user_id - Supabase Auth UUID
 * @param userData.name - Full name
 * @param userData.email - Email
 * @param userData.birthdate - Optional ISO string
 * @returns The inserted user record
 */
export async function dbCreateUser({ user_id, name, email, birthdate }: DbCreateUserParams): Promise<User> {
  const { data: userData, error: userError } = await (supabase.from('user') as unknown as {
    insert: (values: unknown[]) => { select: () => { single: () => Promise<{ data: User | null; error: { message: string } | null }> } };
  })
    .insert([{ user_id, name, email }])
    .select()
    .single();

  if (userError) {
    const errorMessage = userError instanceof Error ? userError.message : String(userError);
    console.error('[DB Insert Error] Failed to create user:', errorMessage);
    throw new Error('Failed to create user in database');
  }

  const { error: profileError } = await (supabase.from('userprofile') as unknown as {
    upsert: (values: unknown[], options?: { onConflict?: string }) => Promise<{ error: { message: string } | null }>;
  })
    .upsert([{ user_id, birthdate }], { onConflict: 'user_id' });

  if (profileError) {
    const errorMessage = profileError instanceof Error ? profileError.message : String(profileError);
    console.error('[DB Insert Error] Failed to create userprofile:', errorMessage);
    throw new Error('Failed to create user profile in database');
  }

  if (!userData) {
    throw new Error('User data was not returned from database');
  }

  return userData as User;
}
