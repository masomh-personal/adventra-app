import React, { useState } from 'react';
import Link from 'next/link';
import * as yup from 'yup';
import { emailValidation } from '@/validation/validationUtils';
import supabase from '@/lib/supabaseClient';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import InfoBox from '@/components/InfoBox';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // ✅ using your component

const forgotPasswordSchema = yup.object({
  email: emailValidation,
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setSubmittedEmail(data.email);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);

      if (error) {
        setError(error.message || 'Failed to send reset email. Please try again.');
      } else {
        setSuccess(
          `If an account with ${data.email} exists, you will receive password reset instructions shortly.`
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8">
        <h2 className="text-3xl font-heading text-center mb-2">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        <hr className="border-t border-gray-300 mb-6" />

        {/* InfoBox for error */}
        {error && <InfoBox variant="error" message={error} testId="forgot-password-error" />}

        {/* InfoBox for success */}
        {success && (
          <InfoBox variant="success" message={success} testId="forgot-password-success" />
        )}

        {!success ? (
          <FormWrapper
            validationSchema={forgotPasswordSchema}
            onSubmit={handleForgotPassword}
            onError={handleFormError}
            submitLabel="Send Reset Link"
            loading={loading}
          >
            <FormField
              label="Email Address"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
          </FormWrapper>
        ) : (
          <div className="text-center mt-4">
            <p className="mb-4">You can close this page or return to login below.</p>
            <Link
              data-testid="return-to-login-link"
              href="/login"
              className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Return to Login
            </Link>
          </div>
        )}

        {!success && (
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <AiOutlineArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
