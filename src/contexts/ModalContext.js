import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
  showErrorModal: () => {},
});

const ErrorModal = ({ title = 'Error', message, onClose }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
  >
    <div className="flex justify-between items-center border-b pb-3 mb-4">
      <h2 id="modal-title" className="text-xl font-bold text-red-600">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
    <p className="text-gray-700 mb-4">{message}</p>
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Close
      </button>
    </div>
  </div>
);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = useCallback((content) => {
    setModalContent(content);
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);

  const showErrorModal = useCallback(
    (message, title) => {
      openModal(<ErrorModal title={title} message={message} onClose={closeModal} />);
    },
    [openModal, closeModal]
  );

  // Escape key support
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (modalContent) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [modalContent, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, showErrorModal }}>
      {children}
      {modalContent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeModal} // Click backdrop to close
        >
          <div
            className="relative transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
          >
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
