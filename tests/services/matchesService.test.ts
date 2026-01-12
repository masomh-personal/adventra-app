import { createMatch, getUserMatches } from '@/services/matchesService';
import type { MatchData } from '@/services/matchesService';

// Hoist mock functions
const { mockSingle, mockEq } = vi.hoisted(() => {
    const mockSingle = vi.fn();
    const mockEq = vi.fn();
    return { mockSingle, mockEq };
});

const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));

vi.mock('@/lib/supabaseClient', () => {
    const mockFrom = vi.fn((table: string) => {
        if (table === 'matches') {
            return {
                insert: mockInsert,
                select: vi.fn(() => ({ eq: mockEq })),
            };
        }
        return {};
    });

    return {
        __esModule: true,
        default: {
            from: mockFrom,
        },
    };
});

describe('matchesService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSingle.mockReset();
        mockEq.mockReset();
    });

    describe('createMatch', () => {
        const mockMatchData: MatchData = {
            user_id: 'user-1',
            matched_user_id: 'user-2',
            status: 'pending',
        };

        test('creates match successfully', async () => {
            mockSingle.mockResolvedValue({ data: mockMatchData, error: null });

            const result = await createMatch(mockMatchData);

            expect(result).toEqual(mockMatchData);
            expect(mockInsert).toHaveBeenCalledWith([mockMatchData]);
        });

        test('throws error when insert fails', async () => {
            const insertError = new Error('Database error');
            mockSingle.mockResolvedValue({ data: null, error: insertError });

            await expect(createMatch(mockMatchData)).rejects.toThrow('Database error');
        });

        test('throws error when data is not returned', async () => {
            mockSingle.mockResolvedValue({ data: null, error: null });

            await expect(createMatch(mockMatchData)).rejects.toThrow(
                'Match data was not returned from database',
            );
        });

        test('handles error object without message property', async () => {
            const insertError = { code: 'PGRST116', details: 'Row not found' };
            mockSingle.mockResolvedValue({ data: null, error: insertError });

            await expect(createMatch(mockMatchData)).rejects.toThrow();
        });
    });

    describe('getUserMatches', () => {
        test('returns matches for user successfully', async () => {
            const mockMatches: MatchData[] = [
                {
                    user_id: 'user-1',
                    matched_user_id: 'user-2',
                    status: 'pending',
                },
                {
                    user_id: 'user-1',
                    matched_user_id: 'user-3',
                    status: 'accepted',
                },
            ];

            mockEq.mockResolvedValue({ data: mockMatches, error: null });

            const result = await getUserMatches('user-1');

            expect(result).toEqual(mockMatches);
            expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
        });

        test('returns empty array when error occurs', async () => {
            mockEq.mockResolvedValue({
                data: null,
                error: new Error('Database error'),
            });

            await expect(getUserMatches('user-1')).rejects.toThrow('Database error');
        });

        test('returns empty array when data is null', async () => {
            mockEq.mockResolvedValue({ data: null, error: null });

            const result = await getUserMatches('user-1');

            expect(result).toEqual([]);
        });
    });
});
