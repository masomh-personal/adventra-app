import { sendMessage, getConversation } from './mesagesService';
import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';

vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: vi.fn(),
        listDocuments: vi.fn(),
    },
    databaseId: 'test-db',
}));

vi.mock('appwrite', async () => {
    const actual = await vi.importActual('appwrite');
    return {
        ...actual,
        ID: {
            unique: vi.fn(() => 'unique-id-123'),
        },
    };
});

describe('mesagesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('sendMessage', () => {
        test('sends message successfully', async () => {
            const mockDocument = {
                message_id: 'msg-123',
                sender_id: 'user-1',
                receiver_id: 'user-2',
                content: 'Hello',
                conversation_id: 'conv-123',
                created_at: '2024-01-01T00:00:00Z',
            };

            vi.mocked(databases.createDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
            );

            const result = await sendMessage({
                sender_id: 'user-1',
                receiver_id: 'user-2',
                content: 'Hello',
                conversation_id: 'conv-123',
            });

            expect(result.message_id).toBe('msg-123');
            expect(result.content).toBe('Hello');
        });

        test('generates unique ID when message_id not provided', async () => {
            const mockDocument = {
                message_id: 'unique-id-123',
                sender_id: 'user-1',
                receiver_id: 'user-2',
                content: 'Hello',
            };

            vi.mocked(databases.createDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
            );

            await sendMessage({
                sender_id: 'user-1',
                receiver_id: 'user-2',
                content: 'Hello',
            });

            expect(databases.createDocument).toHaveBeenCalledWith(
                databaseId,
                COLLECTION_IDS.MESSAGES,
                'unique-id-123',
                expect.objectContaining({
                    message_id: 'unique-id-123',
                }),
            );
        });

        test('throws error on failure', async () => {
            vi.mocked(databases.createDocument).mockRejectedValue(new Error('Database error'));

            await expect(
                sendMessage({
                    sender_id: 'user-1',
                    receiver_id: 'user-2',
                    content: 'Hello',
                }),
            ).rejects.toThrow('Database error');
        });
    });

    describe('getConversation', () => {
        test('returns filtered conversation between two users', async () => {
            const mockDocuments = [
                {
                    $id: 'msg-1',
                    message_id: 'msg-1',
                    sender_id: 'user-1',
                    receiver_id: 'user-2',
                    content: 'Hello',
                    created_at: '2024-01-01T00:00:00Z',
                },
                {
                    $id: 'msg-2',
                    message_id: 'msg-2',
                    sender_id: 'user-2',
                    receiver_id: 'user-1',
                    content: 'Hi',
                    created_at: '2024-01-01T01:00:00Z',
                },
            ];

            vi.mocked(databases.listDocuments).mockResolvedValue({
                documents: mockDocuments,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

            const result = await getConversation('user-1', 'user-2');

            expect(result).toHaveLength(2);
            expect(result[0].sender_id).toBe('user-1');
            expect(result[1].sender_id).toBe('user-2');
        });

        test('filters out messages not between specified users', async () => {
            const mockDocuments = [
                {
                    $id: 'msg-1',
                    message_id: 'msg-1',
                    sender_id: 'user-1',
                    receiver_id: 'user-2',
                    content: 'Hello',
                },
                {
                    $id: 'msg-3',
                    message_id: 'msg-3',
                    sender_id: 'user-1',
                    receiver_id: 'user-3', // Different user
                    content: 'Other',
                },
            ];

            vi.mocked(databases.listDocuments).mockResolvedValue({
                documents: mockDocuments,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

            const result = await getConversation('user-1', 'user-2');

            expect(result).toHaveLength(1);
            expect(result[0].receiver_id).toBe('user-2');
        });

        test('throws error on failure', async () => {
            vi.mocked(databases.listDocuments).mockRejectedValue(new Error('Database error'));

            await expect(getConversation('user-1', 'user-2')).rejects.toThrow('Database error');
        });
    });
});
