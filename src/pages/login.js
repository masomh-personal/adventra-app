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

export default function LoginPage() {
  const router = useRouter();
  const { showErrorModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [showMagicForm, setShowMagicForm] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');

  // Email/password login
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

  // Supabase Magic Link
  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    if (!magicEmail) return;

    const mlErrorText = '⚠️ Magic Link Error';
    const mlSuccessTest = '✅ Magic Link Sent';

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: magicEmail,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return showErrorModal('Unable to send magic link. Please try again.', mlErrorText);
      }

      showErrorModal('Check your email inbox for a secure login link!', mlSuccessTest);
      setMagicEmail('');
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
      '⚠️ SSO Under Development'
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
          {/*<FormField type="checkbox" id="rememberMe" label="Remember me" />*/}

          <p className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </FormWrapper>

        {/* Magic Link Section */}
        <div className="mt-6">
          {!showMagicForm ? (
            <Button
              label="Login with One-Time Email Link"
              onClick={() => setShowMagicForm(true)}
              variant="subtle"
              className="text-sm w-full"
              size="base"
            />
          ) : (
            <form onSubmit={handleMagicLinkLogin} className="space-y-3 animate-fade-in">
              <input
                type="email"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-4 justify-center">
                <Button
                  type="submit"
                  label="Send One-Time Link"
                  variant="secondary"
                  size="base"
                  disabled={loading}
                />
                <Button
                  type="button"
                  label="Cancel"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMagicEmail('');
                    setShowMagicForm(false);
                  }}
                />
              </div>
            </form>
          )}
        </div>

        {/* Divider */}
        <DividerWithText text="Or continue with" />

        {/* SSO Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {ssoProviders.map(({ name, icon, bg, text, border, hover }) => (
            <button
              key={name}
              onClick={() => handleSSOLogin(name)}
              disabled={loading}
              className={`flex items-center justify-center py-2 px-4 rounded-md shadow-sm text-sm font-black ${bg} ${text} ${border || ''} ${hover} transition`}
            >
              {icon}
              {name}
            </button>
          ))}
        </div>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
