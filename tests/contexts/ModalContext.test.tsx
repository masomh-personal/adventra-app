import React from 'react';
import { render, screen, act } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { ModalProvider, useModal } from '@/contexts/ModalContext';

// Mock next/router for ModalContext use
vi.mock('next/router', () => ({
    useRouter: () => ({
        events: {
            on: vi.fn(),
            off: vi.fn(),
        },
    }),
}));

vi.useFakeTimers();

// Test component to interact with modal
const TestComponent: React.FC = () => {
    const { showErrorModal, showSuccessModal, showInfoModal, closeModal } = useModal();

    return (
        <div>
            <button onClick={() => showErrorModal('Error occurred', 'Error Title')}>Error</button>
            <button
                onClick={() => showSuccessModal('Signup success!', 'Welcome', () => {}, 'Thanks')}
            >
                Success
            </button>
            <button onClick={() => showInfoModal('FYI only', 'Heads Up', undefined, 'Dismiss')}>
                Info
            </button>
            <button onClick={closeModal}>Close Manually</button>
        </div>
    );
};

const renderWithProvider = () =>
    render(
        <ModalProvider>
            <TestComponent />
        </ModalProvider>,
    );

describe('ModalContext', () => {
    afterEach(() => {
        act(() => {
            vi.clearAllTimers();
        });
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    test('shows and closes an error modal', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider();

        const errorButton = screen.getByText('Error');
        await user.click(errorButton);

        expect(await screen.findByText('Error occurred')).toBeInTheDocument();
        expect(screen.getByText('Error Title')).toBeInTheDocument();

        // Use getAllByRole and select the footer Close button (not the X button or Close Manually button)
        const closeButtons = screen.getAllByRole('button', { name: /close/i });
        // The footer "Close" button is the last one (after the X button with aria-label)
        const footerCloseButton = closeButtons[closeButtons.length - 1];
        await user.click(footerCloseButton);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
    });

    test('shows success modal with custom close label', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider();

        const successButton = screen.getByText('Success');
        await user.click(successButton);

        expect(await screen.findByText('Signup success!')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /thanks/i })).toBeInTheDocument();
    });

    test('shows info modal with custom close label', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider();

        const infoButton = screen.getByText('Info');
        await user.click(infoButton);

        expect(await screen.findByText('FYI only')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });

    test('closes modal using manual contexts call', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider();

        const errorButton = screen.getByText('Error');
        await user.click(errorButton);

        expect(await screen.findByText('Error occurred')).toBeInTheDocument();

        const closeManuallyButton = screen.getByText('Close Manually');
        await user.click(closeManuallyButton);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
    });

    test('shows confirmation modal and resolves promise', async () => {
        const user = userEvent.setup({ delay: null });
        const TestComponentWithConfirm: React.FC = () => {
            const { showConfirmationModal } = useModal();
            const [confirmed, setConfirmed] = React.useState<boolean | null>(null);

            const handleClick = async () => {
                const result = await showConfirmationModal('Are you sure?', 'Confirm Action');
                setConfirmed(result);
            };

            return (
                <div>
                    <button onClick={handleClick}>Show Confirm</button>
                    {confirmed !== null && (
                        <div data-testid='result'>{confirmed ? 'Yes' : 'No'}</div>
                    )}
                </div>
            );
        };

        render(
            <ModalProvider>
                <TestComponentWithConfirm />
            </ModalProvider>,
        );

        const confirmButton = screen.getByText('Show Confirm');
        await user.click(confirmButton);

        expect(await screen.findByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Confirm Action')).toBeInTheDocument();

        // Click "Yes" button
        const yesButton = screen.getByRole('button', { name: /yes/i });
        await user.click(yesButton);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(await screen.findByTestId('result')).toHaveTextContent('Yes');
    });

    test('confirmation modal resolves false when No is clicked', async () => {
        const user = userEvent.setup({ delay: null });
        const TestComponentWithConfirm: React.FC = () => {
            const { showConfirmationModal } = useModal();
            const [confirmed, setConfirmed] = React.useState<boolean | null>(null);

            const handleClick = async () => {
                const result = await showConfirmationModal('Are you sure?', 'Confirm Action');
                setConfirmed(result);
            };

            return (
                <div>
                    <button onClick={handleClick}>Show Confirm</button>
                    {confirmed !== null && (
                        <div data-testid='result'>{confirmed ? 'Yes' : 'No'}</div>
                    )}
                </div>
            );
        };

        render(
            <ModalProvider>
                <TestComponentWithConfirm />
            </ModalProvider>,
        );

        const confirmButton = screen.getByText('Show Confirm');
        await user.click(confirmButton);

        expect(await screen.findByText('Are you sure?')).toBeInTheDocument();

        // Click "No" button
        const noButton = screen.getByRole('button', { name: /no/i });
        await user.click(noButton);

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(await screen.findByTestId('result')).toHaveTextContent('No');
    });

    test('closes modal on ESC key press', async () => {
        const user = userEvent.setup({ delay: null });
        renderWithProvider();

        const errorButton = screen.getByText('Error');
        await user.click(errorButton);

        expect(await screen.findByText('Error occurred')).toBeInTheDocument();

        // Press ESC key
        await user.keyboard('{Escape}');

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
    });

    test('calls openModal directly', async () => {
        const TestComponentWithOpen: React.FC = () => {
            const { openModal } = useModal();
            return (
                <div>
                    <button
                        onClick={() =>
                            openModal(
                                <div>
                                    <h2>Custom Modal</h2>
                                    <p>Custom content</p>
                                </div>,
                            )
                        }
                    >
                        Open Custom
                    </button>
                </div>
            );
        };

        const user = userEvent.setup({ delay: null });
        render(
            <ModalProvider>
                <TestComponentWithOpen />
            </ModalProvider>,
        );

        const openButton = screen.getByText('Open Custom');
        await user.click(openButton);

        expect(await screen.findByText('Custom Modal')).toBeInTheDocument();
        expect(screen.getByText('Custom content')).toBeInTheDocument();
    });
});
