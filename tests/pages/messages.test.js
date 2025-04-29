import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessagesPage from '@/pages/messages';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { useRouter } from 'next/router';

// 1) Mock the withAuth HOC so it just returns the component
jest.mock('@/lib/withAuth', () => (Component) => Component);

// 2) Stub out the entire Supabase client so it never reads env vars
jest.mock('@/lib/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
}));

// 3) Mock getCurrentUserId
jest.mock('@/lib/getCurrentUserId', () => ({
  getCurrentUserId: jest.fn(),
}));

// 4) Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('MessagesPage', () => {
  let mockPush;

  beforeEach(() => {
    jest.clearAllMocks();

    // router.push stub
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    // current user stub
    getCurrentUserId.mockResolvedValue('admin');

    // conversations mock data
    const convs = [
      {
        conversation_id: 'conv1',
        user_1_id: 'admin',
        user_2_id: 'userA',
        user_1: { name: 'Admin' },
        user_2: { name: 'Alice' },
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
    const sb = require('@/lib/supabaseClient');
    sb.from.mockImplementation((table) => {
      if (table === 'conversations') {
        return {
          select: () => ({
            or: () => ({ order: () => Promise.resolve({ data: convs, error: null }) }),
          }),
        };
      }
      if (table === 'messages') {
        return {
          select: () => ({
            eq: () => ({ order: () => Promise.resolve({ data: msgs, error: null }) }),
          }),
        };
      }
      return { select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) };
    });
  });

  it('shows spinner then loads inbox', async () => {
    render(<MessagesPage />);
    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
    await waitFor(() => screen.getByText('Alice'));
  });

  it('loads messages when clicking a conversation', async () => {
    render(<MessagesPage />);
    await waitFor(() => screen.getByText('Alice'));
    await userEvent.click(screen.getByText('Alice'));
    expect(await screen.findByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('Hello Alice!')).toBeInTheDocument();
  });

  it('navigates back on button click', async () => {
    render(<MessagesPage />);
    await waitFor(() => screen.getByRole('button', { name: /Back to Dashboard/i }));
    await userEvent.click(screen.getByRole('button', { name: /Back to Dashboard/i }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
