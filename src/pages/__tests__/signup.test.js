// src/components/__tests__/SignupPage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '@/pages/signup';

// 🔧 Shared modal mock to track modal usage
const mockShowErrorModal = jest.fn();

// ✅ Mock Supabase signup API
jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(() =>
      Promise.resolve({
        data: { user: { id: 'uuid-123', email: 'john@example.com' } },
        error: null,
      })
    ),
  },
}));

// ✅ Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/signup',
  }),
}));

// ✅ Mock ModalContext with shared function
jest.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: mockShowErrorModal,
  }),
}));

// ✅ Mock FormWrapper
jest.mock('@/components/FormWrapper', () => {
  return ({ children, onSubmit, submitLabel, loading }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        password: document.getElementById('password')?.value || '',
      };
      onSubmit(formData);
    };

    return (
      <form data-testid="signup-form" onSubmit={handleSubmit}>
        {typeof children === 'function'
          ? children({ register: jest.fn(), errors: {}, watch: jest.fn(), setValue: jest.fn() })
          : children}
        <button type="submit" data-testid="submit-button" disabled={loading}>
          {submitLabel}
        </button>
      </form>
    );
  };
});

// ✅ Mock FormField
jest.mock('@/components/FormField', () => {
  return ({ id, label, type, placeholder, helpText }) => {
    return (
      <div data-testid={`form-field-${id}`}>
        <label htmlFor={id}>{label}</label>
        <input id={id} type={type} placeholder={placeholder || ''} data-testid={id} />
        {helpText && <p data-testid={`help-text-${id}`}>{helpText}</p>}
      </div>
    );
  };
});

describe('SignupPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockShowErrorModal.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the signup form title', () => {
      render(<SignupPage />);
      expect(screen.getByText('🏕️ Create Your Account')).toBeInTheDocument();
    });

    it('renders all required form fields', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('form-field-name')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-password')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-confirmPassword')).toBeInTheDocument();
    });

    it('renders the login link for existing users', () => {
      render(<SignupPage />);
      const loginLink = screen.getByText('Login here');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
      expect(loginLink).toHaveClass('text-primary');
    });

    it('displays password requirements in the InfoBox', () => {
      render(<SignupPage />);
      const infoBox = screen.getByText((content, node) => {
        const hasText = (text) =>
          text.includes('Password must be at least') &&
          text.includes('10 characters') &&
          text.includes('uppercase letter') &&
          text.includes('lowercase letter') &&
          text.includes('number') &&
          text.includes('special character');

        const nodeHasText = hasText(node.textContent);
        const childrenDontHaveText = Array.from(node.children || []).every(
          (child) => !hasText(child.textContent)
        );

        return nodeHasText && childrenDontHaveText;
      });

      expect(infoBox).toBeInTheDocument();
    });
  });

  describe('Form Functionality', () => {
    it('submits form and shows success modal on valid signup', async () => {
      render(<SignupPage />);

      fireEvent.change(screen.getByTestId('name'), {
        target: { value: 'John Doe' },
      });

      fireEvent.change(screen.getByTestId('email'), {
        target: { value: 'john@example.com' },
      });

      fireEvent.change(screen.getByTestId('password'), {
        target: { value: 'StrongP@ssw0rd!' },
      });

      fireEvent.click(screen.getByTestId('submit-button'));

      // Simulate Supabase delay
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockShowErrorModal).toHaveBeenCalledWith(
          'Please check your email to confirm your account before logging in.',
          'Signup Successful!'
        );
        expect(screen.getByTestId('submit-button')).not.toBeDisabled();
      });
    });
  });
});
