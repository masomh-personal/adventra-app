import { render, screen, waitFor } from '@testing-library/react';
import withAuth from '@/lib/withAuth';

// Hoist mocks
const { mockAccountGet, mockRouterPush } = vi.hoisted(() => ({
    mockAccountGet: vi.fn(),
    mockRouterPush: vi.fn(),
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        get: mockAccountGet,
    },
    databases: {},
    storage: {},
    databaseId: 'test-db',
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        pathname: '/test',
        query: {},
        asPath: '/test',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));

// Mock user matching Appwrite Models.User structure
const createMockUser = (overrides = {}) => ({
    $id: 'user-123',
    $createdAt: '2024-01-01T00:00:00.000Z',
    $updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Test User',
    email: 'test@example.com',
    phone: '',
    emailVerification: true,
    phoneVerification: false,
    prefs: {},
    ...overrides,
});

interface TestComponentProps {
    user?: { email?: string } | null;
    testProp?: string;
}

describe('withAuth HOC', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterPush.mockResolvedValue(true);
    });

    it('renders loading spinner while checking authentication', async () => {
        // Mock a delayed auth check
        mockAccountGet.mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(createMockUser()), 100)),
        );

        const TestComponent = () => <div>Test Content</div>;
        const WrappedComponent = withAuth(TestComponent);

        render(<WrappedComponent />);

        // Should show loading spinner
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('renders component when user is authenticated', async () => {
        const mockUser = createMockUser({ email: 'test@example.com' });
        mockAccountGet.mockResolvedValue(mockUser);

        const TestComponent = ({ testProp, user }: TestComponentProps) => (
            <div>
                <div>Test Content: {testProp}</div>
                <div>User: {user?.email}</div>
            </div>
        );

        const WrappedComponent = withAuth(TestComponent);

        render(<WrappedComponent testProp='test-value' />);

        await waitFor(() => {
            expect(screen.getByText('Test Content: test-value')).toBeInTheDocument();
            expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        });
    });

    it('renders component with null user when not authenticated', async () => {
        // Appwrite throws an error when user is not authenticated
        mockAccountGet.mockRejectedValue(new Error('User not authenticated'));

        const TestComponent = ({ user }: TestComponentProps) => (
            <div>User: {user ? user.email : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent);

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(screen.getByText('User: Not logged in')).toBeInTheDocument();
        });
    });

    it('redirects to dashboard when redirectIfAuthenticated is true and user is authenticated', async () => {
        const mockUser = createMockUser();
        mockAccountGet.mockResolvedValue(mockUser);

        const TestComponent = ({ user }: TestComponentProps) => <div>User: {user?.email}</div>;

        const WrappedComponent = withAuth(TestComponent, { redirectIfAuthenticated: true });

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('does not redirect when redirectIfAuthenticated is true but user is not authenticated', async () => {
        mockAccountGet.mockRejectedValue(new Error('Not authenticated'));

        const TestComponent = ({ user }: TestComponentProps) => (
            <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent, { redirectIfAuthenticated: true });

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(screen.getByText('User: Not logged in')).toBeInTheDocument();
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('sets displayName for debugging', () => {
        const TestComponent = () => <div>Test</div>;
        TestComponent.displayName = 'TestComponent';

        const WrappedComponent = withAuth(TestComponent);

        expect(WrappedComponent.displayName).toBe('WithAuth(TestComponent)');
    });

    it('sets displayName from component name when displayName is not set', () => {
        function NamedComponent() {
            return <div>Test</div>;
        }

        const WrappedComponent = withAuth(NamedComponent);

        expect(WrappedComponent.displayName).toBe('WithAuth(NamedComponent)');
    });

    it('handles component unmounting during async auth check', async () => {
        mockAccountGet.mockImplementation(
            () => new Promise(resolve => setTimeout(() => resolve(createMockUser()), 100)),
        );

        const TestComponent = ({ user }: TestComponentProps) => (
            <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent);

        const { unmount } = render(<WrappedComponent />);

        // Unmount before auth check completes
        unmount();

        // Wait for the promise to resolve
        await new Promise(resolve => setTimeout(resolve, 150));

        // Should not throw errors about state updates on unmounted component
        expect(mockAccountGet).toHaveBeenCalled();
    });
});
