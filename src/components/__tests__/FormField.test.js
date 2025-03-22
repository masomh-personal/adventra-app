import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from '../FormField';

describe('FormField', () => {
  const defaultProps = {
    label: 'Email',
    type: 'email',
    id: 'email',
    register: jest.fn(),
    errors: {},
    placeholder: 'Enter your email',
  };

  describe('rendering', () => {
    it('renders the label correctly', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders the input with correct attributes', () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('id', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter your email');
    });

    it('applies the correct class names without errors', () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('p-2');
      expect(input).toHaveClass('border');
      expect(input).toHaveClass('border-gray-300');
      expect(input).not.toHaveClass('border-red-500');
    });
  });

  describe('error handling', () => {
    it('displays error message when provided', () => {
      const propsWithError = {
        ...defaultProps,
        errors: {
          email: {
            message: 'Email is required',
          },
        },
      };

      render(<FormField {...propsWithError} />);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('applies error styling when there is an error', () => {
      const propsWithError = {
        ...defaultProps,
        errors: {
          email: {
            message: 'Email is required',
          },
        },
      };

      render(<FormField {...propsWithError} />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-red-500');
      expect(input).not.toHaveClass('border-gray-300');
    });
  });

  describe('react-hook-form integration', () => {
    it('calls register with the correct id', () => {
      render(<FormField {...defaultProps} />);

      expect(defaultProps.register).toHaveBeenCalledWith('email');
    });
  });

  describe('accessibility', () => {
    it('associates label with input via id', () => {
      render(<FormField {...defaultProps} />);

      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id', 'email');
    });
  });
});
