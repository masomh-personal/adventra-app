import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ModalProvider, useModal } from '../ModalContext';
import '@testing-library/jest-dom';

jest.useFakeTimers();

// Test component to exercise modal context API
const TestComponent = () => {
  const { openModal, closeModal, showErrorModal, showSuccessModal, showInfoModal } = useModal();

  return (
    <div>
      <button onClick={() => openModal(<div>Custom Modal Content</div>)}>Open Custom Modal</button>
      <button onClick={() => showErrorModal('Something went wrong', 'Oops!')}>
        Open Error Modal
      </button>
      <button onClick={() => showSuccessModal('Signup complete!', 'Success', undefined, 'Nice')}>
        Open Success Modal
      </button>
      <button onClick={() => showInfoModal('This is FYI', 'Notice', undefined, 'Got it')}>
        Open Info Modal
      </button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
};

const renderWithProvider = (ui = <TestComponent />) => render(<ModalProvider>{ui}</ModalProvider>);

describe('ModalContext', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering and closing modals', () => {
    it('renders custom modal content when openModal is called', () => {
      renderWithProvider();
      fireEvent.click(screen.getByText(/open custom modal/i));
      expect(screen.getByText(/custom modal content/i)).toBeInTheDocument();
    });

    it('renders error modal and closes via internal button', () => {
      renderWithProvider();
      fireEvent.click(screen.getByText(/open error modal/i));

      expect(screen.getByText(/oops!/i)).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      const modalCloseButton = screen.getByText('Close');
      fireEvent.click(modalCloseButton);

      act(() => {
        jest.advanceTimersByTime(750);
      });

      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });

    it('closes the modal using closeModal from context', () => {
      renderWithProvider();
      fireEvent.click(screen.getByText(/open custom modal/i));
      expect(screen.getByText(/custom modal content/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/close modal/i));

      act(() => {
        jest.advanceTimersByTime(750);
      });

      expect(screen.queryByText(/custom modal content/i)).not.toBeInTheDocument();
    });
  });

  describe('New modal features', () => {
    it('renders success modal with custom closeLabel', () => {
      renderWithProvider();
      fireEvent.click(screen.getByText(/open success modal/i));
      expect(screen.getByText('Nice')).toBeInTheDocument();
    });

    it('renders info modal with custom closeLabel', () => {
      renderWithProvider();
      fireEvent.click(screen.getByText(/open info modal/i));
      expect(screen.getByText('Got it')).toBeInTheDocument();
    });
  });
});
