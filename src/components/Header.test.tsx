import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { account } from '@/lib/appwriteClient';

vi.mock('@/lib/appwriteClient', () => ({
    account: {
        get: vi.fn(),
        deleteSession: vi.fn(),
    },
}));

const mockRouterPush = vi.fn();
const mockRouterEvents = {
    on: vi.fn(),
    off: vi.fn(),
};

vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        pathname: '/',
        query: {},
        asPath: '/',
        events: mockRouterEvents,
    }),
}));

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering - Logged Out', () => {
        test('renders logo', () => {
            vi.mocked(account.get).mockRejectedValue(new Error('Not authenticated'));
            render(<Header />);
            expect(screen.getByTestId('logo-link')).toBeInTheDocument();
        });

        test('shows home and login links when logged out', async () => {
            vi.mocked(account.get).mockRejectedValue(new Error('Not authenticated'));
            render(<Header />);

            await waitFor(() => {
                expect(screen.getByTestId('home-link')).toBeInTheDocument();
                expect(screen.getByTestId('login-link')).toBeInTheDocument();
            });
        });

        test('shows About and Contact links', async () => {
            vi.mocked(account.get).mockRejectedValue(new Error('Not authenticated'));
            render(<Header />);

            await waitFor(() => {
                expect(screen.getByTestId('about-link')).toBeInTheDocument();
                expect(screen.getByTestId('contact-link')).toBeInTheDocument();
            });
        });
    });

    describe('Rendering - Logged In', () => {
        test('shows Dashboard and Logout when logged in', async () => {
            vi.mocked(account.get).mockResolvedValue({
                $id: 'user-123',
                name: 'Test User',
            } as unknown as Awaited<ReturnType<typeof account.get>>);

            render(<Header />);

            await waitFor(() => {
                expect(screen.getByTestId('dashboard-link')).toBeInTheDocument();
                expect(screen.getByTestId('logout-button')).toBeInTheDocument();
            });
        });
    });

    describe('Mobile Menu', () => {
        test('toggles mobile menu on button click', async () => {
            vi.mocked(account.get).mockRejectedValue(new Error('Not authenticated'));
            const user = userEvent.setup();
            render(<Header />);

            const menuButton = screen.getByTestId('menu-toggle');
            await user.click(menuButton);

            expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
        });
    });

    describe('Logout', () => {
        test('calls deleteSession and navigates on logout', async () => {
            const mockDeleteSession = vi.fn().mockResolvedValue(undefined);
            vi.mocked(account.get).mockResolvedValue({
                $id: 'user-123',
            } as unknown as Awaited<ReturnType<typeof account.get>>);
            vi.mocked(account.deleteSession).mockImplementation(mockDeleteSession);
            mockRouterPush.mockResolvedValue(true);

            const user = userEvent.setup();
            render(<Header />);

            await waitFor(async () => {
                const logoutButton = screen.getByTestId('logout-button');
                await user.click(logoutButton);
            });

            await waitFor(() => {
                expect(mockDeleteSession).toHaveBeenCalledWith('current');
            });
        });
    });
});
