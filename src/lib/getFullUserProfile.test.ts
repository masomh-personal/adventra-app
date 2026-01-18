import { getFullUserProfile } from './getFullUserProfile';
import { databases, databaseId } from './appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';

vi.mock('./appwriteClient', () => ({
    databases: {
        getDocument: vi.fn(),
    },
    databaseId: 'test-db',
}));

describe('getFullUserProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('returns null for null uid', async () => {
        const result = await getFullUserProfile(null);
        expect(result).toBeNull();
    });

    test('returns null for undefined uid', async () => {
        const result = await getFullUserProfile(undefined);
        expect(result).toBeNull();
    });

    test('returns full profile with user data', async () => {
        const mockProfileDoc = {
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: ['hiking'],
            skill_summary: JSON.stringify({ beginner: 'novice' }),
            birthdate: '1990-01-01',
        };

        const mockUserDoc = {
            name: 'John Doe',
            email: 'john@example.com',
        };

        vi.mocked(databases.getDocument)
            .mockResolvedValueOnce(
                mockProfileDoc as unknown as Awaited<ReturnType<typeof databases.getDocument>>,
            )
            .mockResolvedValueOnce(
                mockUserDoc as unknown as Awaited<ReturnType<typeof databases.getDocument>>,
            );

        const result = await getFullUserProfile('user-123');

        expect(databases.getDocument).toHaveBeenCalledWith(
            databaseId,
            COLLECTION_IDS.USERPROFILE,
            'user-123',
        );
        expect(databases.getDocument).toHaveBeenCalledWith(
            databaseId,
            COLLECTION_IDS.USER,
            'user-123',
        );

        expect(result?.user_id).toBe('user-123');
        expect(result?.user?.name).toBe('John Doe');
    });

    test('handles missing user data gracefully', async () => {
        const mockProfileDoc = {
            user_id: 'user-123',
            bio: 'Test bio',
        };

        vi.mocked(databases.getDocument)
            .mockResolvedValueOnce(
                mockProfileDoc as unknown as Awaited<ReturnType<typeof databases.getDocument>>,
            )
            .mockRejectedValueOnce(new Error('User not found'));

        const result = await getFullUserProfile('user-123');

        expect(result?.user_id).toBe('user-123');
        expect(result?.user).toBeNull();
    });

    test('returns null on profile fetch error', async () => {
        vi.mocked(databases.getDocument).mockRejectedValue(new Error('Profile not found'));

        const result = await getFullUserProfile('user-123');

        expect(result).toBeNull();
    });
});
