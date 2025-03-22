import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormWrapper from '../FormWrapper';
import * as yup from 'yup';

// Mock child component to use in our tests
const FormField = ({ register, errors, name, label }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input id={name} {...register(name)} />
    {errors[name] && <span>{errors[name].message}</span>}
  </div>
);

describe('FormWrapper', () => {
  const mockOnSubmit = jest.fn();
  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('rendering', () => {
    it('renders the form with title', () => {
      render(
        <FormWrapper title="Test Form" validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField name="name" label="Name" />
          <FormField name="email" label="Email" />
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
          <FormField name="name" label="Name" />
        </FormWrapper>
      );

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.queryByText('Test Form')).not.toBeInTheDocument();
    });
  });

  describe('prop passing', () => {
    it('passes register and errors to children', async () => {
      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField name="name" label="Name" />
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
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField name="name" label="Name" />
          <FormField name="email" label="Email" />
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
    });
  });

  describe('submission', () => {
    it('calls onSubmit when form is valid', async () => {
      render(
        <FormWrapper validationSchema={validationSchema} onSubmit={mockOnSubmit}>
          <FormField name="name" label="Name" />
          <FormField name="email" label="Email" />
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
          expect.anything()
        );
      });
    });
  });
});
