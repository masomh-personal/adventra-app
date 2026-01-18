import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MagicLinkForm from './MagicLinkForm';

describe('MagicLinkForm', () => {
    describe('Rendering', () => {
        test('renders email input', () => {
            render(<MagicLinkForm onSubmit={() => {}} onCancel={() => {}} />);
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
        });

        test('renders submit and cancel buttons', () => {
            render(<MagicLinkForm onSubmit={() => {}} onCancel={() => {}} />);
            expect(screen.getByText('Send One-Time Link')).toBeInTheDocument();
            expect(screen.getByText('Back to Login')).toBeInTheDocument();
        });

        test('shows loading state on submit button', () => {
            render(<MagicLinkForm onSubmit={() => {}} onCancel={() => {}} loading />);
            expect(screen.getByTestId('spinner')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        test('calls onCancel when cancel button clicked', async () => {
            const handleCancel = vi.fn();
            const user = userEvent.setup();
            render(<MagicLinkForm onSubmit={() => {}} onCancel={handleCancel} />);

            await user.click(screen.getByText('Back to Login'));
            expect(handleCancel).toHaveBeenCalledTimes(1);
        });

        test('calls onSubmit with lowercase email', async () => {
            const handleSubmit = vi.fn();
            const user = userEvent.setup();
            render(<MagicLinkForm onSubmit={handleSubmit} onCancel={() => {}} />);

            const emailInput = screen.getByLabelText('Email');
            await user.type(emailInput, 'TEST@EXAMPLE.COM');
            await user.click(screen.getByText('Send One-Time Link'));

            expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
        });
    });

    describe('Validation', () => {
        test('disables submit button when email is invalid', async () => {
            const user = userEvent.setup();
            render(<MagicLinkForm onSubmit={() => {}} onCancel={() => {}} />);

            const emailInput = screen.getByLabelText('Email');
            await user.type(emailInput, 'invalid-email');

            const submitButton = screen.getByText('Send One-Time Link');
            expect(submitButton.closest('button')).toBeDisabled();
        });
    });
});
