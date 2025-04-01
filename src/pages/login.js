import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { loginSchema } from '@/validation/loginSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import supabase from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';

export default function LoginPage() {
  const router = useRouter();
  const { showErrorModal } = useModal();

  const [loading, setLoading] = React.useState(false);

  // Handles standard login with email and password
  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        switch (error.message) {
          case 'Invalid login credentials':
            showErrorModal('Invalid email or password. Please try again.', 'Login Failed');
            break;
          case 'Email not confirmed':
            showErrorModal('Please verify your email before logging in.', 'Email Not Confirmed');
            break;
          default:
            showErrorModal('An unexpected error occurred. Please try again later.', 'Login Error');
        }
        return;
      }

      if (data?.user) {
        await router.replace('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      showErrorModal('An unexpected error occurred during login.', 'Login Error');
    } finally {
      setLoading(false);
    }
  };

  // Handles third-party OAuth login
  const handleSSOLogin = async (provider) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        showErrorModal(`Failed to login with ${provider}: ${error.message}`, 'SSO Login Failed');
      }
    } catch (err) {
      console.error(`SSO login error with ${provider}:`, err);
      showErrorModal(`An unexpected error occurred with ${provider} login.`, 'SSO Login Error');
    } finally {
      setLoading(false);
    }
  };

  // Handles form validation errors
  const handleFormError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8">
        <h2 className="text-3xl font-heading text-center mb-2">🏕️ Login to Adventra</h2>
        <hr className="border-t border-gray-300 mb-6" />

        <FormWrapper
          validationSchema={loginSchema}
          onSubmit={handleLogin}
          onError={handleFormError}
          submitLabel={loading ? 'Logging in...' : 'Login'}
          loading={loading}
        >
          <FormField label="Email Address" type="email" id="email" placeholder="you@example.com" />
          <FormField
            label="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          <FormField type="checkbox" id="rememberMe" label="Remember me" />

          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </FormWrapper>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* SSO Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSSOLogin('google')}
            disabled={loading}
            className="flex items-center justify-center py-2 px-4 rounded-md shadow-sm bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow"
          >
            <svg
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="mr-2"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Google
          </button>

          <button
            onClick={() => handleSSOLogin('facebook')}
            disabled={loading}
            className="flex items-center justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.063 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
