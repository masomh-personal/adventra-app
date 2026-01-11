import { sendMessage, getConversation } from '@/services/mesagesService';
import type { MessageData } from '@/services/mesagesService';

// Hoist mock functions
const { mockSingle, mockOrder } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockOrder = vi.fn();
  return { mockSingle, mockOrder };
});

const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockOr = vi.fn(() => ({ order: mockOrder }));
const mockSelectForConversation = vi.fn(() => ({ or: mockOr }));

vi.mock('@/lib/supabaseClient', () => {
  // Use hoisted mocks from outer scope
  return {
    __esModule: true,
    default: {
      from: (table: string) => {
        if (table === 'messages') {
          return {
            insert: mockInsert,
            select: mockSelectForConversation,
          };
        }
        return {};
      },
    },
  };
});

describe('messagesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSingle.mockReset();
    mockOrder.mockReset();
  });

  describe('sendMessage', () => {
    const mockMessageData: MessageData = {
      sender_id: 'user-1',
      receiver_id: 'user-2',
      content: 'Hello!',
    };

    test('sends message successfully', async () => {
      mockSingle.mockResolvedValue({ data: mockMessageData, error: null });

      const result = await sendMessage(mockMessageData);

      expect(result).toEqual(mockMessageData);
      expect(mockInsert).toHaveBeenCalledWith([mockMessageData]);
    });

    test('throws error when insert fails', async () => {
      const insertError = new Error('Database error');
      mockSingle.mockResolvedValue({ data: null, error: insertError });

      await expect(sendMessage(mockMessageData)).rejects.toThrow('Database error');
    });

    test('throws error when data is not returned', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(sendMessage(mockMessageData)).rejects.toThrow(
        'Message data was not returned from database',
      );
    });

    test('handles error object without message property', async () => {
      const insertError = { code: 'PGRST116', details: 'Row not found' };
      mockSingle.mockResolvedValue({ data: null, error: insertError });

      await expect(sendMessage(mockMessageData)).rejects.toThrow();
    });
  });

  describe('getConversation', () => {
    test('returns filtered conversation messages', async () => {
      const mockMessages: MessageData[] = [
        {
          sender_id: 'user-1',
          receiver_id: 'user-2',
          content: 'Hello',
        },
        {
          sender_id: 'user-2',
          receiver_id: 'user-1',
          content: 'Hi there',
        },
        {
          sender_id: 'user-1',
          receiver_id: 'user-3', // Should be filtered out
          content: 'Other message',
        },
      ];

      mockOrder.mockResolvedValue({ data: mockMessages, error: null });

      const result = await getConversation('user-1', 'user-2');

      // Should only return messages between user-1 and user-2
      expect(result).toHaveLength(2);
      expect(result[0].sender_id).toBe('user-1');
      expect(result[0].receiver_id).toBe('user-2');
      expect(result[1].sender_id).toBe('user-2');
      expect(result[1].receiver_id).toBe('user-1');
    });

    test('throws error when query fails', async () => {
      mockOrder.mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      await expect(getConversation('user-1', 'user-2')).rejects.toThrow('Database error');
    });

    test('returns empty array when data is null', async () => {
      mockOrder.mockResolvedValue({ data: null, error: null });

      const result = await getConversation('user-1', 'user-2');

      expect(result).toEqual([]);
    });
  });
});
