// src/components/__tests__/SignupPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '@/pages/signup';

// Mock the FormWrapper component
jest.mock('@/components/FormWrapper', () => {
  return ({ children, onSubmit, submitLabel, loading }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        password: document.getElementById('password')?.value || '',
      };
      const mockReset = jest.fn();
      onSubmit(formData, { reset: mockReset });
    };

    return (
      <form data-testid="signup-form" onSubmit={handleSubmit}>
        {typeof children === 'function'
          ? children({
              register: jest.fn(),
              errors: {},
              watch: jest.fn(),
              setValue: jest.fn(),
            })
          : children}
        <button type="submit" data-testid="submit-button" disabled={loading}>
          {submitLabel}
        </button>
      </form>
    );
  };
});

// Mock the FormField component
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
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalAlert = window.alert;
  const originalSetTimeout = setTimeout;

  beforeEach(() => {
    // Mock console methods and setTimeout
    console.log = jest.fn();
    console.error = jest.fn();
    window.alert = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore original methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    window.alert = originalAlert;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the signup form with correct title', () => {
      render(<SignupPage />);
      expect(screen.getByText('🏕️ Create Your Account')).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<SignupPage />);
      expect(screen.getByTestId('form-field-name')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-email')).toBeInTheDocument();
      expect(screen.getByTestId('form-field-password')).toBeInTheDocument();
    });

    it('should display password help text', () => {
      render(<SignupPage />);
      const helpText = screen.getByTestId('help-text-password');
      expect(helpText).toBeInTheDocument();
      expect(helpText).toHaveTextContent(
        'NOTE: Must be at least 10 characters with uppercase, lowercase, number, and special character'
      );
    });

    it('should render login link for existing users', () => {
      render(<SignupPage />);
      const loginLink = screen.getByText('Login here');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
      expect(loginLink).toHaveClass('text-primary');
    });
  });

  describe('Form Functionality', () => {
    it('should call handleSignup with form data when submitted', async () => {
      render(<SignupPage />);

      // Fill in the form
      fireEvent.change(screen.getByTestId('name'), {
        target: { value: 'John Doe' },
      });

      fireEvent.change(screen.getByTestId('email'), {
        target: { value: 'john@example.com' },
      });

      fireEvent.change(screen.getByTestId('password'), {
        target: { value: 'StrongP@ssw0rd' },
      });

      // Submit the form
      fireEvent.click(screen.getByTestId('submit-button'));

      // Check that the button is disabled during submission
      expect(screen.getByTestId('submit-button')).toBeDisabled();

      // Verify console.log was called with form data
      expect(console.log).toHaveBeenCalledWith('Signup data:', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongP@ssw0rd',
      });

      // Fast-forward timers to complete the simulated API call
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Verify alert was called with success message
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Signup successful! (placeholder)');
      });

      // Check that the button is re-enabled after submission
      await waitFor(() => {
        expect(screen.getByTestId('submit-button')).not.toBeDisabled();
      });
    });
  });
});
