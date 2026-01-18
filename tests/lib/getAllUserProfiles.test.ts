import { getAllUserProfiles } from '@/lib/getAllUserProfiles';
import { COLLECTION_IDS } from '@/types/appwrite';

// Hoist mocks
const { mockListDocuments, mockDatabaseId } = vi.hoisted(() => ({
    mockListDocuments: vi.fn(),
    mockDatabaseId: 'test-database-id',
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    databases: {
        listDocuments: mockListDocuments,
    },
    databaseId: mockDatabaseId,
}));

// Mock Math.random for consistent sorting in tests
const originalRandom = Math.random;

describe('getAllUserProfiles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Make sorting deterministic
        Math.random = () => 0.5;
    });

    afterEach(() => {
        Math.random = originalRandom;
    });

    const mockUserProfileDocs = [
        {
            $id: 'profile-1',
            user_id: 'user-1',
            bio: 'I love hiking',
            adventure_preferences: ['hiking', 'camping'],
            skill_summary: '{"hiking":"intermediate"}',
            profile_image_url: 'https://example.com/image1.jpg',
            birthdate: '1990-05-15',
            instagram_url: null,
            facebook_url: null,
            dating_preferences: null,
        },
        {
            $id: 'profile-2',
            user_id: 'user-2',
            bio: 'Adventure seeker',
            adventure_preferences: ['climbing'],
            skill_summary: null,
            profile_image_url: null,
            birthdate: null,
            instagram_url: null,
            facebook_url: null,
            dating_preferences: null,
        },
    ];

    const mockUserDocs = [
        {
            $id: 'user-1',
            user_id: 'user-1',
            name: 'John Doe',
            email: 'john@example.com',
        },
        {
            $id: 'user-2',
            user_id: 'user-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
        },
    ];

    it('fetches and combines user profiles with user data', async () => {
        mockListDocuments
            .mockResolvedValueOnce({ documents: mockUserProfileDocs, total: 2 })
            .mockResolvedValueOnce({ documents: mockUserDocs, total: 2 });

        const result = await getAllUserProfiles();

        expect(mockListDocuments).toHaveBeenCalledWith(mockDatabaseId, COLLECTION_IDS.USERPROFILE);
        expect(mockListDocuments).toHaveBeenCalledWith(mockDatabaseId, COLLECTION_IDS.USER);

        expect(result).toHaveLength(2);
        expect(result[0].user_id).toBeDefined();
        expect(result[0].user).toBeDefined();
    });

    it('returns profiles with correct structure', async () => {
        mockListDocuments
            .mockResolvedValueOnce({ documents: mockUserProfileDocs, total: 2 })
            .mockResolvedValueOnce({ documents: mockUserDocs, total: 2 });

        const result = await getAllUserProfiles();

        const johnProfile = result.find(p => p.user_id === 'user-1');
        expect(johnProfile).toBeDefined();
        expect(johnProfile?.bio).toBe('I love hiking');
        expect(johnProfile?.adventure_preferences).toEqual(['hiking', 'camping']);
        expect(johnProfile?.skill_summary).toEqual({ hiking: 'intermediate' });
        expect(johnProfile?.user?.name).toBe('John Doe');
        expect(johnProfile?.age).toBeDefined();
    });

    it('returns empty array when no profiles exist', async () => {
        mockListDocuments.mockResolvedValueOnce({ documents: [], total: 0 });

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
    });

    it('handles profiles without matching users', async () => {
        const orphanProfile = [
            {
                $id: 'profile-orphan',
                user_id: 'orphan-user',
                bio: 'Orphan bio',
                adventure_preferences: null,
                skill_summary: null,
                profile_image_url: null,
                birthdate: null,
                instagram_url: null,
                facebook_url: null,
                dating_preferences: null,
            },
        ];

        mockListDocuments
            .mockResolvedValueOnce({ documents: orphanProfile, total: 1 })
            .mockResolvedValueOnce({ documents: [], total: 0 });

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].user).toBeNull();
    });

    it('returns empty array and logs error on exception', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockListDocuments.mockRejectedValue(new Error('Network error'));

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching user profiles:',
            expect.any(Error),
        );

        consoleErrorSpy.mockRestore();
    });

    it('parses skill_summary JSON correctly', async () => {
        const profileWithSkills = [
            {
                $id: 'profile-skills',
                user_id: 'user-skills',
                bio: null,
                adventure_preferences: null,
                skill_summary: '{"hiking":"expert","climbing":"beginner"}',
                profile_image_url: null,
                birthdate: null,
                instagram_url: null,
                facebook_url: null,
                dating_preferences: null,
            },
        ];

        mockListDocuments
            .mockResolvedValueOnce({ documents: profileWithSkills, total: 1 })
            .mockResolvedValueOnce({ documents: [], total: 0 });

        const result = await getAllUserProfiles();

        expect(result[0].skill_summary).toEqual({
            hiking: 'expert',
            climbing: 'beginner',
        });
    });
});
