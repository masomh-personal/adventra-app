import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/login';

// Hoist mocks
const {
    mockShowErrorModal,
    mockShowSuccessModal,
    mockRouterReplace,
    mockCreateEmailSession,
    mockCreateMagicURLSession,
} = vi.hoisted(() => ({
    mockShowErrorModal: vi.fn(),
    mockShowSuccessModal: vi.fn(),
    mockRouterReplace: vi.fn(),
    mockCreateEmailSession: vi.fn(),
    mockCreateMagicURLSession: vi.fn(),
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        createEmailSession: mockCreateEmailSession,
        createMagicURLSession: mockCreateMagicURLSession,
    },
    databases: {},
    storage: {},
    databaseId: 'test-db',
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        replace: mockRouterReplace,
        push: vi.fn(),
        pathname: '/login',
        query: {},
        asPath: '/login',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));

// Mock ModalContext
vi.mock('@/contexts/ModalContext', () => ({
    useModal: () => ({
        showErrorModal: mockShowErrorModal,
        showSuccessModal: mockShowSuccessModal,
    }),
}));

// Helpers
const renderPage = () => render(<LoginPage />);
const setupUser = () => userEvent.setup();
const fillLoginForm = async (
    user: ReturnType<typeof userEvent.setup>,
    email: string,
    password: string,
) => {
    await user.type(screen.getByLabelText(/email address/i), email);
    await user.type(screen.getByLabelText(/password/i), password);
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterReplace.mockResolvedValue(true);
    });

    describe('Initial Render', () => {
        it('renders the login form with email and password fields', () => {
            renderPage();

            expect(screen.getByTestId('login-form')).toBeInTheDocument();
            expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        });

        it('shows signup and forgot password links', () => {
            renderPage();

            expect(screen.getByTestId('signup-button')).toBeInTheDocument();
            expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
        });

        it('shows all SSO login buttons', () => {
            renderPage();

            ['google', 'facebook', 'instagram', 'apple'].forEach(provider => {
                expect(screen.getByTestId(`sso-${provider}`)).toBeInTheDocument();
            });
        });
    });

    describe('Email/Password Login', () => {
        it('submits form and redirects on successful login', async () => {
            mockCreateEmailSession.mockResolvedValue({ $id: 'session-123' });

            renderPage();
            const user = setupUser();

            await fillLoginForm(user, 'user@example.com', 'Password123!');
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockCreateEmailSession).toHaveBeenCalledWith(
                    'user@example.com',
                    'Password123!',
                );
                expect(mockRouterReplace).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('shows error modal on login failure', async () => {
            mockCreateEmailSession.mockRejectedValue(new Error('Invalid credentials'));

            renderPage();
            const user = setupUser();

            await fillLoginForm(user, 'fail@example.com', 'Password123!');
            await waitFor(() => expect(screen.getByTestId('button')).toBeEnabled());
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    expect.stringContaining('Invalid'),
                    'Login Failed',
                );
            });
        });

        it('shows email not confirmed error', async () => {
            mockCreateEmailSession.mockRejectedValue(new Error('Email not confirmed'));

            renderPage();
            const user = setupUser();

            await fillLoginForm(user, 'unconfirmed@example.com', 'Password123!');
            await waitFor(() => expect(screen.getByTestId('button')).toBeEnabled());
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    'Email not confirmed',
                    'Email Not Confirmed',
                );
            });
        });
    });

    describe('Magic Link Login', () => {
        it('switches to magic link form when button is clicked', async () => {
            renderPage();
            const user = setupUser();

            await user.click(screen.getByTestId('show-magic'));

            expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
            expect(screen.getByTestId('submit-magic')).toBeInTheDocument();
        });

        it('submits magic link request and shows success modal', async () => {
            mockCreateMagicURLSession.mockResolvedValue({ $id: 'session-123' });

            renderPage();
            const user = setupUser();

            await user.click(screen.getByTestId('show-magic'));
            await user.type(screen.getByLabelText(/email/i), 'magic@example.com');
            await user.click(screen.getByTestId('submit-magic'));

            await waitFor(() => {
                expect(mockCreateMagicURLSession).toHaveBeenCalledWith(
                    'magic@example.com',
                    expect.stringContaining('/dashboard'),
                );
                expect(mockShowSuccessModal).toHaveBeenCalledWith(
                    'Check your email inbox for a secure login link!',
                    'Magic Link Sent',
                );
            });
        });

        it('shows error modal when magic link request fails', async () => {
            mockCreateMagicURLSession.mockRejectedValue(new Error('Magic link error'));

            renderPage();
            const user = setupUser();

            await user.click(screen.getByTestId('show-magic'));
            await user.type(screen.getByLabelText(/email/i), 'magic@example.com');
            await user.click(screen.getByTestId('submit-magic'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    'Unable to send magic link. Please try again.',
                    'Magic Link Error',
                );
            });
        });
    });

    describe('SSO Login', () => {
        it('shows under development modal when SSO button is clicked', async () => {
            renderPage();
            const user = setupUser();

            await user.click(screen.getByTestId('sso-google'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    expect.stringContaining('Google is currently under development'),
                    'SSO Under Development',
                );
            });
        });
    });
});
