import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signupSchema } from '@/validation/signupSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import DividerWithText from '@/components/DividerWithText';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import supabase from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';
import Button from '@/components/Button';

export default function SignupPage() {
  const router = useRouter();
  const { showErrorModal, showSuccessModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  const handleSignup = async ({ name, email, password }) => {
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (data?.user && data.user.identities?.length === 0) {
        return showErrorModal(
          'This email is already registered and awaiting confirmation. Please check your inbox or spam folder.',
          'Signup Already Pending'
        );
      }

      if (error || !data?.user) {
        const errMsg =
          error?.message === 'User already registered'
            ? 'This email is already registered. Please log in instead.'
            : error?.message || 'Signup failed. Please try again.';

        const title =
          error?.message === 'User already registered' || !data?.user
            ? 'Signup Error'
            : 'Unexpected Error';

        return showErrorModal(errMsg, title);
      }

      showSuccessModal(
        'Your account has been successfully created! Please check your email inbox (and spam folder) to verify your email address before logging in.',
        'Signup Successful!',
        () => router.push('/'),
        'Go to Homepage'
      );
    } catch (err) {
      console.error('Unexpected signup error:', err);
      showErrorModal('An unexpected error occurred. Please try again.', 'Signup Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8">
        <h2 className="text-3xl font-heading text-center mb-2">🏕️ Create Your Account</h2>
        <hr className="border-t border-gray-300 mb-6" />

        <FormWrapper
          validationSchema={signupSchema}
          onSubmit={handleSignup}
          onError={handleFormError}
          submitLabel={isSubmitting ? 'Signing Up...' : 'Sign Up'}
          loading={isSubmitting}
        >
          <FormField label="Full Name" type="text" id="name" placeholder="Your name" />

          <FormField
            label="Email Address"
            type="email"
            id="email"
            placeholder="you@example.com"
            autoComplete="email"
          />

          <FormField
            label="Password"
            id="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordStrengthMeter password={password} />

          <FormField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="Re-enter your password"
            onPaste={(e) => e.preventDefault()}
            autoComplete="new-password"
          />

          <DividerWithText />

          <p className="text-center text-sm mt-4 flex items-center justify-center gap-2 flex-wrap">
            Already have an account?
            <Button
              as="a"
              href="/login"
              label="Log in"
              variant="secondary"
              size="sm"
              className="text-sm px-2 py-1"
              aria-label="Go to login page"
              testId="login-button"
            />
          </p>
        </FormWrapper>
      </div>
    </div>
  );
}
