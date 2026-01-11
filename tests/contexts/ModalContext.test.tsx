import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
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

  it('shows and closes an error modal', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
  });

  it('shows success modal with custom close label', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Signup success!')).toBeInTheDocument();
    expect(screen.getByText('Thanks')).toBeInTheDocument();
  });

  it('shows info modal with custom close label', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('Heads Up')).toBeInTheDocument();
    expect(screen.getByText('FYI only')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('closes modal using manual contexts call', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('Heads Up')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Manually'));

    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(screen.queryByText('FYI only')).not.toBeInTheDocument();
  });
});
