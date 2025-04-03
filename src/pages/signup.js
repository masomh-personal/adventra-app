import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signupSchema } from '@/validation/signupSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import supabase from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';
import DividerWithText from '@/components/DividerWithText';
import InfoBox from '@/components/InfoBox';

export default function SignupPage() {
  const router = useRouter();
  const { showErrorModal, showSuccessModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Catch known edge case: ghost user created but no identity
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

      // Signup success
      showSuccessModal(
        'Your account has been successfully created! Please check your email inbox (and spam folder) to verify your email address before logging in. Once verified, you can log in and begin using all the app features.',
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

          <FormField label="Email Address" type="email" id="email" placeholder="you@example.com" />

          <FormField
            label="Password"
            type="password"
            id="password"
            placeholder="Create a password"
            registerOptions={{
              minLength: {
                value: 10,
                message: 'Password must be at least 10 characters',
              },
            }}
          />

          <FormField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="Re-enter your password"
          />

          {/* InfoBox */}
          <InfoBox
            variant="info"
            message={
              <>
                Password must be at least <strong>10 characters</strong> and include an{' '}
                <strong>uppercase letter</strong>,<strong> lowercase letter</strong>, a{' '}
                <strong>number</strong>, and a <strong>special character</strong>.
              </>
            }
          />

          {/* Divider */}
          <DividerWithText />

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Login here
            </a>
          </p>
        </FormWrapper>
      </div>
    </div>
  );
}
