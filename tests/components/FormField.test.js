import { render, screen } from '@testing-library/react';
import FormField from '@/components/FormField';

describe('FormField', () => {
  const mockRegister = jest.fn().mockReturnValue({});
  const baseProps = {
    label: 'Email',
    type: 'email',
    id: 'email',
    register: mockRegister,
    errors: {},
    placeholder: 'Enter your email',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders label and input', () => {
      render(<FormField {...baseProps} />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('applies placeholder, id, and type', () => {
      render(<FormField {...baseProps} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter your email');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('adds custom className if provided', () => {
      render(<FormField {...baseProps} className="custom-style" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('custom-style');
    });

    it('disables input when disabled', () => {
      render(<FormField {...baseProps} disabled />);
      expect(screen.getByLabelText('Email')).toBeDisabled();
    });
  });

  describe('Error + help text', () => {
    it('shows error message and red border when error exists', () => {
      const props = {
        ...baseProps,
        errors: {
          email: { message: 'Email is required' },
        },
      };
      render(<FormField {...props} />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toHaveClass('border-red-500');
    });

    it('shows help text when no error exists', () => {
      render(<FormField {...baseProps} helpText="Helpful hint" />);
      expect(screen.getByText('Helpful hint')).toBeInTheDocument();
    });

    it('hides help text when error exists', () => {
      const props = {
        ...baseProps,
        helpText: 'Helpful hint',
        errors: {
          email: { message: 'Invalid email' },
        },
      };
      render(<FormField {...props} />);
      expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
    });
  });

  describe('Supported input types', () => {
    it('renders a textarea for type="textarea"', () => {
      render(<FormField {...baseProps} type="textarea" />);
      const textarea = screen.getByLabelText('Email');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders a date input for type="date"', () => {
      render(<FormField {...baseProps} type="date" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'date');
    });

    it('renders radio buttons with correct labels', async () => {
      const props = {
        ...baseProps,
        id: 'gender',
        label: 'Gender',
        type: 'radio',
        options: [
          { value: 'm', label: 'Male' },
          { value: 'f', label: 'Female' },
        ],
      };
      render(<FormField {...props} />);
      expect(screen.getByLabelText('Male')).toBeInTheDocument();
      expect(screen.getByLabelText('Female')).toBeInTheDocument();
    });

    it('renders checkboxes with correct labels', () => {
      const props = {
        ...baseProps,
        id: 'hobbies',
        label: 'Hobbies',
        type: 'checkbox',
        options: [
          { value: 'hiking', label: 'Hiking' },
          { value: 'climbing', label: 'Climbing' },
        ],
      };
      render(<FormField {...props} />);
      expect(screen.getByLabelText('Hiking')).toHaveAttribute('type', 'checkbox');
      expect(screen.getByLabelText('Climbing')).toHaveAttribute('type', 'checkbox');
    });
  });

  describe('CharacterCounter', () => {
    it('displays character count when characterCountOptions are provided', () => {
      const props = {
        ...baseProps,
        characterCountOptions: {
          value: 'hello world',
          maxLength: 50,
        },
      };
      render(<FormField {...props} />);
      expect(screen.getByText('11/50')).toBeInTheDocument();
    });
  });

  describe('react-hook-form registration', () => {
    it('calls register with correct options', () => {
      const props = {
        ...baseProps,
        registerOptions: { required: 'This field is required' },
      };
      render(<FormField {...props} />);
      expect(mockRegister).toHaveBeenCalledWith(
        'email',
        expect.objectContaining({
          required: 'This field is required',
          onChange: expect.any(Function),
          onBlur: expect.any(Function),
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('label and input are associated by id', () => {
      render(<FormField {...baseProps} />);
      const label = screen.getByText('Email');
      const input = screen.getByLabelText('Email');
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });
  });
});
