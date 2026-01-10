import supabase from '@/lib/supabaseClient';

export interface MessageData {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
}

/**
 * Send a message between users.
 * @param messageData - Contains sender_id, receiver_id, content
 * @returns New message record
 */
export async function sendMessage(messageData: MessageData): Promise<MessageData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('messages') as any).insert([messageData]).select().single();

  if (error) throw new Error(error instanceof Error ? error.message : String(error));
  if (!data) throw new Error('Message data was not returned from database');
  return data as MessageData;
}

/**
 * Get conversation between two users.
 * @param user1 - First user ID
 * @param user2 - Second user ID
 * @returns List of messages
 */
export async function getConversation(user1: string, user2: string): Promise<MessageData[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user1},receiver_id.eq.${user1}`)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (data as MessageData[])?.filter(
    (msg) =>
      (msg.sender_id === user1 && msg.receiver_id === user2) ||
      (msg.sender_id === user2 && msg.receiver_id === user1)
  ) ?? [];
}
