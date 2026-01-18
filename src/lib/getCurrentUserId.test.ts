import { getCurrentUserId } from './getCurrentUserId';
import { account } from './appwriteClient';

vi.mock('./appwriteClient', () => ({
    account: {
        get: vi.fn(),
    },
}));

describe('getCurrentUserId', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('returns user ID when authenticated', async () => {
        const mockUserId = 'user-123';
        vi.mocked(account.get).mockResolvedValue({
            $id: mockUserId,
        } as unknown as Awaited<ReturnType<typeof account.get>>);

        const result = await getCurrentUserId();
        expect(result).toBe(mockUserId);
    });

    test('returns null when user is not authenticated', async () => {
        vi.mocked(account.get).mockRejectedValue(new Error('Not authenticated'));

        const result = await getCurrentUserId();
        expect(result).toBeNull();
    });

    test('returns null when user object has no $id', async () => {
        vi.mocked(account.get).mockResolvedValue(
            {} as unknown as Awaited<ReturnType<typeof account.get>>,
        );

        const result = await getCurrentUserId();
        expect(result).toBeNull();
    });
});
