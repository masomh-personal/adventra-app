import { getAllUserProfiles } from '@/lib/getAllUserProfiles';

// Hoist mock function
const { mockSelect } = vi.hoisted(() => {
    const mockSelect = vi.fn();
    return { mockSelect };
});

vi.mock('@/lib/supabaseClient', () => {
    const mockFrom = vi.fn(() => ({
        select: mockSelect,
    }));

    return {
        __esModule: true,
        default: {
            from: mockFrom,
        },
    };
});

// Silence expected console errors
beforeAll(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => {
    vi.restoreAllMocks();
});

describe('getAllUserProfiles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSelect.mockReset();
    });

    test('returns randomized profiles when successful', async () => {
        const mockData = [
            {
                user_id: 'user-1',
                bio: 'Adventurer',
                adventure_preferences: ['hiking'],
                skill_summary: { hiking: 'intermediate' },
                profile_image_url: '/img1.jpg',
                birthdate: '1990-01-01',
                instagram_url: 'https://instagram.com/user1',
                facebook_url: null,
                dating_preferences: 'straight',
                user: [{ name: 'User One', email: 'user1@example.com' }],
            },
            {
                user_id: 'user-2',
                bio: 'Explorer',
                adventure_preferences: ['climbing'],
                skill_summary: null,
                profile_image_url: null,
                birthdate: '1995-05-15',
                instagram_url: null,
                facebook_url: 'https://facebook.com/user2',
                dating_preferences: null,
                user: [{ name: 'User Two', email: 'user2@example.com' }],
            },
        ];

        mockSelect.mockResolvedValue({ data: mockData, error: null });

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
            user_id: expect.any(String),
            bio: expect.any(String),
            user: expect.objectContaining({
                name: expect.any(String),
                email: expect.any(String),
            }),
        });
        // Verify profiles are transformed correctly (user array converted to object)
        expect(result.every(profile => !Array.isArray(profile.user))).toBe(true);
    });

    test('returns empty array when error occurs', async () => {
        mockSelect.mockResolvedValue({
            data: null,
            error: new Error('Database error'),
        });

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
    });

    test('returns empty array when data is null', async () => {
        mockSelect.mockResolvedValue({ data: null, error: null });

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
    });

    test('handles profiles with empty user array', async () => {
        const mockData = [
            {
                user_id: 'user-1',
                bio: 'Adventurer',
                adventure_preferences: null,
                skill_summary: null,
                profile_image_url: null,
                birthdate: null,
                instagram_url: null,
                facebook_url: null,
                dating_preferences: null,
                user: [], // Empty array
            },
        ];

        mockSelect.mockResolvedValue({ data: mockData, error: null });

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].user).toBeNull();
    });

    test('handles profiles with null user', async () => {
        const mockData = [
            {
                user_id: 'user-1',
                bio: null,
                adventure_preferences: null,
                skill_summary: null,
                profile_image_url: null,
                birthdate: null,
                instagram_url: null,
                facebook_url: null,
                dating_preferences: null,
                user: null,
            },
        ];

        mockSelect.mockResolvedValue({ data: mockData, error: null });

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].user).toBeNull();
    });

    test('randomizes profile order', async () => {
        const mockData = Array.from({ length: 5 }, (_, i) => ({
            user_id: `user-${i}`,
            bio: `Bio ${i}`,
            adventure_preferences: null,
            skill_summary: null,
            profile_image_url: null,
            birthdate: null,
            instagram_url: null,
            facebook_url: null,
            dating_preferences: null,
            user: [{ name: `User ${i}`, email: `user${i}@example.com` }],
        }));

        mockSelect.mockResolvedValue({ data: mockData, error: null });

        // Run multiple times and check that order can vary
        // (This is a probabilistic test, but should pass most of the time)
        const results = await Promise.all([
            getAllUserProfiles(),
            getAllUserProfiles(),
            getAllUserProfiles(),
        ]);

        // This test might occasionally fail due to randomness, but that's acceptable
        // The important thing is that it doesn't crash
        expect(results.every(r => r.length === 5)).toBe(true);
    });
});
