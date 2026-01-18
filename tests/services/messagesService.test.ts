import { sendMessage, getConversation } from '@/services/mesagesService';
import { COLLECTION_IDS } from '@/types/appwrite';

// Hoist mocks
const { mockCreateDocument, mockListDocuments, mockDatabaseId } = vi.hoisted(() => ({
    mockCreateDocument: vi.fn(),
    mockListDocuments: vi.fn(),
    mockDatabaseId: 'test-database-id',
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: mockCreateDocument,
        listDocuments: mockListDocuments,
    },
    databaseId: mockDatabaseId,
}));

// Mock Appwrite Query and ID
vi.mock('appwrite', () => ({
    Query: {
        equal: vi.fn((field: string, value: string) => ({ field, value, type: 'equal' })),
        or: vi.fn((queries: unknown[]) => ({ queries, type: 'or' })),
        orderAsc: vi.fn((field: string) => ({ field, type: 'orderAsc' })),
    },
    ID: {
        unique: vi.fn(() => 'generated-message-id'),
    },
}));

describe('messagesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('sendMessage', () => {
        const mockMessageData = {
            sender_id: 'user-1',
            receiver_id: 'user-2',
            content: 'Hello there!',
        };

        const mockDocument = {
            $id: 'msg-123',
            message_id: 'msg-123',
            sender_id: 'user-1',
            receiver_id: 'user-2',
            content: 'Hello there!',
            conversation_id: null,
            created_at: '2024-01-01T00:00:00.000Z',
        };

        it('sends a message successfully', async () => {
            mockCreateDocument.mockResolvedValue(mockDocument);

            const result = await sendMessage(mockMessageData);

            expect(mockCreateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.MESSAGES,
                'generated-message-id',
                expect.objectContaining({
                    sender_id: 'user-1',
                    receiver_id: 'user-2',
                    content: 'Hello there!',
                }),
            );

            expect(result).toEqual({
                message_id: 'msg-123',
                sender_id: 'user-1',
                receiver_id: 'user-2',
                content: 'Hello there!',
                conversation_id: null,
                created_at: '2024-01-01T00:00:00.000Z',
            });
        });

        it('uses provided message_id when supplied', async () => {
            const dataWithId = {
                ...mockMessageData,
                message_id: 'custom-msg-id',
            };

            const documentWithCustomId = {
                ...mockDocument,
                message_id: 'custom-msg-id',
            };

            mockCreateDocument.mockResolvedValue(documentWithCustomId);

            await sendMessage(dataWithId);

            expect(mockCreateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.MESSAGES,
                'custom-msg-id',
                expect.objectContaining({
                    message_id: 'custom-msg-id',
                }),
            );
        });

        it('includes conversation_id when provided', async () => {
            const dataWithConversation = {
                ...mockMessageData,
                conversation_id: 'conv-123',
            };

            const documentWithConversation = {
                ...mockDocument,
                conversation_id: 'conv-123',
            };

            mockCreateDocument.mockResolvedValue(documentWithConversation);

            const result = await sendMessage(dataWithConversation);

            expect(result.conversation_id).toBe('conv-123');
        });

        it('throws error when createDocument fails', async () => {
            mockCreateDocument.mockRejectedValue(new Error('Database error'));

            await expect(sendMessage(mockMessageData)).rejects.toThrow('Database error');
        });
    });

    describe('getConversation', () => {
        const mockDocuments = [
            {
                $id: 'msg-1',
                message_id: 'msg-1',
                sender_id: 'user-1',
                receiver_id: 'user-2',
                content: 'Hello',
                conversation_id: null,
                created_at: '2024-01-01T00:00:00.000Z',
            },
            {
                $id: 'msg-2',
                message_id: 'msg-2',
                sender_id: 'user-2',
                receiver_id: 'user-1',
                content: 'Hi there!',
                conversation_id: null,
                created_at: '2024-01-01T00:01:00.000Z',
            },
            {
                // Message from user-1 to user-3 (should be filtered out)
                $id: 'msg-3',
                message_id: 'msg-3',
                sender_id: 'user-1',
                receiver_id: 'user-3',
                content: 'Different conversation',
                conversation_id: null,
                created_at: '2024-01-01T00:02:00.000Z',
            },
        ];

        it('returns messages between two users', async () => {
            mockListDocuments.mockResolvedValue({
                documents: mockDocuments,
                total: 3,
            });

            const result = await getConversation('user-1', 'user-2');

            // Should filter out message to user-3
            expect(result).toHaveLength(2);
            expect(result[0].content).toBe('Hello');
            expect(result[1].content).toBe('Hi there!');
        });

        it('returns empty array when no messages exist', async () => {
            mockListDocuments.mockResolvedValue({
                documents: [],
                total: 0,
            });

            const result = await getConversation('user-1', 'user-2');

            expect(result).toEqual([]);
        });

        it('uses $id as message_id fallback when message_id is missing', async () => {
            const documentsWithoutMessageId = [
                {
                    $id: 'doc-id-1',
                    sender_id: 'user-1',
                    receiver_id: 'user-2',
                    content: 'Test',
                    created_at: '2024-01-01T00:00:00.000Z',
                },
            ];

            mockListDocuments.mockResolvedValue({
                documents: documentsWithoutMessageId,
                total: 1,
            });

            const result = await getConversation('user-1', 'user-2');

            expect(result[0].message_id).toBe('doc-id-1');
        });

        it('throws error when listDocuments fails', async () => {
            mockListDocuments.mockRejectedValue(new Error('Network error'));

            await expect(getConversation('user-1', 'user-2')).rejects.toThrow('Network error');
        });
    });
});
