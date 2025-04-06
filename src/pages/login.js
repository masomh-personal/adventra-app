import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { loginSchema } from '@/validation/loginSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import supabase from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaInstagram, FaApple } from 'react-icons/fa';
import Button from '@/components/Button';
import DividerWithText from '@/components/DividerWithText';
import MagicLinkForm from '@/components/MagicLinkForm';

export default function LoginPage() {
  const router = useRouter();
  const { showErrorModal, showSuccessModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [showMagicForm, setShowMagicForm] = useState(false);

  // Handle standard login
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const errorMsg =
          error.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please try again.'
            : error.message === 'Email not confirmed'
              ? 'Please verify your email before logging in.'
              : 'An unexpected error occurred. Please try again.';

        const title =
          error.message === 'Invalid login credentials'
            ? 'Login Failed'
            : error.message === 'Email not confirmed'
              ? 'Email Not Confirmed'
              : 'Login Error';

        return showErrorModal(errorMsg, title);
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

  // Handle magic link login
  const handleMagicLinkLogin = async ({ email }) => {
    const mlErrorText = 'Magic Link Error';
    const mlSuccessText = 'Magic Link Sent';

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return showErrorModal('Unable to send magic link. Please try again.', mlErrorText);
      }

      showSuccessModal('Check your email inbox for a secure login link!', mlSuccessText);
      setShowMagicForm(false);
    } catch (err) {
      console.error('Magic link error:', err);
      showErrorModal('Something went wrong. Please try again.', mlErrorText);
    } finally {
      setLoading(false);
    }
  };

  const handleFormError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  const handleSSOLogin = (provider) => {
    showErrorModal(
      `We are so sorry, SSO login with ${provider} is currently under development.`,
      'SSO Under Development'
    );
  };

  const ssoProviders = [
    {
      name: 'Google',
      icon: <FcGoogle className="h-5 w-5 mr-2" />,
      bg: 'bg-white',
      text: 'text-gray-700',
      border: 'border border-gray-300',
      hover: 'hover:shadow-md',
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="h-5 w-5 mr-2" />,
      bg: 'bg-[#1877F2]',
      text: 'text-white',
      hover: 'hover:bg-[#166FE5]',
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="h-5 w-5 mr-2" />,
      bg: 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600',
      text: 'text-white',
      hover: 'hover:opacity-90',
    },
    {
      name: 'Apple',
      icon: <FaApple className="h-5 w-5 mr-2" />,
      bg: 'bg-black',
      text: 'text-white',
      hover: 'hover:bg-gray-900',
    },
  ];

  return (
    <div
      className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body"
      data-testid="login-page"
    >
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8">
        <h2 className="text-3xl font-heading text-center mb-2">🏕️ Login to Adventra</h2>
        <hr className="border-t border-gray-300 mb-6" />

        {/* Standard Email/Password Login Form */}
        {!showMagicForm && (
          <FormWrapper
            validationSchema={loginSchema}
            onSubmit={handleLogin}
            onError={handleFormError}
            submitLabel={loading ? 'Logging in...' : 'Login'}
            loading={loading}
            formProps={{ 'data-testid': 'login-form' }}
          >
            <FormField
              label="Email Address"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
            <FormField
              label="Password"
              type="password"
              id="password"
              placeholder="Enter your password"
            />
            <p className="text-center text-sm mt-4 flex items-center justify-center gap-2 flex-wrap">
              Don’t have an account?
              <Button
                as="a"
                href="/signup"
                label="Signup for free!"
                variant="outline"
                size="sm"
                className="text-sm px-2 py-1"
                aria-label="Go to signup page"
                testId="signup-button"
              />
            </p>
          </FormWrapper>
        )}

        {/* Magic Link Section */}
        <div className="mt-6">
          {!showMagicForm ? (
            <Button
              label="Login with One-Time Email Link"
              onClick={() => {
                if (!loading) setShowMagicForm(true);
              }}
              variant="secondary"
              className="text-sm w-full"
              size="base"
              aria-label="Switch to magic link login"
              testId="show-magic"
            />
          ) : (
            <MagicLinkForm
              loading={loading}
              onSubmit={handleMagicLinkLogin}
              onCancel={() => {
                if (!loading) setShowMagicForm(false);
              }}
            />
          )}
        </div>

        {/* Divider */}
        <DividerWithText text="or continue with" />

        {/* SSO Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {ssoProviders.map(({ name, icon, bg, text, border, hover }) => (
            <button
              key={name}
              onClick={() => handleSSOLogin(name)}
              disabled={loading}
              className={`flex items-center justify-center py-2 px-4 rounded-md shadow-sm text-sm font-black ${bg} ${text} ${border || ''} ${hover} transition`}
              aria-label={`Login with ${name}`}
              data-testid={`sso-${name.toLowerCase()}`}
            >
              {icon}
              {name}
            </button>
          ))}
        </div>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
