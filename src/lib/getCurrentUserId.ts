import supabase from './supabaseClient';

/**
 * Retrieves the current authenticated user's Supabase UUID.
 *
 * This function uses Supabase's `getSession` to access the current session data
 * and extracts the `user.id` from it. If no session is active, it returns `null`.
 * If Supabase encounters an error, the error is thrown.
 *
 * @returns The UUID of the authenticated user, or `null` if not logged in.
 * @throws {Error} If fetching the session fails.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  return session?.user?.id ?? null;
}
