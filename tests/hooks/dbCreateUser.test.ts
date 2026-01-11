import { dbCreateUser } from '@/hooks/dbCreateUser';
import type { User } from '@/types/user';

// Hoist mock functions so they can be used in the mock factory
const { mockSingle, mockUpsert } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockUpsert = vi.fn();
  return { mockSingle, mockUpsert };
});

const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));

vi.mock('@/lib/supabaseClient', () => {
  const mockFrom = vi.fn((table: string) => {
    if (table === 'user') {
      return { insert: mockInsert };
    }
    if (table === 'userprofile') {
      return { upsert: mockUpsert };
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

// Silence expected console errors
beforeAll(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => {
  vi.restoreAllMocks();
});

describe('dbCreateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
    mockUpsert.mockReset();
  });

  const mockUser: User = {
    user_id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
  };

  test('creates user and profile successfully', async () => {
    mockSingle.mockResolvedValue({ data: mockUser, error: null });
    mockUpsert.mockResolvedValue({ error: null });

    const result = await dbCreateUser({
      user_id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
      birthdate: '1990-01-01',
    });

    expect(result).toEqual(mockUser);
    expect(mockInsert).toHaveBeenCalledWith([
      { user_id: 'test-user-123', name: 'Test User', email: 'test@example.com' },
    ]);
    expect(mockUpsert).toHaveBeenCalledWith(
      [{ user_id: 'test-user-123', birthdate: '1990-01-01' }],
      { onConflict: 'user_id' },
    );
  });

  test('creates user without birthdate', async () => {
    mockSingle.mockResolvedValue({ data: mockUser, error: null });
    mockUpsert.mockResolvedValue({ error: null });

    const result = await dbCreateUser({
      user_id: 'test-user-123',
      name: 'Test User',
      email: 'test@example.com',
    });

    expect(result).toEqual(mockUser);
    expect(mockUpsert).toHaveBeenCalledWith(
      [{ user_id: 'test-user-123', birthdate: undefined }],
      { onConflict: 'user_id' },
    );
  });

  test('throws error when user insert fails', async () => {
    const insertError = new Error('Database error');
    mockSingle.mockResolvedValue({ data: null, error: insertError });

    await expect(
      dbCreateUser({
        user_id: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
      }),
    ).rejects.toThrow('Failed to create user in database');

    expect(mockUpsert).not.toHaveBeenCalled();
  });

  test('throws error when profile upsert fails', async () => {
    mockSingle.mockResolvedValue({ data: mockUser, error: null });
    const upsertError = new Error('Profile error');
    mockUpsert.mockResolvedValue({ error: upsertError });

    await expect(
      dbCreateUser({
        user_id: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
        birthdate: '1990-01-01',
      }),
    ).rejects.toThrow('Failed to create user profile in database');
  });

  test('throws error when user data is not returned', async () => {
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockUpsert.mockResolvedValue({ error: null });

    await expect(
      dbCreateUser({
        user_id: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
      }),
    ).rejects.toThrow('User data was not returned from database');
  });

  test('handles error object without message property', async () => {
    const insertError = { code: 'PGRST116', details: 'Row not found' };
    mockSingle.mockResolvedValue({ data: null, error: insertError });

    await expect(
      dbCreateUser({
        user_id: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
      }),
    ).rejects.toThrow('Failed to create user in database');
  });
});
