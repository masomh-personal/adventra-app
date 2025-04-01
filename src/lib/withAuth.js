import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';

export default function withAuth(Component) {
  return function AuthProtected(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkUser = async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error || !session) {
            await router.push('/login');
            return;
          }

          setUser(session.user);
        } catch (err) {
          console.error('Auth check error:', err);
          await router.push('/login');
        } finally {
          setLoading(false);
        }
      };

      checkUser();
    }, [router]);

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
