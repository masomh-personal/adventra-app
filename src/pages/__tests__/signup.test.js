import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '../signup';

describe('SignupPage Tests', () => {
  // Mock alert function
  window.alert = jest.fn();

  beforeEach(() => {
    window.alert.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Test rendering of components
  it('renders all form elements correctly', () => {
    render(<SignupPage />);

    // Check heading and UI elements
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login here/i })).toHaveAttribute('href', '/login');

    // Check form fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check button
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();

    // Check help text
    expect(screen.getByText(/must be at least 10 characters with/i)).toBeInTheDocument();
  });

  // Test form interaction
  it('allows form values to be entered and maintained', () => {
    render(<SignupPage />);

    // Input test values
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd' } });

    // Verify values are set
    expect(nameInput).toHaveValue('Jane Doe');
    expect(emailInput).toHaveValue('jane@example.com');
    expect(passwordInput).toHaveValue('StrongP@ssw0rd');
  });

  // Test form submission with valid data
  // TODO: will be adding API logic here to test
  it.skip('handles form submission with valid data', async () => {
    render(<SignupPage />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'StrongP@ssw0rd' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check loading state
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting/i);

    // Fast-forward timers to complete the mock API call
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });

    // Verify button returns to normal state
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/sign up/i);
    });
  });

  // UI accessibility test
  it('ensures form elements have proper accessibility attributes', () => {
    render(<SignupPage />);

    // Check that labels are properly connected to inputs
    const nameLabel = screen.getByText(/full name/i);
    const emailLabel = screen.getByText(/email address/i);
    const passwordLabel = screen.getByText(/password/i);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(nameLabel).toHaveAttribute('for', nameInput.id);
    expect(emailLabel).toHaveAttribute('for', emailInput.id);
    expect(passwordLabel).toHaveAttribute('for', passwordInput.id);
  });

  // Test help text visibility
  it('shows correct helper text for password field', () => {
    render(<SignupPage />);

    const helpText = screen.getByText(/must be at least 10 characters with/i);
    expect(helpText).toBeVisible();
    expect(helpText).toHaveClass('text-gray-500');
  });

  // Test login link functionality
  it('has a working login link', () => {
    render(<SignupPage />);

    const loginLink = screen.getByRole('link', { name: /login here/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
