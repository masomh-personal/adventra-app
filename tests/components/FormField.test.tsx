import { render, screen } from '@testing-library/react';

import FormField from '@/components/FormField';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

describe('FormField', () => {
    const mockRegister = jest.fn().mockReturnValue({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: '',
        ref: jest.fn(),
    }) as unknown as UseFormRegister<{ email: string }>;
    const baseProps = {
        label: 'Email',
        type: 'email' as const,
        id: 'email' as const,
        register: mockRegister,
        errors: {} as FieldErrors<{ email: string }>,
        placeholder: 'Enter your email',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic rendering', () => {
        test('renders label and input', () => {
            render(<FormField {...baseProps} />);
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        test('applies placeholder, id, and type', () => {
            render(<FormField {...baseProps} />);
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('type', 'email');
            expect(input).toHaveAttribute('placeholder', 'Enter your email');
            expect(input).toHaveAttribute('id', 'email');
        });

        test('adds custom className if provided', () => {
            render(<FormField {...baseProps} className='custom-style' />);
            const input = screen.getByLabelText('Email');
            expect(input).toHaveClass('custom-style');
        });

        test('disables input when disabled', () => {
            render(<FormField {...baseProps} disabled />);
            expect(screen.getByLabelText('Email')).toBeDisabled();
        });
    });

    describe('Error + help text', () => {
        test('shows error message and red border when error exists', () => {
            const props = {
                ...baseProps,
                errors: {
                    email: { message: 'Email is required', type: 'required' },
                } as FieldErrors<{ email: string }>,
            };
            render(<FormField {...props} />);
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toHaveClass('border-red-500');
        });

        test('shows help text when no error exists', () => {
            render(<FormField {...baseProps} helpText='Helpful hint' />);
            expect(screen.getByText('Helpful hint')).toBeInTheDocument();
        });

        test('hides help text when error exists', () => {
            const props = {
                ...baseProps,
                helpText: 'Helpful hint',
                errors: {
                    email: { message: 'Invalid email', type: 'validate' },
                } as FieldErrors<{ email: string }>,
            };
            render(<FormField {...props} />);
            expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
        });
    });

    describe('Supported input types', () => {
        test('renders a textarea for type="textarea"', () => {
            render(<FormField {...baseProps} type='textarea' />);
            const textarea = screen.getByLabelText('Email');
            expect(textarea.tagName).toBe('TEXTAREA');
        });

        test('renders a date input for type="date"', () => {
            render(<FormField {...baseProps} type='date' />);
            const input = screen.getByLabelText('Email');
            expect(input).toHaveAttribute('type', 'date');
        });

        test('renders radio buttons with correct labels', () => {
            const mockRegister = jest.fn().mockReturnValue({
                onChange: jest.fn(),
                onBlur: jest.fn(),
                name: 'gender',
                ref: jest.fn(),
            }) as unknown as UseFormRegister<{ gender: string }>;
            const props = {
                id: 'gender' as const,
                label: 'Gender',
                type: 'radio' as const,
                register: mockRegister,
                errors: {} as FieldErrors<{ gender: string }>,
                options: [
                    { value: 'm', label: 'Male' },
                    { value: 'f', label: 'Female' },
                ],
            };
            render(<FormField {...props} />);
            expect(screen.getByLabelText('Male')).toBeInTheDocument();
            expect(screen.getByLabelText('Female')).toBeInTheDocument();
        });

        test('renders checkboxes with correct labels', () => {
            const mockRegister = jest.fn().mockReturnValue({
                onChange: jest.fn(),
                onBlur: jest.fn(),
                name: 'hobbies',
                ref: jest.fn(),
            }) as unknown as UseFormRegister<{ hobbies: string[] }>;
            const props = {
                id: 'hobbies' as const,
                label: 'Hobbies',
                type: 'checkbox' as const,
                register: mockRegister,
                errors: {} as FieldErrors<{ hobbies: string[] }>,
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
        test('displays character count when characterCountOptions are provided', () => {
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
        test('calls register with correct options', () => {
            const props = {
                ...baseProps,
                registerOptions: { required: 'This field is required' },
            };
            render(<FormField {...props} />);
            expect(mockRegister).toHaveBeenCalledWith(
                'email',
                expect.objectContaining({
                    required: 'This field is required',
                }),
            );
        });
    });

    describe('Accessibility', () => {
        test('label and input are associated by id', () => {
            render(<FormField {...baseProps} />);
            const label = screen.getByText('Email');
            const input = screen.getByLabelText('Email');
            expect(label).toHaveAttribute('for', 'email');
            expect(input).toHaveAttribute('id', 'email');
        });
    });
});
