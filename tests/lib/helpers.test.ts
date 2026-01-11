import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { getFullUserProfile } from '@/lib/getFullUserProfile';
import { calcAgeFromBirthdate } from '@/lib/calcAgeFromBirthdate';

// Hoist mock functions so they can be used in the mock factory
const { mockGetSession, mockSingle } = vi.hoisted(() => {
  const mockGetSession = vi.fn();
  const mockSingle = vi.fn();
  return { mockGetSession, mockSingle };
});

vi.mock('@/lib/supabaseClient', () => {
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));

  return {
    __esModule: true,
    default: {
      auth: { getSession: mockGetSession },
      from: mockFrom,
    },
  };
});

// Silence expected console errors
beforeAll(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => {
  vi.restoreAllMocks();
});

describe('calcAgeFromBirthdate', () => {
  test('returns correct age when birthday has passed this year', () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 25);
    birthdate.setMonth(birthdate.getMonth() - 1);

    expect(calcAgeFromBirthdate(birthdate.toISOString())).toBe(25);
  });

  test('returns correct age when birthday is yet to come this year', () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 30);
    birthdate.setMonth(birthdate.getMonth() + 1);

    expect(calcAgeFromBirthdate(birthdate.toISOString())).toBe(29);
  });

  test('returns null for invalid input', () => {
    expect(calcAgeFromBirthdate(null)).toBeNull();
    expect(calcAgeFromBirthdate('invalid-date')).toBeNull();
  });
});

describe('getCurrentUserId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns user ID when session is valid', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });

    const result = await getCurrentUserId();
    expect(result).toBe('abc123');
  });

  test('returns null when no session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const result = await getCurrentUserId();
    expect(result).toBeNull();
  });

  test('throws error if Supabase fails', async () => {
    mockGetSession.mockResolvedValue({
      data: {},
      error: new Error('Session error'),
    });

    await expect(getCurrentUserId()).rejects.toThrow('Session error');
  });
});

describe('getFullUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
  });

  test('returns hydrated profile with age', async () => {
    const profile = {
      bio: 'Explorer',
      adventure_preferences: ['climbing'],
      skill_summary: 'advanced',
      profile_image_url: '/img.jpg',
      birthdate: '1995-08-10',
      user: { name: 'Test User', email: 'test@example.com' },
      user_id: 'user-123',
    };

    mockSingle.mockResolvedValue({ data: profile, error: null });

    const result = await getFullUserProfile('user-123');
    expect(result).toMatchObject({
      ...profile,
      age: expect.any(Number),
    });
  });

  test('returns null if Supabase throws error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('fail') });

    const result = await getFullUserProfile('user-123');
    expect(result).toBeNull();
  });

  test('returns null if no UID provided', async () => {
    const result = await getFullUserProfile(null);
    expect(result).toBeNull();
  });
});
