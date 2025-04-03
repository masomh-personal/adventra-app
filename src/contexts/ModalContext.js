import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
  showErrorModal: () => {},
  showSuccessModal: () => {},
  showInfoModal: () => {},
});

const ICONS = {
  error: <FiAlertCircle className="text-red-600 w-6 h-6 mr-2" />,
  success: <FiCheckCircle className="text-green-600 w-6 h-6 mr-2" />,
  info: <FiInfo className="text-blue-600 w-6 h-6 mr-2" />,
};

const TITLE_CLASSES = {
  error: 'text-red-600',
  success: 'text-green-600',
  info: 'text-blue-600',
};

const BUTTON_CLASSES = {
  error: 'bg-red-500 hover:bg-red-600',
  success: 'bg-green-500 hover:bg-green-600',
  info: 'bg-blue-500 hover:bg-blue-600',
};

const BaseModal = ({
  title = 'Notice',
  message,
  onClose,
  variant = 'info',
  closeLabel = 'Close',
}) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
  >
    <div className="flex justify-between items-center border-b pb-3 mb-4">
      <h2
        id="modal-title"
        className={`text-xl font-bold flex items-center ${TITLE_CLASSES[variant]}`}
      >
        {ICONS[variant]}
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
    <p className="text-gray-700 font-bold mb-4">{message}</p>
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className={`px-4 py-2 text-white rounded ${BUTTON_CLASSES[variant]}`}
      >
        {closeLabel}
      </button>
    </div>
  </div>
);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [afterCloseCallback, setAfterCloseCallback] = useState(null);

  const closeModal = useCallback(() => {
    setModalContent(null); // visually hide modal
    setIsClosing(true); // trigger spinner overlay

    setTimeout(() => {
      setIsClosing(false);
      if (typeof afterCloseCallback === 'function') {
        afterCloseCallback();
        setAfterCloseCallback(null); // reset callback
      }
    }, 750);
  }, [afterCloseCallback]);

  const openModal = useCallback((content) => {
    setModalContent(content);
  }, []);

  const showModal = useCallback(
    (variant) =>
      (message, title, onClose = null, closeLabel = 'Close') => {
        if (onClose) {
          setAfterCloseCallback(() => onClose);
        }

        openModal(
          <BaseModal
            title={title}
            message={message}
            onClose={closeModal}
            variant={variant}
            closeLabel={closeLabel}
          />
        );
      },
    [openModal, closeModal]
  );

  const showErrorModal = showModal('error');
  const showSuccessModal = showModal('success');
  const showInfoModal = showModal('info');

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
    <ModalContext.Provider
      value={{ openModal, closeModal, showErrorModal, showSuccessModal, showInfoModal }}
    >
      {children}
      {modalContent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
            {isClosing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-gray-800 rounded-full" />
              </div>
            )}
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
