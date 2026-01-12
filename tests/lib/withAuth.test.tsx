import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import type { User } from '@supabase/supabase-js';
import withAuth from '@/lib/withAuth';
import supabase from '@/lib/supabaseClient';

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: vi.fn(),
}));

// Mock Supabase client
vi.mock('@/lib/supabaseClient', () => ({
    default: {
        auth: {
            getSession: vi.fn(),
        },
    },
}));

const mockRouter = {
    push: vi.fn(),
    pathname: '/test',
    query: {},
    asPath: '/test',
};

describe('withAuth HOC', () => {
    const mockGetSession = supabase.auth.getSession as ReturnType<typeof vi.fn>;
    const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseRouter.mockReturnValue(mockRouter);
        mockRouter.push.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('renders loading spinner while checking authentication', async () => {
        // Mock a delayed session check
        mockGetSession.mockImplementation(
            () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                data: { session: null },
                                error: null,
                            }),
                        100,
                    ),
                ),
        );

        const TestComponent = (): React.JSX.Element => <div>Test Content</div>;
        const WrappedComponent = withAuth(TestComponent);

        render(<WrappedComponent />);

        // Should show loading spinner (it's a div with animate-spin class, not role="status")
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    test('renders component when user is authenticated', async () => {
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            aud: 'authenticated',
            app_metadata: {},
            user_metadata: {},
            created_at: '2024-01-01T00:00:00Z',
        } as User;

        mockGetSession.mockResolvedValue({
            data: { session: { user: mockUser, access_token: 'token', expires_in: 3600 } },
            error: null,
        });

        interface TestProps {
            testProp: string;
            user: User | null;
        }

        const TestComponent = ({ testProp, user }: TestProps): React.JSX.Element => (
            <div>
                <div>Test Content: {testProp}</div>
                <div>User: {user?.email}</div>
            </div>
        );

        const WrappedComponent = withAuth(TestComponent);

        render(<WrappedComponent testProp='test-value' user={null} />);

        await waitFor(() => {
            expect(screen.getByText('Test Content: test-value')).toBeInTheDocument();
            expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        });
    });

    test('renders component when user is not authenticated', async () => {
        mockGetSession.mockResolvedValue({
            data: { session: null },
            error: null,
        });

        interface TestProps {
            user: User | null;
        }

        const TestComponent = ({ user }: TestProps): React.JSX.Element => (
            <div>User: {user ? user.email : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent);

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(screen.getByText('User: Not logged in')).toBeInTheDocument();
        });
    });

    test('redirects to dashboard when redirectIfAuthenticated is true and user is authenticated', async () => {
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            aud: 'authenticated',
            app_metadata: {},
            user_metadata: {},
            created_at: '2024-01-01T00:00:00Z',
        } as User;

        mockGetSession.mockResolvedValue({
            data: { session: { user: mockUser, access_token: 'token', expires_in: 3600 } },
            error: null,
        });

        interface TestProps {
            user: User | null;
        }

        const TestComponent = ({ user }: TestProps): React.JSX.Element => (
            <div>User: {user?.email}</div>
        );

        const WrappedComponent = withAuth(TestComponent, { redirectIfAuthenticated: true });

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('handles session retrieval error gracefully', async () => {
        const mockError = new Error('Session error');
        mockGetSession.mockResolvedValue({
            data: { session: null },
            error: mockError,
        });

        interface TestProps {
            user: User | null;
        }

        const TestComponent = ({ user }: TestProps): React.JSX.Element => (
            <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(screen.getByText('User: Not logged in')).toBeInTheDocument();
            expect(consoleSpy).toHaveBeenCalledWith('Session retrieval error:', mockError);
        });

        consoleSpy.mockRestore();
    });

    test('handles unexpected errors gracefully', async () => {
        mockGetSession.mockRejectedValue(new Error('Unexpected error'));

        interface TestProps {
            user: User | null;
        }

        const TestComponent = ({ user }: TestProps): React.JSX.Element => (
            <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(<WrappedComponent />);

        await waitFor(() => {
            expect(screen.getByText('User: Not logged in')).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    test('sets displayName for debugging', () => {
        const TestComponent = (): React.JSX.Element => <div>Test</div>;
        TestComponent.displayName = 'TestComponent';

        const WrappedComponent = withAuth(TestComponent);

        expect(WrappedComponent.displayName).toBe('WithAuth(TestComponent)');
    });

    test('sets displayName from component name when displayName is not set', () => {
        function NamedComponent(): React.JSX.Element {
            return <div>Test</div>;
        }

        const WrappedComponent = withAuth(NamedComponent);

        expect(WrappedComponent.displayName).toBe('WithAuth(NamedComponent)');
    });

    test('handles component unmounting during async auth check', async () => {
        mockGetSession.mockImplementation(
            () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve({
                                data: { session: null },
                                error: null,
                            }),
                        100,
                    ),
                ),
        );

        interface TestProps {
            user: User | null;
        }

        const TestComponent = ({ user }: TestProps): React.JSX.Element => (
            <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        );

        const WrappedComponent = withAuth(TestComponent);

        const { unmount } = render(<WrappedComponent />);

        // Unmount before auth check completes
        unmount();

        // Wait for the promise to resolve
        await new Promise(resolve => setTimeout(resolve, 150));

        // Should not throw errors about state updates on unmounted component
        expect(mockGetSession).toHaveBeenCalled();
    });
});
