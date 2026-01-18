import { dbCreateUser } from './dbCreateUser';
import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';

vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: vi.fn(),
        updateDocument: vi.fn(),
    },
    databaseId: 'test-db',
}));

describe('dbCreateUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Suppress console.error for these tests
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('creates user and profile successfully', async () => {
        vi.mocked(databases.createDocument).mockResolvedValue(
            {} as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
        );
        vi.mocked(databases.updateDocument).mockResolvedValue(
            {} as unknown as Awaited<ReturnType<typeof databases.updateDocument>>,
        );

        const result = await dbCreateUser({
            user_id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
            birthdate: '1990-01-01',
        });

        expect(databases.createDocument).toHaveBeenCalledWith(
            databaseId,
            COLLECTION_IDS.USER,
            'user-123',
            {
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
            },
        );

        expect(databases.updateDocument).toHaveBeenCalledWith(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            {
                user_id: 'user-123',
                birthdate: '1990-01-01',
            },
        );

        expect(result).toEqual({
            user_id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
        });
    });

    test('creates profile when update fails', async () => {
        vi.mocked(databases.createDocument).mockResolvedValue(
            {} as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
        );
        vi.mocked(databases.updateDocument).mockRejectedValue(new Error('Not found'));

        await dbCreateUser({
            user_id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
        });

        expect(databases.createDocument).toHaveBeenCalledTimes(2);
        expect(databases.createDocument).toHaveBeenLastCalledWith(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            expect.objectContaining({
                user_id: 'user-123',
                birthdate: null,
            }),
        );
    });

    test('handles optional birthdate', async () => {
        vi.mocked(databases.createDocument).mockResolvedValue(
            {} as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
        );
        vi.mocked(databases.updateDocument).mockResolvedValue(
            {} as unknown as Awaited<ReturnType<typeof databases.updateDocument>>,
        );

        await dbCreateUser({
            user_id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
        });

        expect(databases.updateDocument).toHaveBeenCalledWith(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
            expect.objectContaining({
                birthdate: null,
            }),
        );
    });

    test('throws error on failure', async () => {
        vi.mocked(databases.createDocument).mockRejectedValue(new Error('Database error'));

        await expect(
            dbCreateUser({
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
            }),
        ).rejects.toThrow('Failed to create user in database');
    });
});
