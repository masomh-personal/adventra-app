import { upsertProfile, getProfile } from './profilesService';
import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';

vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: vi.fn(),
        updateDocument: vi.fn(),
        getDocument: vi.fn(),
    },
    databaseId: 'test-db',
}));

describe('profilesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('upsertProfile', () => {
        test('updates existing profile', async () => {
            const mockDocument = {
                user_id: 'user-123',
                bio: 'Test bio',
                adventure_preferences: ['hiking'],
                skill_summary: JSON.stringify({ beginner: 'novice' }),
            };

            vi.mocked(databases.updateDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.updateDocument>>,
            );

            const result = await upsertProfile({
                user_id: 'user-123',
                bio: 'Test bio',
                adventure_preferences: ['hiking'],
                skill_summary: { beginner: 'novice' },
            });

            expect(databases.updateDocument).toHaveBeenCalled();
            expect(result.user_id).toBe('user-123');
            expect(result.bio).toBe('Test bio');
        });

        test('creates profile when update fails', async () => {
            const mockDocument = {
                user_id: 'user-123',
                bio: 'New bio',
            };

            vi.mocked(databases.updateDocument).mockRejectedValue(new Error('Not found'));
            vi.mocked(databases.createDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.createDocument>>,
            );

            const result = await upsertProfile({
                user_id: 'user-123',
                bio: 'New bio',
            });

            expect(databases.createDocument).toHaveBeenCalled();
            expect(result.user_id).toBe('user-123');
        });

        test('handles null values correctly', async () => {
            const mockDocument = {
                user_id: 'user-123',
                bio: null,
            };

            vi.mocked(databases.updateDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.updateDocument>>,
            );

            const result = await upsertProfile({
                user_id: 'user-123',
            });

            expect(result.bio).toBeNull();
        });

        test('throws error on failure', async () => {
            vi.mocked(databases.updateDocument).mockRejectedValue(new Error('Update failed'));
            vi.mocked(databases.createDocument).mockRejectedValue(new Error('Create failed'));

            await expect(
                upsertProfile({
                    user_id: 'user-123',
                }),
            ).rejects.toThrow('Create failed');
        });
    });

    describe('getProfile', () => {
        test('returns profile when found', async () => {
            const mockDocument = {
                user_id: 'user-123',
                bio: 'Test bio',
            };

            vi.mocked(databases.getDocument).mockResolvedValue(
                mockDocument as unknown as Awaited<ReturnType<typeof databases.getDocument>>,
            );

            const result = await getProfile('user-123');

            expect(databases.getDocument).toHaveBeenCalledWith(
                databaseId,
                COLLECTION_IDS.USERPROFILE,
                'user-123',
            );
            expect(result?.user_id).toBe('user-123');
        });

        test('returns null when profile not found', async () => {
            vi.mocked(databases.getDocument).mockRejectedValue(new Error('Not found'));

            const result = await getProfile('user-123');

            expect(result).toBeNull();
        });
    });
});
