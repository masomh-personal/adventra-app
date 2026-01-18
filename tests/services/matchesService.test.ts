import { createMatch, getUserMatches } from '@/services/matchesService';
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
        equal: vi.fn((field: string, value: string) => `${field}=${value}`),
    },
    ID: {
        unique: vi.fn(() => 'generated-id'),
    },
}));

describe('matchesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createMatch', () => {
        const mockMatchData = {
            user_id: 'user-1',
            matched_user_id: 'user-2',
            status: 'pending',
        };

        const mockDocument = {
            $id: 'match-123',
            user_id: 'user-1',
            matched_user_id: 'user-2',
            status: 'pending',
            created_at: '2024-01-01T00:00:00.000Z',
        };

        it('creates a match successfully', async () => {
            mockCreateDocument.mockResolvedValue(mockDocument);

            const result = await createMatch(mockMatchData);

            expect(mockCreateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.MATCHES,
                'generated-id',
                expect.objectContaining({
                    user_id: 'user-1',
                    matched_user_id: 'user-2',
                    status: 'pending',
                }),
            );

            expect(result).toEqual({
                user_id: 'user-1',
                matched_user_id: 'user-2',
                status: 'pending',
                created_at: '2024-01-01T00:00:00.000Z',
            });
        });

        it('sets default status to null when not provided', async () => {
            const dataWithoutStatus = {
                user_id: 'user-1',
                matched_user_id: 'user-2',
            };

            const documentWithNullStatus = {
                ...mockDocument,
                status: null,
            };

            mockCreateDocument.mockResolvedValue(documentWithNullStatus);

            const result = await createMatch(dataWithoutStatus);

            expect(mockCreateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.MATCHES,
                'generated-id',
                expect.objectContaining({
                    status: null,
                }),
            );

            expect(result.status).toBeNull();
        });

        it('throws error when createDocument fails', async () => {
            mockCreateDocument.mockRejectedValue(new Error('Database error'));

            await expect(createMatch(mockMatchData)).rejects.toThrow('Database error');
        });

        it('handles non-Error object in catch block', async () => {
            mockCreateDocument.mockRejectedValue('String error');

            await expect(createMatch(mockMatchData)).rejects.toThrow('String error');
        });

        it('handles null/undefined values in returned document', async () => {
            const documentWithNulls = {
                $id: 'match-123',
                user_id: 'user-1',
                matched_user_id: 'user-2',
                status: undefined,
                created_at: undefined,
            };

            mockCreateDocument.mockResolvedValue(documentWithNulls);

            const result = await createMatch(mockMatchData);

            expect(result.status).toBeNull();
            expect(result.created_at).toBeNull();
        });
    });

    describe('getUserMatches', () => {
        const mockDocuments = [
            {
                $id: 'match-1',
                user_id: 'user-1',
                matched_user_id: 'user-2',
                status: 'accepted',
                created_at: '2024-01-01T00:00:00.000Z',
            },
            {
                $id: 'match-2',
                user_id: 'user-1',
                matched_user_id: 'user-3',
                status: 'pending',
                created_at: '2024-01-02T00:00:00.000Z',
            },
        ];

        it('returns all matches for a user', async () => {
            mockListDocuments.mockResolvedValue({
                documents: mockDocuments,
                total: 2,
            });

            const result = await getUserMatches('user-1');

            expect(mockListDocuments).toHaveBeenCalledWith(mockDatabaseId, COLLECTION_IDS.MATCHES, [
                'user_id=user-1',
            ]);

            expect(result).toHaveLength(2);
            expect(result[0].matched_user_id).toBe('user-2');
            expect(result[1].matched_user_id).toBe('user-3');
        });

        it('returns empty array when no matches found', async () => {
            mockListDocuments.mockResolvedValue({
                documents: [],
                total: 0,
            });

            const result = await getUserMatches('user-no-matches');

            expect(result).toEqual([]);
        });

        it('throws error when listDocuments fails', async () => {
            mockListDocuments.mockRejectedValue(new Error('Network error'));

            await expect(getUserMatches('user-1')).rejects.toThrow('Network error');
        });

        it('handles non-Error object in catch block', async () => {
            mockListDocuments.mockRejectedValue('String error');

            await expect(getUserMatches('user-1')).rejects.toThrow('String error');
        });

        it('handles null/undefined values in returned documents', async () => {
            const documentsWithNulls = [
                {
                    $id: 'match-1',
                    user_id: 'user-1',
                    matched_user_id: 'user-2',
                    status: undefined,
                    created_at: undefined,
                },
            ];

            mockListDocuments.mockResolvedValue({
                documents: documentsWithNulls,
                total: 1,
            });

            const result = await getUserMatches('user-1');

            expect(result[0].status).toBeNull();
            expect(result[0].created_at).toBeNull();
        });
    });
});
