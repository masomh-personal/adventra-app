import React, { useState } from 'react';
import { loginSchema } from '@/validation/loginSchema';
import FormWrapper from '@/components/FormWrapper';
import FormField from '@/components/FormField';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setError('');
    setLoading(true);

    try {
      // Simulate login for now - replace with real auth later
      console.log('Login data:', data);
      alert('Login attempted with: ' + data.email);

      // Here you would add your authentication logic
    } catch (err) {
      setError(err.message || 'An error occurred while logging in');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormError = (errors) => {
    console.error('Form validation errors:', errors);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-heading text-center mb-2">🏕️ Login to Adventra</h2>
        <hr className="border-t border-gray-300 mb-6" />

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

        <FormWrapper
          validationSchema={loginSchema}
          onSubmit={handleLogin}
          onError={handleFormError}
          submitLabel="Login"
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
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:underline">
              Sign up here
            </a>
          </p>
        </FormWrapper>
      </div>
    </div>
  );
}
