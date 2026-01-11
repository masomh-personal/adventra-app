import { createUser, getUserById } from '@/services/usersService';
import type { CreateUserData, User } from '@/types/user';

// Hoist mock functions
const { mockSingle } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  return { mockSingle };
});

const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockEq = vi.fn(() => ({ single: mockSingle }));

vi.mock('@/lib/supabaseClient', () => {
  const mockFrom = vi.fn((table: string) => {
    if (table === 'users') {
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

describe('usersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
  });

  describe('createUser', () => {
    const mockUserData: CreateUserData = {
      user_id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      birthdate: '1990-01-01',
    };

    const mockUser: User = {
      user_id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    };

    test('creates user successfully', async () => {
      mockSingle.mockResolvedValue({ data: mockUser, error: null });

      const result = await createUser(mockUserData);

      expect(result).toEqual(mockUser);
      expect(mockInsert).toHaveBeenCalledWith([mockUserData]);
    });

    test('throws error when insert fails', async () => {
      const insertError = new Error('Database error');
      mockSingle.mockResolvedValue({ data: null, error: insertError });

      await expect(createUser(mockUserData)).rejects.toThrow('Database error');
    });

    test('throws error when data is not returned', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(createUser(mockUserData)).rejects.toThrow(
        'User data was not returned from database',
      );
    });

    test('handles error object without message property', async () => {
      const insertError = { code: 'PGRST116', details: 'Row not found' };
      mockSingle.mockResolvedValue({ data: null, error: insertError });

      await expect(createUser(mockUserData)).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    const mockUser: User = {
      user_id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    };

    test('returns user successfully', async () => {
      mockSingle.mockResolvedValue({ data: mockUser, error: null });

      const result = await getUserById('user-1');

      expect(result).toEqual(mockUser);
      expect(mockEq).toHaveBeenCalledWith('id', 'user-1');
    });

    test('throws error when query fails', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      await expect(getUserById('user-1')).rejects.toThrow('Database error');
    });

    test('returns null when data is null', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      const result = await getUserById('user-1');

      expect(result).toBeNull();
    });
  });
});
