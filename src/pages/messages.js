import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';
import { FaComment } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '@/components/Button';

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const currentUserId = await getCurrentUserId();
        setUserId(currentUserId);

        const { data, error } = await supabase
          .from('conversations')
          .select(
            `
            conversation_id,
            user_1_id,
            user_2_id,
            last_message_timestamp,
            user_1:user_1_id(name),
            user_2:user_2_id(name)
          `
          )
          .or(`user_1_id.eq.${currentUserId},user_2_id.eq.${currentUserId}`)
          .order('last_message_timestamp', { ascending: false });

        if (error) throw error;
        setConversations(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchMessages = async (conversation_id) => {
    if (!conversation_id) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation_id)
        .order('timestamp', { ascending: true });
      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectConversation = async (id) => {
    setSelectedConversation(id);
    await fetchMessages(id);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
        <LoadingSpinner label="Loading messages..." />
      </div>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const monthDay = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${monthDay} @ ${time}`;
  };

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 my-8">
        <main className="flex flex-col">
          <h3 className="text-xl font-extrabold mb-4 text-center">Your Messages</h3>
          <hr className="border-t border-gray-300 my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Left Side: Inbox */}
            <div className="col-span-1 bg-gray-100 p-4 rounded-md min-h-[40vh] max-h-[40vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Inbox</h3>
              {conversations.length === 0 ? (
                <p>No conversations yet!</p>
              ) : (
                <ul>
                  {conversations.map((conv) => {
                    const otherName =
                      conv.user_1_id === userId ? conv.user_2.name : conv.user_1.name;
                    const isSelected = conv.conversation_id === selectedConversation;
                    return (
                      <li
                        key={conv.conversation_id}
                        onClick={() => handleSelectConversation(conv.conversation_id)}
                        className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-200
                        ${isSelected ? 'border-2 border-primary bg-primary-50' : ''}`}
                      >
                        <FaComment className="text-primary mr-2" />
                        <strong>{otherName}</strong>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Right Side: Messages View */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-md min-h-[40vh] max-h-[40vh] overflow-y-auto">
              {selectedConversation ? (
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Conversation</h3>
                  {messages.length === 0 ? (
                    <p>No messages in this conversation.</p>
                  ) : (
                    messages.map((msg) => {
                      const isOutgoing = msg.sender_id === userId;
                      return (
                        <div
                          key={msg.message_id}
                          className={`p-2 rounded-md border-l-4 max-w-2/3
                          ${
                            isOutgoing
                              ? 'bg-blue-100 border-blue-400 self-start pl-6'
                              : 'bg-green-100 border-green-400 self-end pr-6'
                          }`}
                        >
                          <p>{msg.message_content}</p>
                          <span className="text-[0.65rem] text-gray-500">
                            {formatDate(msg.timestamp)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <p>Select a conversation to view messages.</p>
              )}
            </div>
          </div>

          {/* -------- bottom buttons -------- */}
          <div className="mt-8 flex justify-center">
            <Button
              label={
                <>
                  <FiArrowLeft className="text-sm" /> Back to Dashboard
                </>
              }
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(MessagesPage);
