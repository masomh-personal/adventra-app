import supabase from './supabaseClient';

export async function getCurrentUserId() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user?.id ?? null;
}
