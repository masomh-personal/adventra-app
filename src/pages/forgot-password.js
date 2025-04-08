import React, { useState } from 'react';
import * as yup from 'yup';
import { emailValidation } from '@/validation/validationUtils';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';
import InfoBox from '@/components/InfoBox';
import Button from '@/components/Button';
import { LuArrowLeft } from 'react-icons/lu';
import { BiLockAlt } from 'react-icons/bi';

const forgotPasswordSchema = yup.object({
  email: emailValidation,
});

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');

    await new Promise((res) => setTimeout(res, 1000)); // Simulated delay

    setMessage(
      `Hi! The forgot password feature is currently under development. Please contact support or try again later.`
    );

    setLoading(false);
  };

  const handleFormError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  const backToLoginButton = (
    <Button
      as="a"
      href="/login"
      label="Back to Login"
      variant="outline"
      size="base"
      leftIcon={<LuArrowLeft className="h-4 w-4" />}
      testId="return-to-login-button"
    />
  );

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8">
        <h2 className="text-3xl font-heading text-center mb-2 flex items-center justify-center gap-2">
          <BiLockAlt className="text-primary text-4xl" />
          Reset Password
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we’ll send you instructions to reset your password.
        </p>
        <hr className="border-t border-gray-300 mb-6" />

        {message ? (
          <>
            <InfoBox
              variant="info"
              message={message}
              testId="forgot-password-placeholder-message"
            />
            <div className="text-center mt-6">
              <p className="mb-4">You can close this page or return to login below.</p>
              {backToLoginButton}
            </div>
          </>
        ) : (
          <>
            <FormWrapper
              validationSchema={forgotPasswordSchema}
              onSubmit={handleForgotPassword}
              onError={handleFormError}
              submitLabel={loading ? 'Pretending...' : 'Send Reset Link'}
              loading={loading}
            >
              <FormField
                label="Email Address"
                type="email"
                id="email"
                placeholder="you@example.com"
              />
            </FormWrapper>

            <div className="mt-4 text-center">{backToLoginButton}</div>
          </>
        )}
      </div>
    </div>
  );
}
