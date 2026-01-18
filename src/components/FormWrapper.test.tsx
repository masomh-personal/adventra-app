import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormWrapper from './FormWrapper';
import FormField from './FormField';
import * as yup from 'yup';

const testSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
});

describe('FormWrapper', () => {
    describe('Rendering', () => {
        test('renders form with title', () => {
            render(
                <FormWrapper title='Test Form' onSubmit={() => {}}>
                    <FormField id='name' label='Name' />
                </FormWrapper>,
            );
            expect(screen.getByText('Test Form')).toBeInTheDocument();
        });

        test('renders without title', () => {
            render(
                <FormWrapper onSubmit={() => {}}>
                    <FormField id='name' label='Name' />
                </FormWrapper>,
            );
            expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        });

        test('renders submit button with default label', () => {
            render(
                <FormWrapper onSubmit={() => {}}>
                    <FormField id='name' label='Name' />
                </FormWrapper>,
            );
            expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        });

        test('renders submit button with custom label', () => {
            render(
                <FormWrapper onSubmit={() => {}} submitLabel='Send'>
                    <FormField id='name' label='Name' />
                </FormWrapper>,
            );
            expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
        });

        test('hides submit button when submitLabel is empty string', () => {
            render(
                <FormWrapper onSubmit={() => {}} submitLabel=''>
                    <FormField id='name' label='Name' />
                </FormWrapper>,
            );
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        test('calls onSubmit with form data', async () => {
            const handleSubmit = vi.fn();
            const user = userEvent.setup();
            render(
                <FormWrapper validationSchema={testSchema} onSubmit={handleSubmit}>
                    <FormField id='name' label='Name' />
                    <FormField id='email' label='Email' type='email' />
                </FormWrapper>,
            );

            await user.type(screen.getByLabelText('Name'), 'John Doe');
            await user.type(screen.getByLabelText('Email'), 'john@example.com');
            await user.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() => {
                expect(handleSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        name: 'John Doe',
                        email: 'john@example.com',
                    }),
                    expect.any(Object),
                );
            });
        });
    });

    describe('Validation', () => {
        test('disables submit button when form is invalid', () => {
            render(
                <FormWrapper validationSchema={testSchema} onSubmit={() => {}}>
                    <FormField id='name' label='Name' />
                    <FormField id='email' label='Email' type='email' />
                </FormWrapper>,
            );

            const submitButton = screen.getByRole('button', { name: 'Submit' });
            expect(submitButton).toBeDisabled();
        });

        test('shows validation errors when fields are touched', async () => {
            const user = userEvent.setup();
            render(
                <FormWrapper validationSchema={testSchema} onSubmit={() => {}}>
                    <FormField id='name' label='Name' />
                    <FormField id='email' label='Email' type='email' />
                </FormWrapper>,
            );

            const nameInput = screen.getByLabelText('Name');
            await user.click(nameInput);
            await user.tab();

            expect(await screen.findByText('Name is required')).toBeInTheDocument();
        });
    });

    describe('Children Handling', () => {
        test('renders function children with form context', () => {
            render(
                <FormWrapper onSubmit={() => {}}>
                    {context => (
                        <div data-testid='context'>{context.isValid ? 'valid' : 'invalid'}</div>
                    )}
                </FormWrapper>,
            );

            expect(screen.getByTestId('context')).toBeInTheDocument();
        });

        test('handles non-FormField children', () => {
            render(
                <FormWrapper onSubmit={() => {}}>
                    <div data-testid='custom-child'>Custom</div>
                </FormWrapper>,
            );

            expect(screen.getByTestId('custom-child')).toBeInTheDocument();
        });

        test('handles non-React element children', () => {
            render(
                <FormWrapper onSubmit={() => {}}>
                    {[
                        'text',
                        <div key='div' data-testid='child'>
                            Child
                        </div>,
                    ]}
                </FormWrapper>,
            );

            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        test('handles form submission error gracefully', async () => {
            const handleSubmit = vi.fn().mockRejectedValue(new Error('Submission error'));
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
            const user = userEvent.setup();

            render(
                <FormWrapper validationSchema={testSchema} onSubmit={handleSubmit}>
                    <FormField id='name' label='Name' />
                    <FormField id='email' label='Email' type='email' />
                </FormWrapper>,
            );

            await user.type(screen.getByLabelText('Name'), 'John Doe');
            await user.type(screen.getByLabelText('Email'), 'john@example.com');
            await user.click(screen.getByRole('button', { name: 'Submit' }));

            await waitFor(() => {
                expect(consoleError).toHaveBeenCalled();
            });

            consoleError.mockRestore();
        });
    });

    describe('FormContext Functions', () => {
        test('provides trigger function', async () => {
            let contextTrigger: (() => Promise<boolean>) | undefined;

            render(
                <FormWrapper onSubmit={() => {}}>
                    {context => {
                        contextTrigger = context.trigger;
                        return <div data-testid='trigger-test'>Test</div>;
                    }}
                </FormWrapper>,
            );

            expect(contextTrigger).toBeDefined();
            const result = await contextTrigger!();
            expect(result).toBe(true);
        });

        test('provides getFieldState function', () => {
            let contextGetFieldState:
                | (() => {
                      invalid: boolean;
                      isDirty: boolean;
                      isTouched: boolean;
                      isValidating: boolean;
                      error: unknown;
                  })
                | undefined;

            render(
                <FormWrapper onSubmit={() => {}}>
                    {context => {
                        contextGetFieldState = context.getFieldState;
                        return <div>Test</div>;
                    }}
                </FormWrapper>,
            );

            expect(contextGetFieldState).toBeDefined();
            const state = contextGetFieldState!();
            expect(state.invalid).toBe(false);
            expect(state.isDirty).toBe(false);
        });

        test('provides resetField, clearErrors, setError, setFocus, unregister functions', () => {
            let formContext: any;

            render(
                <FormWrapper onSubmit={() => {}}>
                    {context => {
                        formContext = context;
                        return <div>Test</div>;
                    }}
                </FormWrapper>,
            );

            // Test that all functions exist and can be called
            expect(formContext.resetField).toBeDefined();
            expect(() => formContext.resetField()).not.toThrow();

            expect(formContext.clearErrors).toBeDefined();
            expect(() => formContext.clearErrors()).not.toThrow();

            expect(formContext.setError).toBeDefined();
            expect(() =>
                formContext.setError('field', { type: 'error', message: 'test' }),
            ).not.toThrow();

            expect(formContext.setFocus).toBeDefined();
            expect(() => formContext.setFocus('field')).not.toThrow();

            expect(formContext.unregister).toBeDefined();
            expect(() => formContext.unregister('field')).not.toThrow();
        });
    });

    describe('Ref Handling', () => {
        test('exposes reset via ref', async () => {
            const ref = React.createRef<{ reset: () => void }>();

            render(
                <FormWrapper onSubmit={() => {}} ref={ref}>
                    <FormField id='name' label='Name' />
                </FormWrapper>,
            );

            expect(ref.current).not.toBeNull();
            expect(ref.current?.reset).toBeDefined();
            expect(() => ref.current?.reset()).not.toThrow();
        });
    });
});
