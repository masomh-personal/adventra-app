import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalProvider, useModal } from '../ModalContext';
import '@testing-library/jest-dom';

// Test component to interact with modal context
const TestComponent = () => {
  const { openModal, closeModal, showErrorModal } = useModal();

  return (
    <div>
      <button onClick={() => openModal(<div>Custom Modal Content</div>)}>Open Custom Modal</button>
      <button onClick={() => showErrorModal('Something went wrong', 'Oops!')}>
        Open Error Modal
      </button>
      <button onClick={closeModal}>Close Modal</button>
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
  it('renders custom modal content when openModal is called', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText(/open custom modal/i));
    expect(screen.getByText(/custom modal content/i)).toBeInTheDocument();
  });

  it('renders error modal when showErrorModal is called', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText(/open error modal/i));

    expect(screen.getByText(/oops!/i)).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    const modalCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');

    expect(modalCloseButton).toBeInTheDocument();
  });

  it('closes the modal when closeModal is called', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText(/open custom modal/i));
    expect(screen.getByText(/custom modal content/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close modal/i));
    expect(screen.queryByText(/custom modal content/i)).not.toBeInTheDocument();
  });

  it('closes the error modal when clicking the close button inside it', () => {
    renderWithProvider();

    // Open the error modal
    fireEvent.click(screen.getByText(/open error modal/i));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Find the specific "Close" button in the modal
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    const modalCloseButton = closeButtons.find((btn) => btn.textContent === 'Close');

    fireEvent.click(modalCloseButton);

    // Assert modal is closed
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
});
