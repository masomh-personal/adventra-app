import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactPage from '@/pages/contact';
import { useRouter } from 'next/router';
import { vi } from 'vitest';

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);

// Silence test logs
vi.spyOn(console, 'log').mockImplementation(() => {});

interface ContactFormData {
  name?: string;
  email?: string;
  message?: string;
}

describe('ContactPage', () => {
  const mockPush = vi.fn();

  const fillContactForm = ({
    name = 'John Doe',
    email = 'john@example.com',
    message = 'Hello Adventra!',
  }: ContactFormData = {}): void => {
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: name } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: message } });
  };

  const submitForm = async (formData?: ContactFormData): Promise<void> => {
    fillContactForm(formData);
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);

    // Global mock for fetch (instant response)
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Mock success' }),
      })
    ) as typeof fetch;
  });

  afterEach(() => {
    cleanup();
  });

  describe('Initial Rendering', () => {
    it('renders heading, text, and form fields', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
      expect(screen.getByText(/got questions, feedback/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('applies Tailwind spacing classes', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      expect(screen.getByRole('form')).toHaveClass('space-y-4', 'mt-4');
    });
  });

  describe('Form Interactions', () => {
    it('updates field values on user input', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      fillContactForm({ name: 'Jane', email: 'jane@site.com', message: 'Test' });

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe('Jane');
      expect(emailInput.value).toBe('jane@site.com');
      expect(messageInput.value).toBe('Test');
    });

    it('updates and colors the character counter', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const input = screen.getByLabelText(/message/i);
      const counter = screen.getByTestId('char-counter');

      fireEvent.change(input, { target: { value: 'A'.repeat(450) } });
      expect(counter).toHaveTextContent('450/2000');
      expect(counter).toHaveClass('text-green-600');

      fireEvent.change(input, { target: { value: 'A'.repeat(1800) } });
      expect(counter).toHaveClass('text-amber-500');

      fireEvent.change(input, { target: { value: 'A'.repeat(2000) } });
      expect(counter).toHaveClass('text-red-500');
    });

    it('truncates message input at 2000 characters', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      const input = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      await act(async () => {
        fireEvent.change(input, { target: { value: 'A'.repeat(2100) } });
      });

      expect(input.value.length).toBe(2000);
    });
  });

  describe('Validation', () => {
    it('shows required field errors', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const form = screen.getByRole('form');
      form.setAttribute('novalidate', 'true');

      await act(async () => {
        fireEvent.submit(form);
      });

      expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/please enter your message/i)).toBeInTheDocument();
    });

    it('triggers native email validation', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'bad-email' } });

      await act(async () => {
        fireEvent.submit(screen.getByRole('form'));
      });
      expect(emailInput.validity.valid).toBe(false);
    });

    it('shows custom invalid email error', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const form = screen.getByRole('form');
      form.setAttribute('novalidate', 'true');

      fillContactForm({ name: 'Jane', email: 'bad', message: 'Hello there!' });

      await act(async () => {
        fireEvent.submit(form);
      });

      expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    });

    it('shows message length error if too short', async () => {
      await act(async () => {
        render(<ContactPage />);
      });

      const form = screen.getByRole('form');
      form.setAttribute('novalidate', 'true');

      fillContactForm({ name: 'John', email: 'john@example.com', message: 'Hi' });

      await act(async () => {
        fireEvent.submit(form);
      });

      expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('displays success UI after submit', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitForm();
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    it('removes form after submit', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitForm();
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });
  });

  describe('Post-Submission UI', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitForm();
    });

    it('shows alert with thank you message', () => {
      expect(screen.getByRole('alert')).toHaveTextContent(/thanks for reaching out/i);
    });

    it('displays navigation buttons', () => {
      expect(screen.getByTestId('return-home-btn')).toBeInTheDocument();
      expect(screen.getByTestId('go-to-login-btn')).toBeInTheDocument();
    });

    it('buttons have correct visual classes', () => {
      const home = screen.getByTestId('return-home-btn');
      const login = screen.getByTestId('go-to-login-btn');

      expect(home).toHaveClass('bg-primary', 'text-white');
      expect(login).toHaveClass('border-2', 'text-primary', 'bg-transparent');
    });

    it('navigates to / on click', async () => {
      await act(async () => {
        fireEvent.click(screen.getByTestId('return-home-btn'));
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('navigates to /login on click', async () => {
      await act(async () => {
        fireEvent.click(screen.getByTestId('go-to-login-btn'));
      });
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('Accessibility', () => {
    it('renders accessible email mailto link', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      const link = screen.getByRole('link', { name: /support@adventra.com/i });
      expect(link).toHaveAttribute('href', 'mailto:support@adventra.com');
    });

    it('ensures all fields are labeled', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('renders the alert with appropriate role', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitForm();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles max-length valid inputs', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitForm({
        name: 'A'.repeat(50),
        email: 'a'.repeat(20) + '@' + 'b'.repeat(20) + '.com',
        message: 'A'.repeat(1999),
      });
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    it('accepts special characters in input', async () => {
      await act(async () => {
        render(<ContactPage />);
      });
      await submitForm({
        name: "Jöhn O'Dóe-Smith (QA)",
        email: 'john.doe+test@example.com',
        message: '¡Hola! 你好 ありがとう éñçã ✓✓✓',
      });
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  describe('Performance (Realistic API Delay)', () => {
    it('waits 1500ms before showing success message', async () => {
      vi.useFakeTimers();

      const fetchMock = vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Simulated delayed success' }),
              } as Response);
            }, 1500);
          })
      );

      global.fetch = fetchMock;

      await act(async () => {
        render(<ContactPage />);
      });

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/name/i), {
          target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/message/i), {
          target: { value: 'This is a test message' },
        });

        fireEvent.submit(screen.getByRole('form'));
      });

      // At this point, fetch has been called, but setTimeout hasn't completed
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();

      // Fast-forward time by 1500ms
      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      // Wait for fetch resolution + DOM update
      await screen.findByTestId('success-message');

      expect(screen.getByTestId('success-message')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });
});
