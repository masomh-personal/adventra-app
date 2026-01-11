import { upsertProfile, getProfile } from '@/services/profilesService';
import type { CreateProfileData, UserProfile } from '@/types/user';

// Hoist mock functions
const { mockSingle } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  return { mockSingle };
});

const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockUpsert = vi.fn(() => ({ select: mockSelect }));
const mockEq = vi.fn(() => ({ single: mockSingle }));

vi.mock('@/lib/supabaseClient', () => {
  const mockFrom = vi.fn((table: string) => {
    if (table === 'profiles') {
      return {
        upsert: mockUpsert,
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

describe('profilesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
  });

  describe('upsertProfile', () => {
    const mockProfileData: CreateProfileData = {
      user_id: 'user-1',
      bio: 'Adventurer',
      adventure_preferences: ['hiking'],
    };

    const mockProfile: UserProfile = {
      user_id: 'user-1',
      bio: 'Adventurer',
      adventure_preferences: ['hiking'],
    };

    test('upserts profile successfully', async () => {
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      const result = await upsertProfile(mockProfileData);

      expect(result).toEqual(mockProfile);
      expect(mockUpsert).toHaveBeenCalledWith(mockProfileData);
    });

    test('throws error when upsert fails', async () => {
      const upsertError = new Error('Database error');
      mockSingle.mockResolvedValue({ data: null, error: upsertError });

      await expect(upsertProfile(mockProfileData)).rejects.toThrow('Database error');
    });

    test('throws error when data is not returned', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(upsertProfile(mockProfileData)).rejects.toThrow(
        'Profile data was not returned from database',
      );
    });

    test('handles error object without message property', async () => {
      const upsertError = { code: 'PGRST116', details: 'Row not found' };
      mockSingle.mockResolvedValue({ data: null, error: upsertError });

      await expect(upsertProfile(mockProfileData)).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    const mockProfile: UserProfile = {
      user_id: 'user-1',
      bio: 'Adventurer',
    };

    test('returns profile successfully', async () => {
      mockSingle.mockResolvedValue({ data: mockProfile, error: null });

      const result = await getProfile('user-1');

      expect(result).toEqual(mockProfile);
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-1');
    });

    test('throws error when query fails', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      await expect(getProfile('user-1')).rejects.toThrow('Database error');
    });

    test('returns null when data is null', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      const result = await getProfile('user-1');

      expect(result).toBeNull();
    });
  });
});
