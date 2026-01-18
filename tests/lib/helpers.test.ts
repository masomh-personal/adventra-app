import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';

// Hoist mocks
const { mockAccountGet } = vi.hoisted(() => ({
    mockAccountGet: vi.fn(),
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        get: mockAccountGet,
    },
    databases: {},
    storage: {},
    databaseId: 'test-db',
}));

describe('getCurrentUserId', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns user ID when authenticated', async () => {
        mockAccountGet.mockResolvedValue({
            $id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
        });

        const result = await getCurrentUserId();

        expect(result).toBe('user-123');
        expect(mockAccountGet).toHaveBeenCalled();
    });

    it('returns null when not authenticated', async () => {
        mockAccountGet.mockRejectedValue(new Error('Not authenticated'));

        const result = await getCurrentUserId();

        expect(result).toBeNull();
    });

    it('returns null when user object has no $id', async () => {
        mockAccountGet.mockResolvedValue(null);

        const result = await getCurrentUserId();

        expect(result).toBeNull();
    });
});

describe('calcAgeFromBirthdate', () => {
    // Mock the current date for consistent tests
    const mockNow = new Date('2024-06-15T12:00:00.000Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('calculates age correctly for birthday already passed this year', () => {
        const birthdate = '1990-03-15'; // March 15, 1990
        const age = calcAgeFromBirthdate(birthdate);

        expect(age).toBe(34); // As of June 15, 2024
    });

    it('calculates age correctly for birthday not yet passed this year', () => {
        const birthdate = '1990-12-25'; // December 25, 1990
        const age = calcAgeFromBirthdate(birthdate);

        expect(age).toBe(33); // As of June 15, 2024 (birthday hasn't happened yet)
    });

    it('calculates age correctly for birthday on exact current date', () => {
        const birthdate = '1990-06-15'; // Same day as mock date
        const age = calcAgeFromBirthdate(birthdate);

        expect(age).toBe(34);
    });

    it('handles leap year birthdays', () => {
        const birthdate = '2000-02-29'; // Leap year birthday
        const age = calcAgeFromBirthdate(birthdate);

        expect(age).toBe(24); // As of June 15, 2024
    });

    it('returns 0 for newborn (born this year)', () => {
        const birthdate = '2024-01-01';
        const age = calcAgeFromBirthdate(birthdate);

        expect(age).toBe(0);
    });
});
