import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from './FormField';
import FormWrapper from './FormWrapper';
import * as yup from 'yup';

describe('FormField', () => {
    describe('Rendering', () => {
        test('renders text input with label', () => {
            const schema = yup.object({ name: yup.string().required() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='name' label='Name' type='text' />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Name')).toBeInTheDocument();
        });

        test('renders textarea', () => {
            const schema = yup.object({ message: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='message' label='Message' type='textarea' />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Message')).toBeInTheDocument();
            expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
        });

        test('renders date input', () => {
            const schema = yup.object({ date: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='date' label='Date' type='date' />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Date')).toBeInTheDocument();
            expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
        });

        test('renders email input', () => {
            const schema = yup.object({ email: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='email' label='Email' type='email' />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
        });
    });

    describe('Checkboxes', () => {
        test('renders single checkbox', () => {
            const schema = yup.object({ agree: yup.boolean() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='agree' label='I agree' type='checkbox' />
                </FormWrapper>,
            );
            const checkbox = screen.getByLabelText('I agree');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).toHaveAttribute('type', 'checkbox');
        });

        test('renders multiple checkboxes with options', () => {
            const schema = yup.object({ hobbies: yup.array() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField
                        id='hobbies'
                        label='Hobbies'
                        type='checkbox'
                        options={[
                            { value: 'reading', label: 'Reading' },
                            { value: 'coding', label: 'Coding' },
                        ]}
                    />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Reading')).toBeInTheDocument();
            expect(screen.getByLabelText('Coding')).toBeInTheDocument();
        });
    });

    describe('Radio Buttons', () => {
        test('renders radio buttons', () => {
            const schema = yup.object({ choice: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField
                        id='choice'
                        label='Choice'
                        type='radio'
                        options={[
                            { value: 'a', label: 'Option A' },
                            { value: 'b', label: 'Option B' },
                        ]}
                    />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Option A')).toBeInTheDocument();
            expect(screen.getByLabelText('Option B')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        test('shows error message when validation fails', async () => {
            const schema = yup.object({
                email: yup.string().email('Invalid email').required('Email required'),
            });
            const user = userEvent.setup();
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='email' label='Email' type='email' />
                </FormWrapper>,
            );

            const input = screen.getByLabelText('Email');
            await user.click(input);
            await user.tab();

            expect(await screen.findByText('Email required')).toBeInTheDocument();
        });
    });

    describe('Character Counter', () => {
        test('renders character counter when options provided', () => {
            const schema = yup.object({ message: yup.string().max(100) });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField
                        id='message'
                        label='Message'
                        type='textarea'
                        characterCountOptions={{ value: 'test', maxLength: 100 }}
                    />
                </FormWrapper>,
            );
            expect(screen.getByTestId('char-counter')).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        test('applies placeholder', () => {
            const schema = yup.object({ name: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='name' label='Name' placeholder='Enter name' />
                </FormWrapper>,
            );
            expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
        });

        test('disables input when disabled prop is true', () => {
            const schema = yup.object({ name: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='name' label='Name' disabled />
                </FormWrapper>,
            );
            expect(screen.getByLabelText('Name')).toBeDisabled();
        });

        test('shows help text when provided', () => {
            const schema = yup.object({ name: yup.string() });
            render(
                <FormWrapper validationSchema={schema} onSubmit={() => {}}>
                    <FormField id='name' label='Name' helpText='This is helpful' />
                </FormWrapper>,
            );
            expect(screen.getByText('This is helpful')).toBeInTheDocument();
        });
    });
});
