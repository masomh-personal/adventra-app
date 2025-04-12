import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signupSchema } from '@/validation/signupSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import supabase from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';
import Button from '@/components/Button';
import { dbCreateUser } from '@/hooks/dbCreateUser';

export default function SignupPage() {
  const router = useRouter();
  const { showErrorModal, showSuccessModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  const handleSignup = async ({ name, email, password, birthdate }) => {
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

      // Case: Duplicate email or other Supabase signup error
      // NOTE: we turned off email confirmation requirement
      if (error || !data?.user) {
        const isDuplicate = error?.message === 'User already registered';

        const errMsg = isDuplicate
          ? 'This email is already registered. Please log in instead or reset your password if needed.'
          : error?.message || 'Signup failed. Please try again.';

        const title = isDuplicate ? 'Email Already Registered' : 'Signup Error';

        return showErrorModal(errMsg, title);
      }

      // Create custom user record in public.user (after adding to auth.user with Supabase)
      try {
        await dbCreateUser({
          user_id: data.user.id,
          name,
          email,
          birthdate,
        });
      } catch (dbError) {
        console.error('User created in auth but failed in custom DB:', dbError.message);
        return showErrorModal(
          'Signup succeeded but an internal error occurred when saving your profile. Please contact support.',
          'Signup Incomplete'
        );
      }

      // Final success message
      showSuccessModal(
        'Your account is all set — time to lace up those hiking boots and find your next adventuring partner!',
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
            label="Date of Birth"
            id="birthdate"
            type="date"
            registerOptions={{
              max: new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString()
                .split('T')[0],
            }}
          />

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
        </FormWrapper>

        <div className="text-center text-sm mt-4 flex items-center justify-center gap-2 flex-wrap">
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
        </div>
      </div>
    </div>
  );
}
