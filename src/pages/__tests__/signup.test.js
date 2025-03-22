import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '../signup';

describe('SignupPage Basic Tests', () => {
  // Mock alert function
  window.alert = jest.fn();

  beforeEach(() => {
    window.alert.mockClear();
  });

  it('renders the signup form elements', () => {
    render(<SignupPage />);
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  // Test form interaction without validation expectations
  it('allows filling out the form', () => {
    render(<SignupPage />);

    // Fill in all fields
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'StrongP@ssw0rd' },
    });

    // Verify values are set
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('StrongP@ssw0rd');
  });

  // Test for help text
  it('shows password help text', () => {
    render(<SignupPage />);
    // Check that a relevant password help text exists
    const helpTextElement = screen.getByText(/must be at least 10 characters/i);
    expect(helpTextElement).toBeInTheDocument();
  });
});
