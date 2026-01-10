import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { getFullUserProfile } from '@/lib/getFullUserProfile';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';

jest.mock('@/lib/supabaseClient', () => {
  const mockGetSession = jest.fn();
  const mockSingle = jest.fn();

  const mockEq = jest.fn(() => ({ single: mockSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockFrom = jest.fn(() => ({ select: mockSelect }));

  return {
    __esModule: true,
    default: {
      auth: { getSession: mockGetSession },
      from: mockFrom,
    },
    __mocks__: {
      mockGetSession,
      mockSingle,
    },
  };
});

// Re-extract mocks from the mocked module
 
const { mockGetSession, mockSingle } = (jest.requireMock('@/lib/supabaseClient') as any).__mocks__;

// Silence expected console errors
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('calcAgeFromBirthdate', () => {
  it('returns correct age when birthday has passed this year', () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 25);
    birthdate.setMonth(birthdate.getMonth() - 1);

    expect(calcAgeFromBirthdate(birthdate.toISOString())).toBe(25);
  });

  it('returns correct age when birthday is yet to come this year', () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 30);
    birthdate.setMonth(birthdate.getMonth() + 1);

    expect(calcAgeFromBirthdate(birthdate.toISOString())).toBe(29);
  });

  it('returns null for invalid input', () => {
    expect(calcAgeFromBirthdate(null)).toBeNull();
    expect(calcAgeFromBirthdate('invalid-date')).toBeNull();
  });
});

describe('getCurrentUserId', () => {
  it('returns user ID when session is valid', async () => {
    (mockGetSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });

    const result = await getCurrentUserId();
    expect(result).toBe('abc123');
  });

  it('returns null when no session exists', async () => {
    (mockGetSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const result = await getCurrentUserId();
    expect(result).toBeNull();
  });

  it('throws error if Supabase fails', async () => {
    (mockGetSession as jest.Mock).mockResolvedValue({
      data: {},
      error: new Error('Session error'),
    });

    await expect(getCurrentUserId()).rejects.toThrow('Session error');
  });
});

describe('getFullUserProfile', () => {
  beforeEach(() => {
    (mockSingle as jest.Mock).mockReset();
  });

  it('returns hydrated profile with age', async () => {
    const profile = {
      bio: 'Explorer',
      adventure_preferences: ['climbing'],
      skill_summary: 'advanced',
      profile_image_url: '/img.jpg',
      birthdate: '1995-08-10',
      user: { name: 'Test User', email: 'test@example.com' },
      user_id: 'user-123',
    };

    (mockSingle as jest.Mock).mockResolvedValue({ data: profile, error: null });

    const result = await getFullUserProfile('user-123');
    expect(result).toMatchObject({
      ...profile,
      age: expect.any(Number),
    });
  });

  it('returns null if Supabase throws error', async () => {
    (mockSingle as jest.Mock).mockResolvedValue({ data: null, error: new Error('fail') });

    const result = await getFullUserProfile('user-123');
    expect(result).toBeNull();
  });

  it('returns null if no UID provided', async () => {
    const result = await getFullUserProfile(null);
    expect(result).toBeNull();
  });
});
