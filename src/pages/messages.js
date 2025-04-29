import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';
import withAuth from '@/lib/withAuth';
import Button from '@/components/Button';
import InfoCard from '@/components/InfoCard';
import { FaComment } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import the LoadingSpinner component
import { getCurrentUserId } from '@/lib/getCurrentUserId'; // Import the function to get current user ID

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading state to true initially
  const router = useRouter();
  const [userId, setUserId] = useState(null); // State to store the userId

  useEffect(() => {
    // IIFE to fetch userId and conversations
    (async () => {
      try {
        // Fetch the current user's ID
        const currentUserId = await getCurrentUserId();
        setUserId(currentUserId); // Set the userId in the state

        // Fetch conversations after the userId is fetched
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
          .order('last_message_timestamp', { ascending: false }); // Fetch most recent first

        if (error) throw error;

        setConversations(data); // Set conversations
      } catch (error) {
        console.error('Error fetching user ID or conversations:', error);
      } finally {
        setLoading(false); // Set loading to false once everything is fetched
      }
    })();
  }, []); // Empty dependency array to run only on mount

  // Fetch messages for the selected conversation
  const fetchMessages = async (conversation_id) => {
    if (!conversation_id) {
      console.error('Invalid conversation_id');
      return;
    }

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

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation_id) => {
    setSelectedConversation(conversation_id);
    await fetchMessages(conversation_id);
  };

  // Show loading spinner until data is fetched
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
        <LoadingSpinner label="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 my-8">
        {' '}
        {/* Change width to max-w-4xl */}
        <main>
          <h2 className="text-xl font-extrabold mb-4 text-center">
            Welcome, <span className="text-secondary">{userId}</span>!
          </h2>
          <h3 className="text-xl font-extrabold mb-4 text-center">Your Messages</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Left Side: Inbox */}
            <div className="col-span-1 bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Inbox</h3>
              {conversations.length === 0 ? (
                <p>No conversations yet!</p>
              ) : (
                <ul>
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.conversation_id}
                      className="cursor-pointer p-2 hover:bg-gray-200 rounded-md"
                      onClick={() => handleSelectConversation(conversation.conversation_id)} // Pass correct conversation_id
                    >
                      {conversation.user_1_id === userId
                        ? `Chat with ${conversation.user_2?.name}`
                        : `Chat with ${conversation.user_1?.name}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right Side: Messages View */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-md">
              {selectedConversation ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Conversation</h3>
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p>No messages in this conversation.</p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.message_id}
                          className={`p-2 rounded-md ${message.sender_id === userId ? 'bg-blue-100 float-left' : 'bg-green-100 float-right'}`}
                        >
                          <p>{message.message_content}</p>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p>Select a conversation to view messages.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(MessagesPage);
