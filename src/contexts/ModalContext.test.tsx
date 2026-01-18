import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider, useModal } from './ModalContext';

vi.mock('next/router', () => ({
    useRouter: () => ({
        events: {
            on: vi.fn(),
            off: vi.fn(),
        },
    }),
}));

// Test component that uses the modal
const TestComponent: React.FC = () => {
    const {
        showErrorModal,
        showSuccessModal,
        showInfoModal,
        showConfirmationModal,
        openModal,
        closeModal,
    } = useModal();

    return (
        <div>
            <button
                onClick={() => showErrorModal('Error message', 'Error Title')}
                data-testid='error-btn'
            >
                Show Error
            </button>
            <button onClick={() => showSuccessModal('Success message')} data-testid='success-btn'>
                Show Success
            </button>
            <button onClick={() => showInfoModal('Info message')} data-testid='info-btn'>
                Show Info
            </button>
            <button onClick={() => showConfirmationModal('Confirm?')} data-testid='confirm-btn'>
                Show Confirm
            </button>
            <button
                onClick={() => openModal(<div data-testid='custom-modal'>Custom</div>)}
                data-testid='custom-btn'
            >
                Custom Modal
            </button>
            <button onClick={closeModal} data-testid='close-btn'>
                Close
            </button>
        </div>
    );
};

describe('ModalContext', () => {
    describe('ModalProvider', () => {
        test('provides modal context to children', () => {
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            expect(screen.getByTestId('error-btn')).toBeInTheDocument();
        });

        test('shows error modal when showErrorModal is called', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('error-btn'));

            await waitFor(() => {
                expect(screen.getByText('Error message')).toBeInTheDocument();
                expect(screen.getByText('Error Title')).toBeInTheDocument();
            });
        });

        test('shows success modal when showSuccessModal is called', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('success-btn'));

            await waitFor(() => {
                expect(screen.getByText('Success message')).toBeInTheDocument();
            });
        });

        test('shows info modal when showInfoModal is called', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('info-btn'));

            await waitFor(() => {
                expect(screen.getByText('Info message')).toBeInTheDocument();
            });
        });

        test('shows confirmation modal when showConfirmationModal is called', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('confirm-btn'));

            await waitFor(() => {
                expect(screen.getByText('Confirm?')).toBeInTheDocument();
                expect(screen.getByText('Yes')).toBeInTheDocument();
                expect(screen.getByText('No')).toBeInTheDocument();
            });
        });

        test('shows custom modal when openModal is called', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('custom-btn'));

            await waitFor(() => {
                expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
            });
        });

        test('closes modal when close button is clicked', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('error-btn'));

            await waitFor(() => {
                expect(screen.getByText('Error message')).toBeInTheDocument();
            });

            const closeButton = screen.getAllByLabelText('Close')[0];
            await user.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText('Error message')).not.toBeInTheDocument();
            });
        });

        test('confirmation modal resolves to true when Yes is clicked', async () => {
            const user = userEvent.setup();
            let confirmResult: boolean | undefined;

            const ConfirmTestComponent: React.FC = () => {
                const { showConfirmationModal } = useModal();

                const handleConfirm = async () => {
                    confirmResult = await showConfirmationModal('Confirm?');
                };

                return (
                    <button onClick={handleConfirm} data-testid='confirm-test-btn'>
                        Test
                    </button>
                );
            };

            render(
                <ModalProvider>
                    <ConfirmTestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('confirm-test-btn'));

            await waitFor(() => {
                expect(screen.getByText('Yes')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Yes'));

            await waitFor(() => {
                expect(confirmResult).toBe(true);
            });
        });

        test('confirmation modal resolves to false when No is clicked', async () => {
            const user = userEvent.setup();
            let confirmResult: boolean | undefined;

            const ConfirmTestComponent: React.FC = () => {
                const { showConfirmationModal } = useModal();

                const handleConfirm = async () => {
                    confirmResult = await showConfirmationModal('Confirm?');
                };

                return (
                    <button onClick={handleConfirm} data-testid='confirm-test-btn-2'>
                        Test
                    </button>
                );
            };

            render(
                <ModalProvider>
                    <ConfirmTestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('confirm-test-btn-2'));

            await waitFor(() => {
                expect(screen.getByText('No')).toBeInTheDocument();
            });

            await user.click(screen.getByText('No'));

            await waitFor(() => {
                expect(confirmResult).toBe(false);
            });
        });

        test('closes modal on ESC key press', async () => {
            const user = userEvent.setup();
            render(
                <ModalProvider>
                    <TestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('error-btn'));

            await waitFor(() => {
                expect(screen.getByText('Error message')).toBeInTheDocument();
            });

            await user.keyboard('{Escape}');

            await waitFor(() => {
                expect(screen.queryByText('Error message')).not.toBeInTheDocument();
            });
        });

        test('calls onClose callback when provided', async () => {
            const user = userEvent.setup();
            const handleClose = vi.fn();

            const OnCloseTestComponent: React.FC = () => {
                const { showErrorModal } = useModal();

                return (
                    <button
                        onClick={() => showErrorModal('Error', 'Title', handleClose)}
                        data-testid='onclose-btn'
                    >
                        Show
                    </button>
                );
            };

            render(
                <ModalProvider>
                    <OnCloseTestComponent />
                </ModalProvider>,
            );

            await user.click(screen.getByTestId('onclose-btn'));

            await waitFor(() => {
                expect(screen.getByText('Error')).toBeInTheDocument();
            });

            const closeButton = screen.getAllByLabelText('Close')[0];
            await user.click(closeButton);

            await waitFor(() => {
                expect(handleClose).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('useModal', () => {
        test('provides default context when used outside provider', () => {
            // useContext returns default value when outside provider
            // The component should render without errors (default functions are no-ops)
            render(<TestComponent />);

            // Modal functions exist but are no-ops
            expect(screen.getByTestId('error-btn')).toBeInTheDocument();
        });
    });
});
