import { upsertProfile, getProfile } from '@/services/profilesService';
import { COLLECTION_IDS } from '@/types/appwrite';

// Hoist mocks
const { mockCreateDocument, mockUpdateDocument, mockGetDocument, mockDatabaseId } = vi.hoisted(
    () => ({
        mockCreateDocument: vi.fn(),
        mockUpdateDocument: vi.fn(),
        mockGetDocument: vi.fn(),
        mockDatabaseId: 'test-database-id',
    }),
);

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        createDocument: mockCreateDocument,
        updateDocument: mockUpdateDocument,
        getDocument: mockGetDocument,
    },
    databaseId: mockDatabaseId,
}));

describe('profilesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('upsertProfile', () => {
        const mockProfileData = {
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: ['hiking', 'camping'],
            skill_summary: { hiking: 'beginner' },
            profile_image_url: 'https://example.com/image.jpg',
            birthdate: '1990-01-01',
            instagram_url: 'https://instagram.com/test',
            facebook_url: 'https://facebook.com/test',
            dating_preferences: 'casual',
        };

        const mockDocument = {
            $id: 'user-123',
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: ['hiking', 'camping'],
            skill_summary: '{"hiking":"beginner"}',
            profile_image_url: 'https://example.com/image.jpg',
            birthdate: '1990-01-01',
            instagram_url: 'https://instagram.com/test',
            facebook_url: 'https://facebook.com/test',
            dating_preferences: 'casual',
        };

        it('updates existing profile successfully', async () => {
            mockUpdateDocument.mockResolvedValue(mockDocument);

            const result = await upsertProfile(mockProfileData);

            expect(mockUpdateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.USERPROFILE,
                'user-123',
                expect.objectContaining({
                    user_id: 'user-123',
                    bio: 'Test bio',
                }),
            );

            expect(result.user_id).toBe('user-123');
            expect(result.bio).toBe('Test bio');
            expect(result.skill_summary).toEqual({ hiking: 'beginner' });
        });

        it('creates new profile when update fails (document does not exist)', async () => {
            mockUpdateDocument.mockRejectedValue(new Error('Document not found'));
            mockCreateDocument.mockResolvedValue(mockDocument);

            const result = await upsertProfile(mockProfileData);

            expect(mockUpdateDocument).toHaveBeenCalled();
            expect(mockCreateDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.USERPROFILE,
                'user-123',
                expect.objectContaining({
                    user_id: 'user-123',
                }),
            );

            expect(result.user_id).toBe('user-123');
        });

        it('handles null/undefined optional fields', async () => {
            const minimalData = { user_id: 'user-123' };
            const minimalDocument = {
                $id: 'user-123',
                user_id: 'user-123',
                bio: null,
                adventure_preferences: null,
                skill_summary: null,
                profile_image_url: null,
                birthdate: null,
                instagram_url: null,
                facebook_url: null,
                dating_preferences: null,
            };

            mockUpdateDocument.mockResolvedValue(minimalDocument);

            const result = await upsertProfile(minimalData);

            expect(result.bio).toBeNull();
            expect(result.skill_summary).toBeNull();
        });

        it('throws error when both update and create fail', async () => {
            mockUpdateDocument.mockRejectedValue(new Error('Update failed'));
            mockCreateDocument.mockRejectedValue(new Error('Create failed'));

            await expect(upsertProfile(mockProfileData)).rejects.toThrow('Create failed');
        });
    });

    describe('getProfile', () => {
        const mockDocument = {
            $id: 'user-123',
            user_id: 'user-123',
            bio: 'Test bio',
            adventure_preferences: ['hiking'],
            skill_summary: '{"hiking":"beginner"}',
            profile_image_url: null,
            birthdate: '1990-01-01',
            instagram_url: null,
            facebook_url: null,
            dating_preferences: null,
        };

        it('returns profile when found', async () => {
            mockGetDocument.mockResolvedValue(mockDocument);

            const result = await getProfile('user-123');

            expect(mockGetDocument).toHaveBeenCalledWith(
                mockDatabaseId,
                COLLECTION_IDS.USERPROFILE,
                'user-123',
            );

            expect(result).toEqual({
                user_id: 'user-123',
                bio: 'Test bio',
                adventure_preferences: ['hiking'],
                skill_summary: { hiking: 'beginner' },
                profile_image_url: null,
                birthdate: '1990-01-01',
                instagram_url: null,
                facebook_url: null,
                dating_preferences: null,
            });
        });

        it('returns null when profile is not found', async () => {
            mockGetDocument.mockRejectedValue(new Error('Document not found'));

            const result = await getProfile('nonexistent-user');

            expect(result).toBeNull();
        });

        it('returns null on any error', async () => {
            mockGetDocument.mockRejectedValue(new Error('Network error'));

            const result = await getProfile('user-123');

            expect(result).toBeNull();
        });
    });
});
