import React, { useState } from 'react';
import Link from 'next/link';
import * as yup from 'yup';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import { emailValidation } from '@/validation/validationUtils';

// Simple validation schema using your existing email validation
const forgotPasswordSchema = yup.object({
  email: emailValidation,
});

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (data) => {
    setError('');
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      // Set success message
      setSuccess(
        `Password reset instructions have been sent to ${data.email}. Please check your inbox for further instructions.`
      );
      setLoading(false);
    }, 1500);
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

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">{success}</div>}

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
            <p className="mb-4">
              Our team is working on your request. You should receive an email shortly.
            </p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Return to Login
            </Link>
          </div>
        )}

        {!success && (
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
