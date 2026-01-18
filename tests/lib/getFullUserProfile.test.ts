// Hoist mocks
const { mockGetDocument } = vi.hoisted(() => ({
    mockGetDocument: vi.fn(),
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        getDocument: mockGetDocument,
    },
    databaseId: 'test-db',
}));

// Import after mocks
import { getFullUserProfile } from '@/lib/getFullUserProfile';

describe('getFullUserProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns null when uid is null', async () => {
        const result = await getFullUserProfile(null);
        expect(result).toBeNull();
        expect(mockGetDocument).not.toHaveBeenCalled();
    });

    it('returns null when uid is undefined', async () => {
        const result = await getFullUserProfile(undefined);
        expect(result).toBeNull();
        expect(mockGetDocument).not.toHaveBeenCalled();
    });

    it('returns null when uid is empty string', async () => {
        const result = await getFullUserProfile('');
        expect(result).toBeNull();
        expect(mockGetDocument).not.toHaveBeenCalled();
    });

    it('returns full user profile when profile and user found', async () => {
        const mockProfileDoc = {
            $id: 'user-123',
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: ['hiking', 'camping'],
            skill_summary: JSON.stringify({ hiking: 'intermediate' }),
            profile_image_url: 'https://example.com/image.jpg',
            birthdate: '1990-01-01',
            instagram_url: 'https://instagram.com/test',
            facebook_url: 'https://facebook.com/test',
            dating_preferences: 'friends',
        };

        const mockUserDoc = {
            $id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com',
        };

        mockGetDocument.mockImplementation((_dbId, collectionId) => {
            if (collectionId === 'userprofile') {
                return Promise.resolve(mockProfileDoc);
            }
            if (collectionId === 'user') {
                return Promise.resolve(mockUserDoc);
            }
            return Promise.reject(new Error('Not found'));
        });

        const result = await getFullUserProfile('user-123');

        expect(result).toEqual({
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: ['hiking', 'camping'],
            skill_summary: { hiking: 'intermediate' },
            profile_image_url: 'https://example.com/image.jpg',
            birthdate: '1990-01-01',
            instagram_url: 'https://instagram.com/test',
            facebook_url: 'https://facebook.com/test',
            dating_preferences: 'friends',
            user: { name: 'John Doe', email: 'john@example.com' },
            age: expect.any(Number),
        });
    });

    it('returns profile with null user when user not found', async () => {
        const mockProfileDoc = {
            $id: 'user-123',
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: null,
            skill_summary: null,
            profile_image_url: null,
            birthdate: null,
            instagram_url: null,
            facebook_url: null,
            dating_preferences: null,
        };

        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockGetDocument.mockImplementation((_dbId, collectionId) => {
            if (collectionId === 'userprofile') {
                return Promise.resolve(mockProfileDoc);
            }
            return Promise.reject(new Error('User not found'));
        });

        const result = await getFullUserProfile('user-123');

        expect(result).toEqual({
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: null,
            skill_summary: null,
            profile_image_url: null,
            birthdate: null,
            instagram_url: null,
            facebook_url: null,
            dating_preferences: null,
            user: null,
            age: null,
        });

        expect(consoleWarnSpy).toHaveBeenCalledWith('User not found for profile:', 'user-123');
        consoleWarnSpy.mockRestore();
    });

    it('returns null when profile fetch fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        mockGetDocument.mockRejectedValue(new Error('Profile not found'));

        const result = await getFullUserProfile('user-123');

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching full user profile:',
            expect.any(Error),
        );
        consoleErrorSpy.mockRestore();
    });
});
