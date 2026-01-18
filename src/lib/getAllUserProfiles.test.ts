import { getAllUserProfiles } from './getAllUserProfiles';
import { databases } from './appwriteClient';

vi.mock('./appwriteClient', () => ({
    databases: {
        listDocuments: vi.fn(),
    },
    databaseId: 'test-db',
}));

describe('getAllUserProfiles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('returns empty array when no profiles', async () => {
        vi.mocked(databases.listDocuments).mockResolvedValue({
            documents: [],
        } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
    });

    test('returns profiles with matched user data', async () => {
        const mockProfiles = [
            {
                user_id: 'user-1',
                bio: 'Bio 1',
                birthdate: '1990-01-01',
            },
        ];

        const mockUsers = [
            {
                user_id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com',
            },
        ];

        vi.mocked(databases.listDocuments)
            .mockResolvedValueOnce({
                documents: mockProfiles,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>)
            .mockResolvedValueOnce({
                documents: mockUsers,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].user_id).toBe('user-1');
        expect(result[0].user?.name).toBe('John Doe');
    });

    test('handles profiles without matching user data', async () => {
        const mockProfiles = [
            {
                user_id: 'user-1',
                bio: 'Bio 1',
            },
        ];

        vi.mocked(databases.listDocuments)
            .mockResolvedValueOnce({
                documents: mockProfiles,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>)
            .mockResolvedValueOnce({
                documents: [],
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].user).toBeNull();
    });

    test('handles null values in profile fields', async () => {
        const mockProfiles = [
            {
                user_id: 'user-1',
                bio: null,
                adventure_preferences: null,
                skill_summary: null,
            },
        ];

        const mockUsers = [
            {
                user_id: 'user-1',
                name: 'John Doe',
                email: 'john@example.com',
            },
        ];

        vi.mocked(databases.listDocuments)
            .mockResolvedValueOnce({
                documents: mockProfiles,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>)
            .mockResolvedValueOnce({
                documents: mockUsers,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].bio).toBeNull();
        expect(result[0].adventure_preferences).toBeNull();
        expect(result[0].skill_summary).toBeNull();
    });

    test('handles skill_summary JSON parsing', async () => {
        const mockProfiles = [
            {
                user_id: 'user-1',
                skill_summary: JSON.stringify({ beginner: 'novice' }),
            },
        ];

        vi.mocked(databases.listDocuments)
            .mockResolvedValueOnce({
                documents: mockProfiles,
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>)
            .mockResolvedValueOnce({
                documents: [],
            } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

        const result = await getAllUserProfiles();

        expect(result).toHaveLength(1);
        expect(result[0].skill_summary).toEqual({ beginner: 'novice' });
    });

    test('returns empty array on error', async () => {
        vi.mocked(databases.listDocuments).mockRejectedValue(new Error('Database error'));

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
    });

    test('handles null documents array', async () => {
        vi.mocked(databases.listDocuments).mockResolvedValue({
            documents: null as unknown as [],
        } as unknown as Awaited<ReturnType<typeof databases.listDocuments>>);

        const result = await getAllUserProfiles();

        expect(result).toEqual([]);
    });
});
