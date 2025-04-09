import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from '@/components/FormField';

describe('FormField', () => {
  const defaultProps = {
    label: 'Email',
    type: 'email',
    id: 'email',
    register: jest.fn().mockReturnValue({}),
    errors: {},
    placeholder: 'Enter your email',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    it('calls register with the correct id and registerOptions', () => {
      const registerOptions = { required: 'This field is required' };
      render(<FormField {...defaultProps} registerOptions={registerOptions} />);

      expect(defaultProps.register).toHaveBeenCalledWith(
        'email',
        expect.objectContaining(registerOptions)
      );
    });

    it('calls register with just the id when no registerOptions provided', () => {
      render(<FormField {...defaultProps} />);

      expect(defaultProps.register).toHaveBeenCalledWith('email', expect.objectContaining({}));
    });
  });

  describe('help text', () => {
    it('displays help text when provided and no errors exist', () => {
      const props = {
        ...defaultProps,
        helpText: 'This is some helpful information',
      };

      render(<FormField {...props} />);

      expect(screen.getByText('This is some helpful information')).toBeInTheDocument();
      expect(screen.getByText('This is some helpful information')).toHaveClass('text-gray-500');
    });

    it('does not display help text when there is an error', () => {
      const props = {
        ...defaultProps,
        helpText: 'This is some helpful information',
        errors: {
          email: {
            message: 'Email is required',
          },
        },
      };

      render(<FormField {...props} />);

      expect(screen.queryByText('This is some helpful information')).not.toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
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

  describe('select input type', () => {
    it('renders a select element with options', () => {
      const selectProps = {
        ...defaultProps,
        type: 'select',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      };

      render(<FormField {...selectProps} />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders a placeholder option when provided', () => {
      const selectProps = {
        ...defaultProps,
        type: 'select',
        placeholder: 'Select an option',
        options: [{ value: 'option1', label: 'Option 1' }],
      };

      render(<FormField {...selectProps} />);

      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });
  });

  describe('textarea input type', () => {
    it('renders a textarea element', () => {
      const textareaProps = {
        ...defaultProps,
        type: 'textarea',
      };

      render(<FormField {...textareaProps} />);

      const textarea = screen.getByLabelText('Email');
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('rows', '4');
    });
  });

  describe('checkbox input type', () => {
    it('renders a checkbox with label after the input', () => {
      const checkboxProps = {
        ...defaultProps,
        type: 'checkbox',
      };

      render(<FormField {...checkboxProps} />);

      const checkbox = screen.getByLabelText('Email');
      expect(checkbox).toHaveAttribute('type', 'checkbox');

      // For checkboxes, the label should be rendered after the input
      const checkboxContainer = checkbox.closest('div');
      expect(checkboxContainer.firstChild).toBe(checkbox);
    });
  });

  describe('radio input type', () => {
    it('renders radio buttons for each option', () => {
      const radioProps = {
        ...defaultProps,
        type: 'radio',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
      };

      render(<FormField {...radioProps} />);

      expect(screen.getByLabelText('Option 1')).toHaveAttribute('type', 'radio');
      expect(screen.getByLabelText('Option 2')).toHaveAttribute('type', 'radio');
    });
  });

  describe('custom styling', () => {
    it('applies custom className to the input', () => {
      const customProps = {
        ...defaultProps,
        className: 'custom-class',
      };

      render(<FormField {...customProps} />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('disabled state', () => {
    it('disables the input when disabled prop is true', () => {
      const disabledProps = {
        ...defaultProps,
        disabled: true,
      };

      render(<FormField {...disabledProps} />);

      const input = screen.getByLabelText('Email');
      expect(input).toBeDisabled();
    });
  });
});
