import { supabase } from '@/lib/supabaseClient';

/**
 * Send a message between users.
 * @param {Object} messageData - Contains sender_id, receiver_id, content
 * @returns {Object} New message record
 */
export async function sendMessage(messageData) {
  const { data, error } = await supabase.from('messages').insert([messageData]);

  if (error) throw new Error(error.message);
  return data[0];
}

/**
 * Get conversation between two users.
 * @param {string} user1 - First user ID
 * @param {string} user2 - Second user ID
 * @returns {Array} List of messages
 */
export async function getConversation(user1, user2) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user1},receiver_id.eq.${user1}`)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data.filter(
    (msg) =>
      (msg.sender_id === user1 && msg.receiver_id === user2) ||
      (msg.sender_id === user2 && msg.receiver_id === user1)
  );
}
