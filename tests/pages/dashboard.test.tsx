import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Hoist mocks
const { mockAccountGet, mockAccountDeleteSession, mockRouterPush } = vi.hoisted(() => ({
    mockAccountGet: vi.fn(),
    mockAccountDeleteSession: vi.fn(),
    mockRouterPush: vi.fn(),
}));

// Mock Appwrite client - must be before imports
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
        replace: vi.fn(),
        pathname: '/dashboard',
        query: {},
        asPath: '/dashboard',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));

// Now import component after mocks are set up
import Dashboard from '@/pages/dashboard';

// Mock user
const mockUser = {
    $id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    prefs: {},
};

describe('Dashboard Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterPush.mockResolvedValue(true);
        // Auth resolves immediately with mock user
        mockAccountGet.mockResolvedValue(mockUser);
    });

    describe('Initial Render', () => {
        it('displays welcome message with user first name', async () => {
            render(<Dashboard />);

            await waitFor(() => {
                expect(screen.getByText(/welcome/i)).toBeInTheDocument();
            });

            expect(screen.getByText('John')).toBeInTheDocument();
        });

        it('shows all dashboard action cards', async () => {
            render(<Dashboard />);

            await waitFor(() => {
                expect(screen.getByText(/find adventurers/i)).toBeInTheDocument();
            });

            // Check card titles specifically
            const cardTitles = screen.getAllByTestId('infocard-title');
            const titleTexts = cardTitles.map(el => el.textContent);
            expect(titleTexts).toContain('Find Adventurers');
            expect(titleTexts).toContain('Messages');
            expect(titleTexts).toContain('Edit Profile');
            expect(titleTexts).toContain('Logout');
        });

        it('shows action buttons', async () => {
            render(<Dashboard />);

            await waitFor(() => {
                expect(screen.getByTestId('start-matching-button')).toBeInTheDocument();
            });

            expect(screen.getByTestId('view-messages-button')).toBeInTheDocument();
            expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
            expect(screen.getByTestId('logout-button')).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('navigates to search page when Start Matching clicked', async () => {
            render(<Dashboard />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId('start-matching-button')).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('start-matching-button'));

            expect(mockRouterPush).toHaveBeenCalledWith('/search');
        });

        it('navigates to messages page when View Messages clicked', async () => {
            render(<Dashboard />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId('view-messages-button')).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('view-messages-button'));

            expect(mockRouterPush).toHaveBeenCalledWith('/messages');
        });

        it('navigates to edit profile page when Edit Profile clicked', async () => {
            render(<Dashboard />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('edit-profile-button'));

            expect(mockRouterPush).toHaveBeenCalledWith('/edit-profile');
        });
    });

    describe('Logout', () => {
        it('logs out and redirects to login page', async () => {
            mockAccountDeleteSession.mockResolvedValue({});

            render(<Dashboard />);
            const user = userEvent.setup();

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

            render(<Dashboard />);
            const user = userEvent.setup();

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

    describe('User Display', () => {
        it('shows "User" when name is not available', async () => {
            const userWithoutName = { ...mockUser, name: undefined };
            mockAccountGet.mockResolvedValue(userWithoutName);

            render(<Dashboard />);

            await waitFor(() => {
                expect(screen.getByText('User')).toBeInTheDocument();
            });
        });

        it('shows first name only from full name', async () => {
            const userWithFullName = { ...mockUser, name: 'Jane Elizabeth Smith' };
            mockAccountGet.mockResolvedValue(userWithFullName);

            render(<Dashboard />);

            await waitFor(() => {
                expect(screen.getByText('Jane')).toBeInTheDocument();
            });
        });
    });
});
