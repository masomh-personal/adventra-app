import React, { useState } from 'react';
import { signupSchema } from '@/validation/signupSchema.';
import FormWrapper from '../components/FormWrapper';
import FormField from '../components/FormField';

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (data, { reset }) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log('Signup data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful signup
      alert('Signup successful! (placeholder)');
      // Optionally reset the form or redirect
      // reset();
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 my-8">
        <h2 className="text-3xl font-heading text-center mb-2">🏕️ Create Your Account</h2>
        <hr className="border-t border-gray-300 mb-6" />

        <FormWrapper
          validationSchema={signupSchema}
          onSubmit={handleSignup}
          submitLabel="Sign Up"
          loading={isSubmitting}
        >
          <FormField label="Full Name" type="text" id="name" placeholder="Your name" />

          <FormField label="Email Address" type="email" id="email" placeholder="you@example.com" />

          <FormField
            label="Password"
            type="password"
            id="password"
            placeholder="Create a password"
            helpText="NOTE: Must be at least 10 characters with uppercase, lowercase, number, and special character"
            registerOptions={{
              minLength: {
                value: 10,
                message: 'Password must be at least 10 characters',
              },
            }}
          />

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
