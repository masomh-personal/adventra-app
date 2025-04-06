import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ContactPage from '@/pages/contact';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.spyOn(console, 'log').mockImplementation(() => {}); // silence test logging

describe('ContactPage', () => {
  const mockPush = jest.fn();

  const submitFormAndWait = async (formData = {}) => {
    const {
      name = 'John Doe',
      email = 'john@example.com',
      message = 'Test message content.',
    } = formData;

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: name } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: message } });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
      await new Promise((res) => setTimeout(res, 1200)); // simulate async work
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  describe('Initial Rendering', () => {
    it('renders the contact form and text', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
      expect(screen.getByText(/got questions, feedback/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('applies proper Tailwind classes to the form', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const form = screen.getByRole('form');
      expect(form).toHaveClass('space-y-4', 'mt-4');
    });
  });

  describe('Form Interactions', () => {
    it('updates values on user input', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@a.com' } });
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } });

      expect(screen.getByLabelText(/name/i).value).toBe('John');
      expect(screen.getByLabelText(/email/i).value).toBe('john@a.com');
      expect(screen.getByLabelText(/message/i).value).toBe('Hello');
    });

    it('updates character counter', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const messageInput = screen.getByLabelText(/message/i);
      const counter = screen.getByTestId('char-counter');

      fireEvent.change(messageInput, { target: { value: 'Test' } });
      expect(counter).toHaveTextContent('4/2000');

      fireEvent.change(messageInput, { target: { value: 'Hello world' } });
      expect(counter).toHaveTextContent('11/2000');
    });

    it('applies counter colors based on length', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const input = screen.getByLabelText(/message/i);
      const counter = screen.getByTestId('char-counter');

      fireEvent.change(input, { target: { value: 'A'.repeat(450) } });
      expect(counter).toHaveClass('text-green-600');

      fireEvent.change(input, { target: { value: 'A'.repeat(1800) } });
      expect(counter).toHaveClass('text-amber-500');

      fireEvent.change(input, { target: { value: 'A'.repeat(2000) } });
      expect(counter).toHaveClass('text-red-500');
    });

    it('truncates input if over 2000 characters', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const input = screen.getByLabelText(/message/i);

      await act(async () => {
        fireEvent.change(input, { target: { value: 'A'.repeat(2100) } });
      });

      expect(input.value.length).toBe(2000);
    });
  });

  describe('Form Validation', () => {
    it('shows required field errors', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button'));
      });

      expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/please enter your message/i)).toBeInTheDocument();
    });

    it('triggers native email validation', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'bad-email' } });

      await act(async () => {
        fireEvent.submit(screen.getByRole('form'));
      });

      expect(emailInput.validity.valid).toBe(false);
    });

    it('shows custom validation for bad email', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const form = screen.getByRole('form');
      form.setAttribute('novalidate', 'true');

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad' } });
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'Test message' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button'));
      });

      expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    });

    it('shows message length error', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hi' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('button'));
      });

      expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('submits form and shows success', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      await submitFormAndWait();
      const success = screen.getByTestId('success-message');
      expect(success).toBeInTheDocument();
    });

    it('hides form after successful submission', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      await submitFormAndWait();
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
  });

  describe('Post-Submission UI', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitFormAndWait();
    });

    it('renders success message as alert', () => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/thanks for reaching out/i);
    });

    it('displays navigation buttons', () => {
      expect(screen.getByRole('button', { name: /return home/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
    });

    it('buttons have correct styles', () => {
      const home = screen.getByRole('button', { name: /return home/i });
      const login = screen.getByRole('button', { name: /go to login/i });

      expect(home.className).toMatch(/bg-primary.*text-white/);
      expect(login.className).toContain('outline');
    });

    it('navigates to homepage', async () => {
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /return home/i }));
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('navigates to login', async () => {
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /go to login/i }));
      });
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('Accessibility', () => {
    it('has accessible email link', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      expect(screen.getByRole('link', { name: /support@adventra.com/i })).toHaveAttribute(
        'href',
        'mailto:support@adventra.com'
      );
    });

    it('has labels for all form inputs', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('renders success alert accessibly', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      await submitFormAndWait();

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles max-length valid inputs', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      await submitFormAndWait({
        name: 'A'.repeat(50),
        email: 'a'.repeat(20) + '@' + 'b'.repeat(20) + '.com',
        message: 'A'.repeat(1999),
      });

      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    it('accepts special characters in inputs', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      await submitFormAndWait({
        name: "Jöhn O'Dóe-Smith (QA)",
        email: 'john.doe+test@example.com',
        message: '¡Hola! 你好 ありがとう éñçã ✓✓✓',
      });

      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });
});
