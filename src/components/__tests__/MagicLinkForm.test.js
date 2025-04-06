import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MagicLinkForm from '../MagicLinkForm';

const safeRender = async (ui) => {
  await act(async () => {
    render(ui);
  });
};

describe('MagicLinkForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Rendering', () => {
    it('renders email input and both buttons', async () => {
      await safeRender(
        <MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send one-time link/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error message for empty email on blur', async () => {
      await safeRender(
        <MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      const input = screen.getByLabelText(/email/i);
      await act(async () => {
        fireEvent.focus(input);
        fireEvent.blur(input);
      });

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows error for invalid email like "user@local"', async () => {
      await safeRender(
        <MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      const input = screen.getByLabelText(/email/i);
      await act(async () => {
        fireEvent.change(input, { target: { value: 'user@local' } });
        fireEvent.blur(input);
      });

      expect(await screen.findByText(/must include a valid domain/i)).toBeInTheDocument();
    });
  });

  describe('Submission', () => {
    it('calls onSubmit with lowercase email when valid', async () => {
      await safeRender(
        <MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      const input = screen.getByLabelText(/email/i);
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Test@Example.COM' } });
        fireEvent.submit(screen.getByRole('form'));
      });

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('disables the submit button while loading', async () => {
      await safeRender(
        <MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={true} />
      );

      // Fill with valid email to activate form context
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
      });

      const submitBtn = screen.getByTestId('submit-magic');
      expect(submitBtn).toBeDisabled();

      // scoped lookup inside the button
      const spinner = within(submitBtn).getByTestId('spinner');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Cancel Action', () => {
    it('calls onCancel when Cancel button is clicked', async () => {
      await safeRender(
        <MagicLinkForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} loading={false} />
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      });

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });
});
