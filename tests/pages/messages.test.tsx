import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MessagesPage from '@/pages/messages';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { useRouter } from 'next/router';

// Hoist mocks
const { mockFrom, mockGetCurrentUserId, mockUseRouter } = vi.hoisted(() => {
  const mockFrom = vi.fn();
  const mockGetCurrentUserId = vi.fn();
  const mockUseRouter = vi.fn();
  return { mockFrom, mockGetCurrentUserId, mockUseRouter };
});

// 1) Mock the withAuth HOC so it just returns the component
vi.mock('@/lib/withAuth', () => ({
  default: (Component: React.ComponentType<unknown>) => Component,
}));

// 2) Stub out the entire Supabase client so it never reads env vars
vi.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: mockFrom,
  },
}));

// 3) Mock getCurrentUserId
vi.mock('@/lib/getCurrentUserId', () => ({
  getCurrentUserId: mockGetCurrentUserId,
}));

// 4) Mock next/router
vi.mock('next/router', () => ({
  useRouter: mockUseRouter,
}));

const mockedUseRouter = vi.mocked(useRouter);
const mockedGetCurrentUserId = vi.mocked(getCurrentUserId);

describe('MessagesPage', () => {
  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // router.push stub
    mockPush = vi.fn();
    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);

    // current user stub
    mockedGetCurrentUserId.mockResolvedValue('admin');

    // conversations mock data - Supabase returns joined relations as arrays
    const convs = [
      {
        conversation_id: 'conv1',
        user_1_id: 'admin',
        user_2_id: 'userA',
        user_1: [{ name: 'Admin' }], // Supabase returns joined relations as arrays
        user_2: [{ name: 'Alice' }], // Supabase returns joined relations as arrays
        last_message_timestamp: '2025-01-01T00:00:00Z',
      },
    ];
    // messages mock data
    const msgs = [
      {
        message_id: 'msg1',
        conversation_id: 'conv1',
        sender_id: 'admin',
        receiver_id: 'userA',
        message_content: 'Hello Alice!',
        timestamp: '2025-01-01T00:01:00Z',
      },
    ];

    // supabase.from('conversations') chain
    mockFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: () => ({
            or: () => ({
              order: () => Promise.resolve({ data: convs, error: null }),
            }),
          }),
        };
      }
      if (table === 'messages') {
        return {
          select: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: msgs, error: null }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      };
    });
  });

  test('shows spinner then loads inbox', async () => {
    render(<MessagesPage />);
    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
    await waitFor(() => screen.getByText('Alice'), { timeout: 3000 });
  });

  test('handles conversations with null user arrays', async () => {
    const conversationsWithNullUsers = [
      {
        conversation_id: 'conv-1',
        user_1_id: 'user-1',
        user_2_id: 'user-2',
        last_message_timestamp: '2024-01-01T10:00:00Z',
        user_1: null,
        user_2: [{ name: 'Bob' }],
      },
    ];

    mockFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: () => ({
            or: () => ({
              order: () => Promise.resolve({ data: conversationsWithNullUsers, error: null }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      };
    });

    render(<MessagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/unknown user/i)).toBeInTheDocument();
    });
  });

  test('handles conversations with empty user arrays', async () => {
    const conversationsWithEmptyUsers = [
      {
        conversation_id: 'conv-1',
        user_1_id: 'user-1',
        user_2_id: 'user-2',
        last_message_timestamp: '2024-01-01T10:00:00Z',
        user_1: [],
        user_2: [{ name: 'Bob' }],
      },
    ];

    mockFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: () => ({
            or: () => ({
              order: () => Promise.resolve({ data: conversationsWithEmptyUsers, error: null }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      };
    });

    render(<MessagesPage />);
    await waitFor(() => {
      expect(screen.getByText(/unknown user/i)).toBeInTheDocument();
    });
  });

  test('handles error when fetching conversations fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: () => ({
            or: () => ({
              order: () => Promise.reject(new Error('Failed to fetch conversations')),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      };
    });

    render(<MessagesPage />);
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  test('loads messages when clicking a conversation', async () => {
    render(<MessagesPage />);
    await waitFor(() => screen.getByText('Alice'), { timeout: 3000 });
    const user = userEvent.setup();
    await user.click(screen.getByText('Alice'));
    expect(await screen.findByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('Hello Alice!')).toBeInTheDocument();
  });

  test('navigates back on button click', async () => {
    render(<MessagesPage />);
    await waitFor(() => screen.getByRole('button', { name: /Back to Dashboard/i }));
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Back to Dashboard/i }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
