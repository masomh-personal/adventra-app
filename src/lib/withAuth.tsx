import { useEffect, useState, type ComponentType } from 'react';
import { useRouter } from 'next/router';
import { account } from './appwriteClient';
import type { Models } from 'appwrite';

interface WithAuthOptions {
    redirectIfAuthenticated?: boolean;
}

interface WithAuthProps {
    user: Models.User<Models.Preferences> | null;
}

export default function withAuth<P extends object>(
    Component: ComponentType<P & WithAuthProps>,
    options: WithAuthOptions = {},
) {
    // It's good practice to give HOCs a display name for debugging
    const displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;

    function AuthProtected(props: P) {
        const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
        const [loading, setLoading] = useState(true);
        const router = useRouter();
        // Move options destructuring inside component to satisfy React hooks rules
        const { redirectIfAuthenticated = false } = options;

        useEffect(() => {
            // Using a flag to prevent state updates after unmount
            let isMounted = true;

            const checkAuth = async (): Promise<void> => {
                try {
                    const currentUser = await account.get();

                    if (!isMounted) return; // Don't proceed if unmounted

                    if (currentUser) {
                        setUser(currentUser);
                        // Only redirect if redirectIfAuthenticated is true and component is still mounted
                        if (redirectIfAuthenticated) {
                            // No need to setLoading(false) here as the redirect will unmount
                            await router.push('/dashboard');
                            return; // Stop execution after initiating redirect
                        }
                    } else {
                        // If no user, set user to null
                        setUser(null);
                    }
                } catch (_err) {
                    // If user is not authenticated, Appwrite throws an error
                    // This is expected behavior - set user to null
                    if (isMounted) {
                        setUser(null);
                    }
                } finally {
                    // Only set loading to false if the component is still mounted
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };

            checkAuth();

            // Note: Appwrite doesn't have a built-in auth state listener like Supabase
            // You may need to implement custom polling or use Appwrite's Realtime (if needed)
            // For now, we just check once on mount

            // Cleanup function to set the flag when the component unmounts
            return () => {
                isMounted = false;
            };
            // redirectIfAuthenticated is a constant from options, but included for completeness
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [router]);

        if (loading) {
            return (
                <div className='w-full h-screen flex items-center justify-center'>
                    <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
                </div>
            );
        }

        // Pass the user prop down to the wrapped component
        return <Component {...props} user={user} />;
    }

    AuthProtected.displayName = displayName; // Assign the display name

    return AuthProtected;
}
