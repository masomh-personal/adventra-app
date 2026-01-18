import { createUser, getUserById } from '@/services/usersService';
import { COLLECTION_IDS } from '@/types/appwrite';

// Hoist mocks
const { mockCreateDocument, mockGetDocument, mockDatabaseId } = vi.hoisted(() => ({
    mockCreateDocument: vi.fn(),
    mockGetDocument: vi.fn(),
    mockDatabaseId: 'test-database-id',
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: mockCreateDocument,
        getDocument: mockGetDocument,
    },
    databaseId: mockDatabaseId,
}));

describe('usersService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createUser', () => {
        const mockUserData = {
            user_id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
        };

        const mockDocument = {
            $id: 'user-123',
            $createdAt: '2024-01-01T00:00:00.000Z',
            $updatedAt: '2024-01-01T00:00:00.000Z',
            user_id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
        };

        it('creates a user successfully', async () => {
            mockCreateDocument.mockResolvedValue(mockDocument);

            const result = await createUser(mockUserData);

            expect(mockCreateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.USER,
                mockUserData.user_id,
                {
                    user_id: mockUserData.user_id,
                    name: mockUserData.name,
                    email: mockUserData.email,
                },
            );

            expect(result).toEqual({
                user_id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
            });
        });

        it('throws error when createDocument fails', async () => {
            mockCreateDocument.mockRejectedValue(new Error('Database error'));

            await expect(createUser(mockUserData)).rejects.toThrow('Database error');
        });

        it('handles non-Error objects in catch block', async () => {
            mockCreateDocument.mockRejectedValue('String error');

            await expect(createUser(mockUserData)).rejects.toThrow('String error');
        });
    });

    describe('getUserById', () => {
        const mockDocument = {
            $id: 'user-123',
            user_id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
        };

        it('returns user when found', async () => {
            mockGetDocument.mockResolvedValue(mockDocument);

            const result = await getUserById('user-123');

            expect(mockGetDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.USER,
                'user-123',
            );

            expect(result).toEqual({
                user_id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
            });
        });

        it('returns null when user is not found', async () => {
            mockGetDocument.mockRejectedValue(new Error('Document not found'));

            const result = await getUserById('nonexistent-user');

            expect(result).toBeNull();
        });

        it('returns null on any error', async () => {
            mockGetDocument.mockRejectedValue(new Error('Network error'));

            const result = await getUserById('user-123');

            expect(result).toBeNull();
        });
    });
});
