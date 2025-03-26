import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormWrapper from '../FormWrapper';
import * as yup from 'yup';

// Mock child component to use in our tests
const FormField = ({ register, errors, id, label }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input id={id} data-testid={`input-${id}`} {...register(id)} />
    {errors[id] && <span>{errors[id].message}</span>}
  </div>
);

describe('FormWrapper', () => {
  const mockOnSubmit = jest.fn();
  const mockOnError = jest.fn();
  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnError.mockClear();
  });

  describe('rendering', () => {
    it('renders the form with title', () => {
      render(
        <FormWrapper title="Test Form" validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
          <FormField id="email" label="Email" />
        </FormWrapper>
      );

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders without title when title is not provided', () => {
      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.queryByText('Test Form')).not.toBeInTheDocument();
    });

    it('renders default submit button', () => {
      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('renders custom submit button label', () => {
      render(
        <FormWrapper
          validationSchema={validationSchema}
          onSubmit={mockOnSubmit}
          submitLabel="Send Message"
        >
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });
  });

  describe('prop passing', () => {
    it('passes form context to children', async () => {
      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      const input = screen.getByLabelText('Name');
      expect(input).toBeInTheDocument();

      // The register function should have been passed down to make the input controlled
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Test User' } });
      });

      expect(input.value).toBe('Test User');
    });
  });

  describe('validation', () => {
    it('validates input and shows error messages', async () => {
      render(
        <FormWrapper
          validationSchema={validationSchema}
          onSubmit={mockOnSubmit}
          onError={mockOnError}
        >
          <FormField id="name" label="Name" />
          <FormField id="email" label="Email" />
        </FormWrapper>
      );

      // Submit the form without filling required fields
      await act(async () => {
        fireEvent.submit(screen.getByRole('form'));
      });

      // We need to wait for validation errors to appear
      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(await screen.findByText('Email is required')).toBeInTheDocument();

      // mockOnSubmit should not be called when validation fails
      expect(mockOnSubmit).not.toHaveBeenCalled();
      // mockOnError should be called when validation fails
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('calls onSubmit when form is valid', async () => {
      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
          <FormField id="email" label="Email" />
        </FormWrapper>
      );

      // Fill in form fields with valid data
      await act(async () => {
        fireEvent.change(screen.getByLabelText('Name'), {
          target: { value: 'Test User' },
        });
      });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Email'), {
          target: { value: 'test@example.com' },
        });
      });

      // Submit the form
      await act(async () => {
        fireEvent.submit(screen.getByRole('form'));
      });

      // Wait for validation to complete and assert onSubmit was called
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
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

    it('shows loading state during submission', async () => {
      mockOnSubmit.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
          <FormField id="email" label="Email" />
        </FormWrapper>
      );

      // Fill in form fields with valid data
      await act(async () => {
        fireEvent.change(screen.getByLabelText('Name'), {
          target: { value: 'Test User' },
        });
      });

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Email'), {
          target: { value: 'test@example.com' },
        });
      });

      // Submit the form
      let submitButton;
      await act(async () => {
        submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);
      });

      // Button should change to "Submitting..." during submission
      expect(submitButton).toHaveTextContent('Submitting...');
      expect(submitButton).toBeDisabled();

      // Wait for submission to complete
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('defaultValues', () => {
    it('initializes form with default values', () => {
      render(
        <FormWrapper
          validationSchema={validationSchema}
          onSubmit={mockOnSubmit}
          defaultValues={{ name: 'Default Name', email: 'default@example.com' }}
        >
          <FormField id="name" label="Name" />
          <FormField id="email" label="Email" />
        </FormWrapper>
      );

      expect(screen.getByLabelText('Name')).toHaveValue('Default Name');
      expect(screen.getByLabelText('Email')).toHaveValue('default@example.com');
    });
  });

  describe('additionalProps', () => {
    it('applies additional form props', () => {
      render(
        <FormWrapper
          validationSchema={validationSchema}
          onSubmit={mockOnSubmit}
          formProps={{ 'data-testid': 'test-form', className: 'test-class' }}
        >
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      const form = screen.getByTestId('test-form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('test-class');
    });

    it('applies additional className', () => {
      render(
        <FormWrapper
          validationSchema={validationSchema}
          onSubmit={mockOnSubmit}
          className="custom-form-class"
        >
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      const form = screen.getByRole('form');
      expect(form).toHaveClass('custom-form-class');
    });
  });

  describe('form without validation schema', () => {
    it('works without a validation schema', async () => {
      render(
        <FormWrapper onSubmit={mockOnSubmit}>
          <FormField id="name" label="Name" />
        </FormWrapper>
      );

      await act(async () => {
        fireEvent.change(screen.getByLabelText('Name'), {
          target: { value: 'Test User' },
        });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole('form'));
      });

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Test User' }, expect.anything());
      });
    });
  });
});
