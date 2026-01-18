import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Models } from 'appwrite';
import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import { Query } from 'appwrite';
import withAuth from '@/lib/withAuth';
import { FaComment } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '@/components/Button';

interface Conversation {
    conversation_id: string;
    user_1_id: string;
    user_2_id: string;
    last_message_timestamp?: string | null;
    user_1?: { name: string } | null;
    user_2?: { name: string } | null;
}

interface Message {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    message_content: string;
    timestamp: string;
    conversation_id?: string;
}

interface MessagesPageProps {
    user: Models.User<Models.Preferences> | null;
}

function MessagesPage({ user: _user }: MessagesPageProps): React.JSX.Element {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const currentUserId = await getCurrentUserId();
                setUserId(currentUserId);
                if (!currentUserId) return;

                // Fetch conversations where user is user_1 or user_2
                // Appwrite doesn't support OR queries directly, so fetch separately and combine
                const [user1Response, user2Response] = await Promise.all([
                    databases.listDocuments(databaseId, COLLECTION_IDS.CONVERSATIONS, [
                        Query.equal('user_1_id', currentUserId),
                        Query.orderDesc('last_message_timestamp'),
                    ]),
                    databases.listDocuments(databaseId, COLLECTION_IDS.CONVERSATIONS, [
                        Query.equal('user_2_id', currentUserId),
                        Query.orderDesc('last_message_timestamp'),
                    ]),
                ]);

                // Combine and deduplicate conversations
                const allConversations = [...user1Response.documents, ...user2Response.documents];
                const uniqueConversations = Array.from(
                    new Map(allConversations.map(doc => [doc.conversation_id, doc])).values(),
                );

                // Fetch user data for each conversation
                const conversationsWithUsers: Conversation[] = await Promise.all(
                    uniqueConversations.map(async doc => {
                        let user1: { name: string } | null = null;
                        let user2: { name: string } | null = null;

                        try {
                            const user1Doc = await databases.getDocument(
                                databaseId,
                                COLLECTION_IDS.USER,
                                doc.user_1_id as string,
                            );
                            user1 = { name: user1Doc.name as string };
                        } catch (_e) {
                            // User not found
                        }

                        try {
                            const user2Doc = await databases.getDocument(
                                databaseId,
                                COLLECTION_IDS.USER,
                                doc.user_2_id as string,
                            );
                            user2 = { name: user2Doc.name as string };
                        } catch (_e) {
                            // User not found
                        }

                        return {
                            conversation_id: doc.conversation_id as string,
                            user_1_id: doc.user_1_id as string,
                            user_2_id: doc.user_2_id as string,
                            last_message_timestamp: (doc.last_message_timestamp as string) || null,
                            user_1: user1,
                            user_2: user2,
                        };
                    }),
                );

                setConversations(conversationsWithUsers);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchMessages = async (conversation_id: string): Promise<void> => {
        if (!conversation_id) return;
        try {
            const response = await databases.listDocuments(databaseId, COLLECTION_IDS.MESSAGES, [
                Query.equal('conversation_id', conversation_id),
                Query.orderAsc('created_at'),
            ]);

            const messagesData: Message[] = response.documents.map((doc: any) => ({
                message_id: (doc.message_id as string) || doc.$id,
                sender_id: doc.sender_id as string,
                receiver_id: doc.receiver_id as string,
                message_content: doc.content as string,
                timestamp: (doc.created_at as string) || '',
                conversation_id: (doc.conversation_id as string) || null,
            }));

            setMessages(messagesData);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSelectConversation = async (id: string): Promise<void> => {
        setSelectedConversation(id);
        await fetchMessages(id);
    };

    const formatDate = (timestamp: string): string => {
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

    if (loading) {
        return (
            <div className='w-full h-screen flex items-center justify-center bg-background text-foreground'>
                <LoadingSpinner label='Loading messages...' />
            </div>
        );
    }

    return (
        <div className='w-full flex-grow bg-background text-foreground flex items-center justify-center p-6 font-body'>
            <div className='w-full max-w-4xl bg-white shadow-md rounded-lg p-8 my-8'>
                <main className='flex flex-col'>
                    <h2 className='text-xl font-extrabold mb-4 text-center'>🏕️ Your Messages</h2>
                    <hr className='border-t border-primary my-2' />

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
                        {/* Left Side: Inbox */}
                        <div className='col-span-1 bg-gray-100 p-4 rounded-md min-h-[50vh] max-h-[50vh] overflow-y-auto'>
                            <h3 className='text-lg font-semibold mb-4'>Inbox</h3>
                            {conversations.length === 0 ? (
                                <p>No conversations yet!</p>
                            ) : (
                                <ul>
                                    {conversations.map(conv => {
                                        const otherName =
                                            conv.user_1_id === userId
                                                ? conv.user_2?.name
                                                : conv.user_1?.name;
                                        const isSelected =
                                            conv.conversation_id === selectedConversation;
                                        return (
                                            <li
                                                key={conv.conversation_id}
                                                onClick={() =>
                                                    handleSelectConversation(conv.conversation_id)
                                                }
                                                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-200
                        ${isSelected ? 'border-1 border-r-4 border-primary bg-primary/15' : ''}`}
                                            >
                                                <FaComment className='text-primary mr-2' />
                                                <strong>{otherName || 'Unknown User'}</strong>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Right Side: Messages View */}
                        <div className='col-span-2 bg-gray-50 p-4 rounded-md min-h-[50vh] max-h-[50vh] overflow-y-auto'>
                            {selectedConversation ? (
                                <div className='flex flex-col space-y-4'>
                                    <h3 className='text-lg font-semibold mb-4'>Conversation</h3>
                                    {messages.length === 0 ? (
                                        <p>No messages in this conversation.</p>
                                    ) : (
                                        messages.map(msg => {
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
                                                    <span className='text-[0.65rem] text-gray-500'>
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
                    <div className='mt-8 flex justify-center'>
                        <Button
                            label={
                                (
                                    <>
                                        <FiArrowLeft className='text-sm' /> Back to Dashboard
                                    </>
                                ) as unknown as string
                            }
                            variant='secondary'
                            onClick={() => router.push('/dashboard')}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default withAuth(MessagesPage);
