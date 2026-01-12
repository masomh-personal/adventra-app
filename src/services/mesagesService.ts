import { databases, databaseId } from '@/lib/appwriteClient';
import { COLLECTION_IDS } from '@/types/appwrite';
import { Query, ID } from 'appwrite';

export interface MessageData {
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at?: string;
    message_id?: string;
    conversation_id?: string;
}

/**
 * Send a message between users.
 * @param messageData - Contains sender_id, receiver_id, content
 * @returns New message record
 */
export async function sendMessage(messageData: MessageData): Promise<MessageData> {
    try {
        const messageId = messageData.message_id || ID.unique();
        const document = await databases.createDocument(
            databaseId,
            COLLECTION_IDS.MESSAGES,
            messageId,
            {
                message_id: messageId,
                sender_id: messageData.sender_id,
                receiver_id: messageData.receiver_id,
                content: messageData.content,
                conversation_id: messageData.conversation_id || null,
                created_at: messageData.created_at || new Date().toISOString(),
            },
        );

        return {
            message_id: document.message_id as string,
            sender_id: document.sender_id as string,
            receiver_id: document.receiver_id as string,
            content: document.content as string,
            conversation_id: (document.conversation_id as string) || null,
            created_at: (document.created_at as string) || null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}

/**
 * Get conversation between two users.
 * @param user1 - First user ID
 * @param user2 - Second user ID
 * @returns List of messages
 */
export async function getConversation(user1: string, user2: string): Promise<MessageData[]> {
    try {
        // Appwrite doesn't support OR queries directly, so we need to fetch messages where user1 is sender or receiver
        // Then filter in application code
        const response = await databases.listDocuments(databaseId, COLLECTION_IDS.MESSAGES, [
            Query.or([Query.equal('sender_id', user1), Query.equal('receiver_id', user1)]),
            Query.orderAsc('created_at'),
        ]);

        // Filter to only messages between user1 and user2
        const messages = response.documents
            .filter(
                doc =>
                    (doc.sender_id === user1 && doc.receiver_id === user2) ||
                    (doc.sender_id === user2 && doc.receiver_id === user1),
            )
            .map(doc => ({
                message_id: (doc.message_id as string) || doc.$id,
                sender_id: doc.sender_id as string,
                receiver_id: doc.receiver_id as string,
                content: doc.content as string,
                conversation_id: (doc.conversation_id as string) || null,
                created_at: (doc.created_at as string) || null,
            }));

        return messages;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(errorMessage);
    }
}
