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
});
