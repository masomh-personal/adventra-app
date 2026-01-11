import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import * as yup from 'yup';
import FormWrapper from '@/components/FormWrapper';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { vi } from 'vitest';

/**
 * Simple mock field to simulate form contexts usage
 * Note: FormWrapper will inject register and errors automatically
 */
const MockFormField = ({
  id,
  label,
  register,
  errors,
}: {
  id: string;
  label: string;
  register?: UseFormRegister<{ name: string; email: string }>;
  errors?: FieldErrors<{ name: string; email: string }>;
}): React.JSX.Element => {
  const fieldRegister = register || (() => ({ onChange: vi.fn(), onBlur: vi.fn(), name: id, ref: vi.fn() }));
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...fieldRegister(id as 'name' | 'email')} />
      {errors?.[id as 'name' | 'email'] && <span>{errors[id as 'name' | 'email']?.message}</span>}
    </div>
  );
};

// Helper to safely render UI and avoid act() warnings
const safeRender = async (ui: React.ReactElement): Promise<void> => {
  await act(async () => {
    render(ui);
  });
};

// Helper to change field values safely using userEvent
const fillField = async (user: ReturnType<typeof userEvent.setup>, label: string, value: string): Promise<void> => {
  const input = screen.getByLabelText(label);
  await user.clear(input);
  await user.type(input, value);
};

describe('FormWrapper', () => {
  const mockOnSubmit = vi.fn();
  const mockOnError = vi.fn();

  const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnError.mockClear();
  });

  describe('rendering', () => {
    test('renders form title, fields, and submit button', async () => {
      await safeRender(
        <FormWrapper title="Test Form" validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('renders custom submit button label', async () => {
      await safeRender(
        <FormWrapper submitLabel="Send" validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    test('does not render submit button if submitLabel is an empty string', async () => {
      await safeRender(
        <FormWrapper submitLabel="" validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(0);
    });

    test('renders without title if not provided', async () => {
      await safeRender(
        <FormWrapper validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.queryByText('Test Form')).not.toBeInTheDocument();
    });

    test('disables the submit button when form is invalid', async () => {
      await safeRender(
        <FormWrapper validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeDisabled();
    });
  });

  describe('validation', () => {
    test('shows error messages when fields are empty after blur', async () => {
      const user = userEvent.setup();
      await safeRender(
        <FormWrapper validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');

      await user.click(nameInput);
      await user.tab(); // Blur name field
      await user.click(emailInput);
      await user.tab(); // Blur email field

      // Validation errors should appear after touching fields (mode: 'onTouched')
      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      
      // Form is invalid, so onSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    test('calls onSubmit with valid form data', async () => {
      const user = userEvent.setup();
      await safeRender(
        <FormWrapper validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      await fillField(user, 'Name', 'Test User');
      await fillField(user, 'Email', 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          { name: 'Test User', email: 'test@example.com' },
          expect.objectContaining({
            reset: expect.any(Function),
            setValue: expect.any(Function),
            getValues: expect.any(Function),
          })
        );
      });
    });

    test('displays loading state during async submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise((res) => setTimeout(res, 100)));

      await safeRender(
        <FormWrapper validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      await fillField(user, 'Name', 'Test User');
      await fillField(user, 'Email', 'test@example.com');

      const button = screen.getByRole('button', { name: /submit/i });
      await user.click(button);

      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/processing/i);
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('defaultValues', () => {
    test('pre-fills inputs using defaultValues', async () => {
      await safeRender(
        <FormWrapper
          validationSchema={schema}
          onSubmit={mockOnSubmit}
          defaultValues={{ name: 'Default Name', email: 'default@example.com' }}
        >
          <MockFormField id="name" label="Name" />
          <MockFormField id="email" label="Email" />
        </FormWrapper>
      );

      expect(screen.getByLabelText('Name')).toHaveValue('Default Name');
      expect(screen.getByLabelText('Email')).toHaveValue('default@example.com');
    });
  });

  describe('formProps and className', () => {
    test('passes additional formProps and applies custom class', async () => {
      await safeRender(
        <FormWrapper
          validationSchema={schema}
          onSubmit={mockOnSubmit}
          formProps={
            { 'data-testid': 'test-form', className: 'extra-class' } as React.FormHTMLAttributes<HTMLFormElement>
          }
        >
          <MockFormField id="name" label="Name" />
        </FormWrapper>
      );

      const form = screen.getByTestId('test-form');
      expect(form).toHaveClass('extra-class');
    });

    test('applies className directly to form wrapper', async () => {
      await safeRender(
        <FormWrapper className="custom-form" validationSchema={schema} onSubmit={mockOnSubmit}>
          <MockFormField id="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.getByRole('form')).toHaveClass('custom-form');
    });
  });
});
