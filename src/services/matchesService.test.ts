import { createMatch, getUserMatches } from './matchesService';
import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import { Query } from 'appwrite';

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

describe('matchesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createMatch', () => {
        test('creates match successfully', async () => {
            const mockDocument = {
                user_id: 'user-1',
                matched_user_id: 'user-2',
                status: 'pending',
                created_at: '2024-01-01T00:00:00Z',
            };

            vi.mocked(databases.createDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
            );

            const result = await createMatch({
                user_id: 'user-1',
                matched_user_id: 'user-2',
                status: 'pending',
            });

            expect(databases.createDocument).toHaveBeenCalledWith(
                databaseId,
                COLLECTION_IDS.MATCHES,
                'unique-id-123',
                expect.objectContaining({
                    user_id: 'user-1',
                    matched_user_id: 'user-2',
                    status: 'pending',
                }),
            );

            expect(result.user_id).toBe('user-1');
            expect(result.matched_user_id).toBe('user-2');
        });

        test('uses default values when optional fields not provided', async () => {
            const mockDocument = {
                user_id: 'user-1',
                matched_user_id: 'user-2',
                status: null,
                created_at: '2024-01-01T00:00:00Z',
            };

            vi.mocked(databases.createDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
            );

            await createMatch({
                user_id: 'user-1',
                matched_user_id: 'user-2',
            });

            expect(databases.createDocument).toHaveBeenCalledWith(
                databaseId,
                COLLECTION_IDS.MATCHES,
                'unique-id-123',
                expect.objectContaining({
                    status: null,
                }),
            );
        });

        test('throws error on failure', async () => {
            vi.mocked(databases.createDocument).mockRejectedValue(new Error('Database error'));

            await expect(
                createMatch({
                    user_id: 'user-1',
                    matched_user_id: 'user-2',
                }),
            ).rejects.toThrow('Database error');
        });
    });

    describe('getUserMatches', () => {
        test('returns list of matches', async () => {
            const mockDocuments = [
                {
                    user_id: 'user-1',
                    matched_user_id: 'user-2',
                    status: 'pending',
                    created_at: '2024-01-01T00:00:00Z',
                },
            ];

            vi.mocked(databases.listDocuments).mockResolvedValue({
                documents: mockDocuments,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

            const result = await getUserMatches('user-1');

            expect(databases.listDocuments).toHaveBeenCalledWith(
                databaseId,
                COLLECTION_IDS.MATCHES,
                [Query.equal('user_id', 'user-1')],
            );

            expect(result).toHaveLength(1);
            expect(result[0].user_id).toBe('user-1');
            expect(result[0].matched_user_id).toBe('user-2');
        });

        test('returns empty array when no matches', async () => {
            vi.mocked(databases.listDocuments).mockResolvedValue({
                documents: [],
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

            const result = await getUserMatches('user-1');

            expect(result).toEqual([]);
        });

        test('throws error on failure', async () => {
            vi.mocked(databases.listDocuments).mockRejectedValue(new Error('Database error'));

            await expect(getUserMatches('user-1')).rejects.toThrow('Database error');
        });
    });
});
