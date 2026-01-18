import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';

// Hoist mocks
const { mockAccountGet, mockAccountDeleteSession, mockRouterPush, mockRouterEvents } = vi.hoisted(
    () => ({
        mockAccountGet: vi.fn(),
        mockAccountDeleteSession: vi.fn(),
        mockRouterPush: vi.fn(),
        mockRouterEvents: {
            on: vi.fn(),
            off: vi.fn(),
        },
    }),
);

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        get: mockAccountGet,
        deleteSession: mockAccountDeleteSession,
    },
    databases: {},
    storage: {},
    databaseId: 'test-db',
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        pathname: '/',
        query: {},
        asPath: '/',
        events: mockRouterEvents,
    }),
}));

// Mock user
const mockUser = {
    $id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    prefs: {},
};

describe('Header Component', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        mockRouterPush.mockResolvedValue(true);
        // Default: not authenticated
        mockAccountGet.mockRejectedValue(new Error('Not authenticated'));
    });

    describe('Logged Out State', () => {
        it('renders logo and navigation links', async () => {
            await act(async () => {
                render(<Header />);
            });

            expect(screen.getByTestId('logo-link')).toBeInTheDocument();
            expect(screen.getByTestId('about-link')).toBeInTheDocument();
            expect(screen.getByTestId('contact-link')).toBeInTheDocument();
        });

        it('shows home and login links when logged out', async () => {
            await act(async () => {
                render(<Header />);
            });

            expect(screen.getByTestId('home-link')).toBeInTheDocument();
            expect(screen.getByTestId('login-link')).toBeInTheDocument();
            expect(screen.queryByTestId('dashboard-link')).not.toBeInTheDocument();
            expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
        });
    });

    describe('Logged In State', () => {
        beforeEach(() => {
            mockAccountGet.mockResolvedValue(mockUser);
        });

        it('shows dashboard and logout when logged in', async () => {
            await act(async () => {
                render(<Header />);
            });

            await waitFor(() => {
                expect(screen.getByTestId('dashboard-link')).toBeInTheDocument();
            });

            expect(screen.getByTestId('logout-button')).toBeInTheDocument();
            expect(screen.queryByTestId('home-link')).not.toBeInTheDocument();
            expect(screen.queryByTestId('login-link')).not.toBeInTheDocument();
        });

        it('calls deleteSession and navigates to /login on logout', async () => {
            mockAccountDeleteSession.mockResolvedValue({});

            await act(async () => {
                render(<Header />);
            });

            await waitFor(() => {
                expect(screen.getByTestId('logout-button')).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('logout-button'));

            await waitFor(() => {
                expect(mockAccountDeleteSession).toHaveBeenCalledWith('current');
                expect(mockRouterPush).toHaveBeenCalledWith('/login');
            });
        });

        it('logs error when logout fails', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockAccountDeleteSession.mockRejectedValue(new Error('Logout failed'));

            await act(async () => {
                render(<Header />);
            });

            await waitFor(() => {
                expect(screen.getByTestId('logout-button')).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('logout-button'));

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Error logging out:',
                    expect.any(Error),
                );
            });

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Mobile Menu', () => {
        it('toggles mobile menu on button click', async () => {
            await act(async () => {
                render(<Header />);
            });

            const toggleButton = screen.getByTestId('menu-toggle');
            expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

            await user.click(toggleButton);
            expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

            await user.click(toggleButton);
            expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
        });

        it('shows correct links in mobile menu when logged out', async () => {
            await act(async () => {
                render(<Header />);
            });

            const toggleButton = screen.getByTestId('menu-toggle');
            await user.click(toggleButton);

            const mobileMenu = screen.getByTestId('mobile-menu');
            expect(mobileMenu).toBeInTheDocument();
            expect(screen.getByTestId('mobile-home-link')).toBeInTheDocument();
            expect(screen.getByTestId('mobile-login-link')).toBeInTheDocument();
        });

        it('shows correct links in mobile menu when logged in', async () => {
            mockAccountGet.mockResolvedValue(mockUser);

            await act(async () => {
                render(<Header />);
            });

            await waitFor(() => {
                expect(screen.getByTestId('dashboard-link')).toBeInTheDocument();
            });

            const toggleButton = screen.getByTestId('menu-toggle');
            await user.click(toggleButton);

            expect(screen.getByTestId('mobile-dashboard-link')).toBeInTheDocument();
            expect(screen.getByTestId('mobile-logout-button')).toBeInTheDocument();
            expect(screen.queryByTestId('mobile-home-link')).not.toBeInTheDocument();
        });
    });

    describe('Cleanup', () => {
        it('removes route change listener on unmount', async () => {
            const { unmount } = await act(async () => render(<Header />));

            unmount();

            expect(mockRouterEvents.off).toHaveBeenCalledWith(
                'routeChangeStart',
                expect.any(Function),
            );
        });
    });
});
