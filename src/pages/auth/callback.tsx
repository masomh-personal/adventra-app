import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';

export default function AuthCallback(): React.JSX.Element {
    const router = useRouter();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const handleAuthRedirect = async (): Promise<void> => {
            try {
                // Supabase automatically handles the OAuth callback URL
                // and session creation from the URL hash
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    setError('Authentication failed. Please try again.');
                    await router.push('/login?error=Authentication failed');
                    return;
                }

                if (data?.session) {
                    // Successfully authenticated
                    await router.push('/dashboard');
                } else {
                    // No session found
                    setError('Could not complete login. Please try again.');
                    await router.push('/login');
                }
            } catch (err) {
                console.error('Error processing auth callback:', err);
                setError('An unexpected error occurred during login.');
                await router.push('/login');
            }
        };

        // Run the auth redirect handler
        handleAuthRedirect();
    }, [router]);

    return (
        <div className='w-full h-screen flex items-center justify-center bg-background'>
            <div className='text-center p-8 bg-white rounded-lg shadow-md max-w-md'>
                {error ? (
                    <div>
                        <h2 className='text-xl text-red-600 mb-4'>Login Error</h2>
                        <p className='mb-6 text-gray-700'>{error}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark'
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className='text-xl mb-4'>Completing your login...</h2>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto'></div>
                        <p className='mt-4 text-gray-600'>
                            Please wait while we complete your authentication.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
