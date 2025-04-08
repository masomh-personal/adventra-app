import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';

export default function withAuth(Component, options = {}) {
  const { redirectIfAuthenticated = false } = options;

  return function AuthProtected(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      (async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          // Check for any errors during session retrieval
          if (error) {
            console.error('Session retrieval error:', error);
            // Optionally, you might want to set user to null or handle the error differently
            setUser(null);
            return;
          }

          if (session) {
            setUser(session.user);

            // Only redirect if redirectIfAuthenticated is true
            if (redirectIfAuthenticated) {
              await router.push('/dashboard');
              return;
            }
          }

          // If no session and not redirecting, set user to null
          if (!session) {
            setUser(null);
          }
        } catch (err) {
          console.error('Unexpected auth check error:', err);
          setUser(null);
        } finally {
          setLoading(false);
        }
      })();
    }, [router, redirectIfAuthenticated]);

    if (loading) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    return <Component {...props} user={user} />;
  };
}
