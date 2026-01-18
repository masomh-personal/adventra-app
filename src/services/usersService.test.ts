import { createUser, getUserById } from './usersService';
import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';

vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: vi.fn(),
        getDocument: vi.fn(),
    },
    databaseId: 'test-db',
}));

describe('usersService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createUser', () => {
        test('creates user successfully', async () => {
            const mockDocument = {
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
            };

            vi.mocked(databases.createDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
            );

            const result = await createUser({
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
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

            expect(result).toEqual({
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
            });
        });

        test('throws error on failure', async () => {
            const error = new Error('Database error');
            vi.mocked(databases.createDocument).mockRejectedValue(error);

            await expect(
                createUser({
                    user_id: 'user-123',
                    name: 'John Doe',
                    email: 'john@example.com',
                }),
            ).rejects.toThrow('Database error');
        });
    });

    describe('getUserById', () => {
        test('returns user when found', async () => {
            const mockDocument = {
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
            };

            vi.mocked(databases.getDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.getDocument>>,
            );

            const result = await getUserById('user-123');

            expect(databases.getDocument).toHaveBeenCalledWith(
                databaseId,
                COLLECTION_IDS.USER,
                'user-123',
            );
            expect(result).toEqual({
                user_id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
            });
        });

        test('returns null when user not found', async () => {
            vi.mocked(databases.getDocument).mockRejectedValue(new Error('Not found'));

            const result = await getUserById('user-123');

            expect(result).toBeNull();
        });
    });
});
