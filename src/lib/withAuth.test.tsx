import { render, screen, waitFor } from '@testing-library/react';
import withAuth from './withAuth';
import { account } from './appwriteClient';

vi.mock('./appwriteClient', () => ({
    account: {
        get: vi.fn(),
    },
}));

const mockPush = vi.fn().mockResolvedValue(true);

vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockPush,
        pathname: '/',
        query: {},
    }),
}));

const MockComponent: React.FC<{ user: unknown; testProp?: string }> = ({ user, testProp }) => (
    <div>
        <div data-testid='user'>{user ? 'authenticated' : 'not-authenticated'}</div>
        {testProp && <div data-testid='test-prop'>{testProp}</div>}
    </div>
);

describe('withAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPush.mockClear();
    });

    test('shows loading state initially', () => {
        vi.mocked(account.get).mockImplementation(() => new Promise(() => {})); // Never resolves

        const ProtectedComponent = withAuth(MockComponent);
        render(<ProtectedComponent />);

        expect(screen.queryByTestId('user')).not.toBeInTheDocument();
    });

    test('passes user prop when authenticated', async () => {
        const mockUser = { $id: 'user-123' };
        vi.mocked(account.get).mockResolvedValue(
            mockUser as unknown as Awaited<ReturnType<typeof account.get>>,
        );

        const ProtectedComponent = withAuth(MockComponent);
        render(<ProtectedComponent testProp='test' />);

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('authenticated');
        });

        expect(screen.getByTestId('test-prop')).toHaveTextContent('test');
    });

    test('passes null user when not authenticated', async () => {
        vi.mocked(account.get).mockRejectedValue(new Error('Not authenticated'));

        const ProtectedComponent = withAuth(MockComponent);
        render(<ProtectedComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('not-authenticated');
        });
    });

    test('redirects when redirectIfAuthenticated is true', async () => {
        const mockUser = { $id: 'user-123' };
        vi.mocked(account.get).mockResolvedValue(
            mockUser as unknown as Awaited<ReturnType<typeof account.get>>,
        );

        const ProtectedComponent = withAuth(MockComponent, { redirectIfAuthenticated: true });
        render(<ProtectedComponent />);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });
});
