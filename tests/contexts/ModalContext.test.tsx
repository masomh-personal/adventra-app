import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ModalProvider, useModal } from '@/contexts/ModalContext';
import { vi } from 'vitest';

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

// 🔧 Test component to interact with modal
const TestComponent: React.FC = () => {
  const { showErrorModal, showSuccessModal, showInfoModal, closeModal } = useModal();

  return (
    <div>
      <button onClick={() => showErrorModal('Error occurred', 'Error Title')}>Error</button>
      <button onClick={() => showSuccessModal('Signup success!', 'Welcome', () => {}, 'Thanks')}>
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
    </ModalProvider>
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

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

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
});
