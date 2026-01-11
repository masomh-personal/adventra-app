import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MagicLinkForm from '@/components/MagicLinkForm';
import { vi } from 'vitest';

const safeRender = async (ui: React.ReactElement): Promise<void> => {
  await act(async () => {
    render(ui);
  });
};

describe('MagicLinkForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Rendering', () => {
    test('renders email input and both buttons', async () => {
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send one-time link/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
    });

    test('renders the back arrow icon in "Back to Login" button', async () => {
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />);

      const backBtn = screen.getByRole('button', { name: /back to login/i });
      const svg = backBtn.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    test('shows error message for empty email on blur', async () => {
      const user = userEvent.setup();
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />);

      const input = screen.getByLabelText(/email/i);
      await user.click(input);
      await user.tab(); // Blur the input

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    test('shows error for invalid email like "user@local"', async () => {
      const user = userEvent.setup();
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />);

      const input = screen.getByLabelText(/email/i);
      await user.type(input, 'user@local');
      await user.tab(); // Blur the input

      expect(await screen.findByText(/must include a valid domain/i)).toBeInTheDocument();
    });
  });

  describe('Submission', () => {
    test('calls onSubmit with lowercase email when valid', async () => {
      const user = userEvent.setup();
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />);

      const input = screen.getByLabelText(/email/i);
      await user.type(input, 'Test@Example.COM');

      const submitButton = screen.getByTestId('submit-magic');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
      });
    });

    test('disables the submit button while loading', async () => {
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />);

      const submitBtn = screen.getByTestId('submit-magic');
      expect(submitBtn).toBeDisabled();
      // Button should show loading state
      expect(submitBtn).toHaveAttribute('disabled');
    });
  });

  describe('Cancel Action', () => {
    test('calls onCancel when "Back to Login" button is clicked', async () => {
      const user = userEvent.setup();
      await safeRender(<MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />);

      await user.click(screen.getByRole('button', { name: /back to login/i }));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
