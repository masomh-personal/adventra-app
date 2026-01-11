import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type JSX,
} from 'react';
import { useRouter } from 'next/router';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

type ModalVariant = 'error' | 'success' | 'info';

interface ModalContextType {
  openModal: (content: JSX.Element | null) => void;
  closeModal: () => void;
  showErrorModal: (
    message: string,
    title?: string,
    onClose?: () => void,
    closeButtonLabel?: string,
  ) => void;
  showSuccessModal: (
    message: string,
    title?: string,
    onClose?: () => void,
    closeButtonLabel?: string,
  ) => void;
  showInfoModal: (
    message: string,
    title?: string,
    onClose?: () => void,
    closeButtonLabel?: string,
  ) => void;
  showConfirmationModal: (message: string, title?: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  showErrorModal: () => {},
  showSuccessModal: () => {},
  showInfoModal: () => {},
  showConfirmationModal: async () => false,
});

const ICONS: Record<ModalVariant, JSX.Element> = {
  error: <FiAlertCircle className="text-red-600 w-6 h-6 mr-2" />,
  success: <FiCheckCircle className="text-green-600 w-6 h-6 mr-2" />,
  info: <FiInfo className="text-blue-600 w-6 h-6 mr-2" />,
};

const TITLE_CLASSES: Record<ModalVariant, string> = {
  error: 'text-red-600',
  success: 'text-green-600',
  info: 'text-blue-600',
};

const BUTTON_CLASSES: Record<ModalVariant, string> = {
  error: 'bg-red-500 hover:bg-red-600',
  success: 'bg-green-500 hover:bg-green-600',
  info: 'bg-blue-500 hover:bg-blue-600',
};

interface BaseModalProps {
  title?: string;
  message: string;
  onClose: () => void;
  variant?: ModalVariant;
  closeButtonLabel?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  title = 'Notice',
  message,
  onClose,
  variant = 'info',
  closeButtonLabel = 'Close',
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
        {closeButtonLabel}
      </button>
    </div>
  </div>
);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const closeModal = useCallback(() => {
    setModalContent(null);
    setIsClosing(true);

    setTimeout(() => {
      setIsClosing(false);
    }, 750);
  }, []);

  const openModal = useCallback((content: JSX.Element | null) => {
    setModalContent(content);
  }, []);

  const showModal = useCallback(
    (variant: ModalVariant) =>
      (message: string, title?: string, onClose?: () => void, closeButtonLabel = 'Close') => {
        const modal = (
          <BaseModal
            title={title}
            message={message}
            onClose={() => {
              closeModal();
              onClose?.();
            }}
            variant={variant}
            closeButtonLabel={closeButtonLabel}
          />
        );

        openModal(modal);
      },
    [openModal, closeModal],
  );

  // New showConfirmationModal function
  const showConfirmationModal = useCallback(
    (message: string, title = 'Confirm'): Promise<boolean> => {
      return new Promise(resolve => {
        const confirmModal = (
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-red-600 flex items-center">
                <FiAlertCircle className="text-red-600 w-6 h-6 mr-2" />
                {title}
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  resolve(false); // No
                  closeModal();
                }}
                className="px-4 py-2 text-white bg-gray-400 rounded"
              >
                No
              </button>
              <button
                onClick={() => {
                  resolve(true); // Yes
                  closeModal();
                }}
                className="px-4 py-2 text-white bg-red-600 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        );

        openModal(confirmModal);
      });
    },
    [closeModal, openModal],
  );

  const showErrorModal = showModal('error');
  const showSuccessModal = showModal('success');
  const showInfoModal = showModal('info');

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
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

  // CLEANUP MODAL ON ROUTE CHANGE
  useEffect(() => {
    const handleRouteChange = () => {
      setModalContent(null);
      setIsClosing(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        showErrorModal,
        showSuccessModal,
        showInfoModal,
        showConfirmationModal,
      }}
    >
      {children}
      {modalContent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative transform scale-95 animate-scale-in"
            onClick={e => e.stopPropagation()}
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

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
