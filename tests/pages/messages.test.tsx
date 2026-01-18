import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Hoist mocks
const { mockAccountGet, mockListDocuments, mockGetDocument, mockGetCurrentUserId, mockRouterPush } =
    vi.hoisted(() => ({
        mockAccountGet: vi.fn(),
        mockListDocuments: vi.fn(),
        mockGetDocument: vi.fn(),
        mockGetCurrentUserId: vi.fn(),
        mockRouterPush: vi.fn(),
    }));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        get: mockAccountGet,
    },
    databases: {
        listDocuments: mockListDocuments,
        getDocument: mockGetDocument,
    },
    storage: {},
    databaseId: 'test-db',
}));

// Mock getCurrentUserId
vi.mock('@/lib/getCurrentUserId', () => ({
    getCurrentUserId: mockGetCurrentUserId,
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        replace: vi.fn(),
        pathname: '/messages',
        query: {},
        asPath: '/messages',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));

// Mock Appwrite Query
vi.mock('appwrite', () => ({
    Query: {
        equal: vi.fn((field, value) => ({ field, value, type: 'equal' })),
        orderDesc: vi.fn(field => ({ field, type: 'orderDesc' })),
        orderAsc: vi.fn(field => ({ field, type: 'orderAsc' })),
    },
}));

// Import after mocks
import MessagesPage from '@/pages/messages';

// Mock user
const mockUser = {
    $id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    prefs: {},
};

describe('MessagesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterPush.mockResolvedValue(true);
        mockAccountGet.mockResolvedValue(mockUser);
        mockGetCurrentUserId.mockResolvedValue('user-123');
        // Default: no conversations
        mockListDocuments.mockResolvedValue({ documents: [], total: 0 });
    });

    describe('Empty State', () => {
        it('shows empty state when no conversations', async () => {
            render(<MessagesPage />);

            await waitFor(() => {
                expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument();
            });
        });

        it('shows inbox header', async () => {
            render(<MessagesPage />);

            await waitFor(() => {
                expect(screen.getByText(/inbox/i)).toBeInTheDocument();
            });
        });
    });

    describe('With Conversations', () => {
        const mockConversations = [
            {
                $id: 'conv-1',
                conversation_id: 'conv-1',
                user_1_id: 'user-123',
                user_2_id: 'user-456',
                last_message_timestamp: '2024-01-01T12:00:00.000Z',
            },
        ];

        const mockUserDoc = {
            $id: 'user-456',
            user_id: 'user-456',
            name: 'Jane Smith',
            email: 'jane@example.com',
        };

        beforeEach(() => {
            // First call for user_1 conversations, second for user_2 conversations
            mockListDocuments
                .mockResolvedValueOnce({ documents: mockConversations, total: 1 })
                .mockResolvedValueOnce({ documents: [], total: 0 });

            mockGetDocument.mockImplementation((dbId, collectionId, docId) => {
                if (docId === 'user-123') {
                    return Promise.resolve({
                        $id: 'user-123',
                        name: 'John Doe',
                    });
                }
                if (docId === 'user-456') {
                    return Promise.resolve(mockUserDoc);
                }
                return Promise.reject(new Error('Not found'));
            });
        });

        it('displays conversation list', async () => {
            render(<MessagesPage />);

            await waitFor(() => {
                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            });
        });

        it('shows placeholder when no conversation selected', async () => {
            render(<MessagesPage />);

            await waitFor(() => {
                expect(screen.getByText(/select a conversation/i)).toBeInTheDocument();
            });
        });

        it('fetches messages when conversation is selected', async () => {
            const mockMessages = [
                {
                    $id: 'msg-1',
                    message_id: 'msg-1',
                    sender_id: 'user-123',
                    receiver_id: 'user-456',
                    content: 'Hello!',
                    created_at: '2024-01-01T12:00:00.000Z',
                    conversation_id: 'conv-1',
                },
            ];

            // Reset mock for message fetch
            mockListDocuments.mockReset();
            mockListDocuments
                .mockResolvedValueOnce({ documents: mockConversations, total: 1 })
                .mockResolvedValueOnce({ documents: [], total: 0 })
                .mockResolvedValueOnce({ documents: mockMessages, total: 1 });

            render(<MessagesPage />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Jane Smith'));

            await waitFor(() => {
                expect(screen.getByText('Hello!')).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        it('navigates back to dashboard', async () => {
            render(<MessagesPage />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
            });

            await user.click(screen.getByText(/back to dashboard/i));

            expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    describe('Error Handling', () => {
        it('handles fetch error gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockListDocuments.mockRejectedValue(new Error('Network error'));

            render(<MessagesPage />);

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Error fetching data:',
                    expect.any(Error),
                );
            });

            consoleErrorSpy.mockRestore();
        });

        it('handles message fetch error gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const mockConversations = [
                {
                    $id: 'conv-1',
                    conversation_id: 'conv-1',
                    user_1_id: 'user-123',
                    user_2_id: 'user-456',
                    last_message_timestamp: '2024-01-01T12:00:00.000Z',
                },
            ];

            // First two calls succeed, message fetch fails
            mockListDocuments
                .mockResolvedValueOnce({ documents: mockConversations, total: 1 })
                .mockResolvedValueOnce({ documents: [], total: 0 })
                .mockRejectedValueOnce(new Error('Message fetch failed'));

            mockGetDocument.mockResolvedValue({
                $id: 'user-456',
                name: 'Jane Smith',
            });

            render(<MessagesPage />);
            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Jane Smith'));

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Error fetching messages:',
                    expect.any(Error),
                );
            });

            consoleErrorSpy.mockRestore();
        });
    });
});
