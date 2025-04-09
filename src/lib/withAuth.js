import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';

export default function withAuth(Component, options = {}) {
  const { redirectIfAuthenticated = false } = options;

  // It's good practice to give HOCs a display name for debugging
  const displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;

  function AuthProtected(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      // Using a flag to prevent state updates after unmount
      let isMounted = true;

      const checkAuth = async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (!isMounted) return; // Don't proceed if unmounted

          // Check for any errors during session retrieval
          if (error) {
            console.error('Session retrieval error:', error);
            setUser(null);
            setLoading(false); // Ensure loading stops on error
            return;
          }

          if (session) {
            setUser(session.user);
            // Only redirect if redirectIfAuthenticated is true and component is still mounted
            if (redirectIfAuthenticated) {
              // No need to setLoading(false) here as the redirect will unmount
              await router.push('/dashboard');
              return; // Stop execution after initiating redirect
            }
          } else {
            // If no session and not redirecting, set user to null
            setUser(null);
          }
        } catch (err) {
          console.error('Unexpected auth check error:', err);
          if (isMounted) {
            setUser(null); // Ensure user is null on unexpected error
          }
        } finally {
          // Only set loading to false if the component is still mounted
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      checkAuth();

      // Cleanup function to set the flag when the component unmounts
      return () => {
        isMounted = false;
      };
      // Only include router in the dependency array
    }, [router]); // Removed redirectIfAuthenticated

    if (loading) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    // Pass the user prop down to the wrapped component
    return <Component {...props} user={user} />;
  }

  AuthProtected.displayName = displayName; // Assign the display name

  return AuthProtected;
}
