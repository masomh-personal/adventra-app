import { dbCreateUser } from '@/hooks/dbCreateUser';
import { COLLECTION_IDS } from '@/types/appwrite';

// Hoist mocks
const { mockCreateDocument, mockUpdateDocument, mockDatabaseId } = vi.hoisted(() => ({
    mockCreateDocument: vi.fn(),
    mockUpdateDocument: vi.fn(),
    mockDatabaseId: 'test-database-id',
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: mockCreateDocument,
        updateDocument: mockUpdateDocument,
    },
    databaseId: mockDatabaseId,
}));

describe('dbCreateUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockUserData = {
        user_id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
    };

    it('creates user and profile documents successfully', async () => {
        mockCreateDocument.mockResolvedValue({ $id: 'user-123' });
        mockUpdateDocument.mockRejectedValue(new Error('Not found')); // Force create path

        const result = await dbCreateUser(mockUserData);

        // Should create user document
        expect(mockCreateDocument).toHaveBeenCalledWith(
            mockDatabaseId,
            COLLECTION_IDS.USER,
            'user-123',
            {
                user_id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
            },
        );

        // Should attempt to update profile, then create when update fails
        expect(mockUpdateDocument).toHaveBeenCalledWith(
            mockDatabaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            {
                user_id: 'user-123',
                birthdate: null,
            },
        );

        // Should create profile after update fails
        expect(mockCreateDocument).toHaveBeenCalledWith(
            mockDatabaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            {
                user_id: 'user-123',
                birthdate: null,
            },
        );

        expect(result).toEqual({
            user_id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
        });
    });

    it('updates existing profile when it exists', async () => {
        mockCreateDocument.mockResolvedValue({ $id: 'user-123' });
        mockUpdateDocument.mockResolvedValue({ $id: 'user-123' }); // Update succeeds

        await dbCreateUser(mockUserData);

        // Should update existing profile
        expect(mockUpdateDocument).toHaveBeenCalledWith(
            mockDatabaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            expect.objectContaining({
                user_id: 'user-123',
            }),
        );

        // Should NOT call createDocument for profile (only for user)
        expect(mockCreateDocument).toHaveBeenCalledTimes(1);
    });

    it('includes birthdate when provided', async () => {
        mockCreateDocument.mockResolvedValue({ $id: 'user-123' });
        mockUpdateDocument.mockResolvedValue({ $id: 'user-123' });

        const dataWithBirthdate = {
            ...mockUserData,
            birthdate: '1990-01-01',
        };

        await dbCreateUser(dataWithBirthdate);

        expect(mockUpdateDocument).toHaveBeenCalledWith(
            mockDatabaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            {
                user_id: 'user-123',
                birthdate: '1990-01-01',
            },
        );
    });

    it('throws error with generic message when user creation fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockCreateDocument.mockRejectedValue(new Error('Database connection failed'));

        await expect(dbCreateUser(mockUserData)).rejects.toThrow(
            'Failed to create user in database',
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[DB Insert Error] Failed to create user:',
            'Database connection failed',
        );

        consoleErrorSpy.mockRestore();
    });

    it('handles non-Error objects in catch block', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockCreateDocument.mockRejectedValue('String error');

        await expect(dbCreateUser(mockUserData)).rejects.toThrow(
            'Failed to create user in database',
        );

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            '[DB Insert Error] Failed to create user:',
            'String error',
        );

        consoleErrorSpy.mockRestore();
    });
});
