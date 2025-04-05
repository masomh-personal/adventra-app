import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '@/pages/contact';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Silence console during tests
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('ContactPage', () => {
  const mockPush = jest.fn();

  // Update your submitFormAndWait helper function:
  const submitFormAndWait = async (formData = {}) => {
    // Fill out form with default or provided values
    const {
      name = 'John Doe',
      email = 'john@example.com',
      message = 'Test message content.',
    } = formData;

    // Fill form fields
    if (name) {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: name } });
    }

    if (email) {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    }

    if (message) {
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: message } });
    }

    // Submit the form and wait for API simulation
    await act(async () => {
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      // Wait for API simulation
      await new Promise((resolve) => setTimeout(resolve, 1200));
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  // ===== Initial Rendering Tests =====
  describe('Initial Rendering', () => {
    it('renders the contact form with all required elements', () => {
      render(<ContactPage />);

      expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
      expect(
        screen.getByText(/got questions, feedback, or just want to say hello/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /support@adventra.com/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('applies correct styling to the form container', () => {
      render(<ContactPage />);

      const formElement = screen.getByRole('form');
      expect(formElement).toHaveClass('space-y-4');
      expect(formElement).toHaveClass('mt-4');
    });
  });

  // ===== Form Interaction Tests =====
  describe('Form Interactions', () => {
    it('updates input values when user types', () => {
      render(<ContactPage />);

      // Test name input
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      expect(nameInput.value).toBe('John Doe');

      // Test email input
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
      expect(emailInput.value).toBe('john.doe@example.com');

      // Test message input
      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.change(messageInput, { target: { value: 'This is a test message.' } });
      expect(messageInput.value).toBe('This is a test message.');
    });

    it('displays character counter that updates as user types', () => {
      render(<ContactPage />);

      const messageInput = screen.getByLabelText(/message/i);
      const charCounter = screen.getByTestId('char-counter');

      // Test short message
      fireEvent.change(messageInput, { target: { value: 'Hello' } });
      expect(charCounter).toHaveTextContent('5/2000');

      // Test longer message
      fireEvent.change(messageInput, { target: { value: 'Hello, World!' } });
      expect(charCounter).toHaveTextContent('13/2000');
    });

    it('changes character counter color based on message length', () => {
      render(<ContactPage />);

      const messageInput = screen.getByLabelText(/message/i);
      const charCounter = screen.getByTestId('char-counter');

      // Test "green" range (normal length)
      fireEvent.change(messageInput, { target: { value: 'A'.repeat(450) } });
      expect(charCounter).toHaveClass('text-xs text-right mt-1 text-green-600');

      // Test "amber" range (approaching limit)
      fireEvent.change(messageInput, { target: { value: 'A'.repeat(1800) } });
      expect(charCounter).toHaveClass('text-xs text-right mt-1 text-amber-500');

      // Test "red" range (at limit)
      fireEvent.change(messageInput, { target: { value: 'A'.repeat(2000) } });
      expect(charCounter).toHaveClass('text-xs text-right mt-1 text-red-500');
    });

    it('truncates message when it exceeds maximum length', () => {
      render(<ContactPage />);

      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.change(messageInput, { target: { value: 'A'.repeat(2001) } });

      expect(messageInput.value.length).toBe(2000);
    });
  });

  // ===== Form Validation Tests =====
  describe('Form Validation', () => {
    it('shows validation errors when submitting empty form', async () => {
      render(<ContactPage />);

      // Submit empty form
      fireEvent.click(screen.getByTestId('button'));

      // Check for validation errors
      const nameError = await screen.findByText(/name is required/i);
      const emailError = await screen.findByText(/email is required/i);
      const messageError = await screen.findByText(/please enter your message/i);

      expect(nameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
      expect(messageError).toBeInTheDocument();
    });

    it('triggers browser validation for email format', () => {
      render(<ContactPage />);

      // Enter invalid email
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      // Submit form to trigger browser validation
      const form = screen.getByRole('form');
      fireEvent.submit(form);

      // Check browser validation state
      expect(emailInput.validity.valid).toBe(false);
      expect(emailInput.validity.typeMismatch).toBe(true);
    });

    it('displays custom validation error for invalid email format', async () => {
      render(<ContactPage />);

      // Disable browser validation
      const form = screen.getByRole('form');
      form.setAttribute('novalidate', 'true');

      // Fill form with invalid email but valid other fields
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'This is a valid message for testing.' },
      });

      // Submit the form
      fireEvent.click(screen.getByTestId('button'));

      // Check for custom validation error message
      const emailError = await screen.findByText(/valid email/i);
      expect(emailError).toBeInTheDocument();
    });

    it('validates minimum message length', async () => {
      render(<ContactPage />);

      // Enter too short message
      const messageInput = screen.getByLabelText(/message/i);
      fireEvent.change(messageInput, { target: { value: 'Hi' } });

      // Submit form
      fireEvent.click(screen.getByTestId('button'));

      // Check for message length error
      const messageLengthError = await screen.findByText(/message must be at least 10 characters/i);
      expect(messageLengthError).toBeInTheDocument();
    });
  });

  // ===== Form Submission Tests =====
  describe('Form Submission', () => {
    it('submits form with valid data and shows success message', async () => {
      render(<ContactPage />);

      // Submit valid form data
      await submitFormAndWait();

      // Check for success message
      const successMessage = screen.getByTestId('success-message');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent(/thanks for reaching out/i);
    });

    it('hides the form after successful submission', async () => {
      render(<ContactPage />);

      // Submit valid form data
      await submitFormAndWait();

      // Verify form is hidden
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
  });

  // ===== Post-Submission UI Tests =====
  describe('Post-Submission UI', () => {
    beforeEach(async () => {
      render(<ContactPage />);

      // Submit form before each test
      await submitFormAndWait();
    });

    it('displays success message with correct role attribute', () => {
      const successMessage = screen.getByRole('alert');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent(/thanks for reaching out/i);
    });

    it('displays navigation buttons after submission', () => {
      expect(screen.getByRole('button', { name: /return home/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
    });

    it('applies correct styling to navigation buttons', () => {
      const returnHomeButton = screen.getByRole('button', { name: /return home/i });
      const goToLoginButton = screen.getByRole('button', { name: /go to login/i });

      // Check primary button has correct class combinations
      expect(returnHomeButton.className).toMatch(/bg-primary.*text-white/);

      // Check outline button has outline style (specific class depends on your implementation)
      expect(goToLoginButton.className).toContain('outline');
    });

    it('navigates to home page when clicking "Return Home"', () => {
      fireEvent.click(screen.getByRole('button', { name: /return home/i }));
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('navigates to login page when clicking "Go to Login"', () => {
      fireEvent.click(screen.getByRole('button', { name: /go to login/i }));
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  // ===== Accessibility Tests =====
  describe('Accessibility', () => {
    it('has accessible email link', () => {
      render(<ContactPage />);

      const emailLink = screen.getByRole('link', { name: /support@adventra.com/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:support@adventra.com');
    });

    it('form fields have associated labels', () => {
      render(<ContactPage />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('success message has correct alert role', async () => {
      render(<ContactPage />);

      // Submit form
      await submitFormAndWait();

      // Check success message accessibility
      const successMessage = screen.getByRole('alert');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent(/thanks for reaching out/i);
    });
  });

  // ===== Edge Cases =====
  describe('Edge Cases', () => {
    it('handles very long but valid inputs', async () => {
      render(<ContactPage />);

      // Submit form with maximum-length values
      await submitFormAndWait({
        name: 'A'.repeat(50),
        email: 'a'.repeat(20) + '@' + 'b'.repeat(20) + '.com',
        message: 'A'.repeat(1999),
      });

      // Verify successful submission
      const successMessage = screen.getByTestId('success-message');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent(/thanks for reaching out/i);
    });

    it('handles special characters in input fields', async () => {
      render(<ContactPage />);

      // Submit form with special characters
      await submitFormAndWait({
        name: "Jöhn O'Dóe-Smith (Tester)",
        email: 'john.doe+test@example.com',
        message: '¡Hello! This is a test with special characters: éñçã 你好 ありがとう',
      });

      // Verify successful submission
      const successMessage = screen.getByTestId('success-message');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent(/thanks for reaching out/i);
    });
  });
});
