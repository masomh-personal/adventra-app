/**
 * Mock Appwrite Client
 * Provides the same API as the real Appwrite client but uses localStorage mock data.
 * This allows the app to work as a demo/brochure site without a real backend.
 */

import {
    initializeMockData,
    getUserByEmail,
    createUser as createMockUser,
    getCurrentUser,
    createSession,
    deleteSession,
    getProfiles,
    getProfileById,
    upsertProfile as upsertMockProfile,
    getUserRecordById,
    createUserRecord,
    getMatches,
    getMatchesForUser,
    createMatch as createMockMatch,
    getConversations,
    getConversationsForUser,
    getMessagesForConversation,
    sendMessage as sendMockMessage,
    generateId,
    type MockProfile,
} from './mockData';

// Initialize mock data on module load
if (typeof window !== 'undefined') {
    initializeMockData();
}

// Collection IDs (matching the real ones)
const COLLECTION_IDS = {
    USER: 'user',
    USERPROFILE: 'userprofile',
    MATCHES: 'matches',
    CONVERSATIONS: 'conversations',
    MESSAGES: 'messages',
};

// ============================================
// MOCK ACCOUNT API
// ============================================

// Use 'any' for mock returns to avoid type conflicts with real Appwrite SDK

type AnyUser = any;

export const mockAccount = {
    /**
     * Get current logged-in user
     */
    get: async (): Promise<AnyUser> => {
        await delay(100); // Simulate network delay
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        return user as AnyUser;
    },

    /**
     * Create a new account
     */
    create: async (
        userId: string,
        email: string,
        password: string,
        name: string,
    ): Promise<AnyUser> => {
        await delay(200);
        try {
            return createMockUser({ id: userId, email, password, name }) as AnyUser;
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                throw new Error('User with this email already exists');
            }
            throw error;
        }
    },

    /**
     * Create email session (login)
     */
    createEmailSession: async (email: string, password: string): Promise<{ $id: string }> => {
        await delay(200);
        const user = getUserByEmail(email);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.password !== password) {
            throw new Error('Invalid credentials');
        }

        const session = createSession(user.$id);
        return { $id: session.$id };
    },

    /**
     * Create magic URL session (just simulates success)
     */
    createMagicURLSession: async (email: string, _url: string): Promise<{ $id: string }> => {
        await delay(200);
        const user = getUserByEmail(email);

        if (!user) {
            // For demo purposes, we'll just log them in anyway or you could throw
            throw new Error('No account found with this email');
        }

        // In a real app, this would send an email. Here we just create a session.
        const session = createSession(user.$id);
        return { $id: session.$id };
    },

    /**
     * Delete current session (logout)
     */
    deleteSession: async (_sessionId: string): Promise<void> => {
        await delay(100);
        deleteSession();
    },
};

// ============================================
// MOCK DATABASES API
// ============================================

export const mockDatabases = {
    /**
     * Get a document by ID
     */
    getDocument: async (
        _databaseId: string,
        collectionId: string,
        documentId: string,
    ): Promise<Record<string, unknown>> => {
        await delay(50);

        switch (collectionId) {
            case COLLECTION_IDS.USER: {
                const userRecord = getUserRecordById(documentId);
                if (!userRecord) throw new Error('Document not found');
                return userRecord as unknown as Record<string, unknown>;
            }
            case COLLECTION_IDS.USERPROFILE: {
                const profile = getProfileById(documentId);
                if (!profile) throw new Error('Document not found');
                return profile as unknown as Record<string, unknown>;
            }
            default:
                throw new Error(`Unknown collection: ${collectionId}`);
        }
    },

    /**
     * Create a document
     */
    createDocument: async (
        _databaseId: string,
        collectionId: string,
        documentId: string,
        data: Record<string, unknown>,
    ): Promise<Record<string, unknown>> => {
        await delay(100);

        switch (collectionId) {
            case COLLECTION_IDS.USER: {
                const record = createUserRecord({
                    user_id: documentId,
                    name: data.name as string,
                    email: data.email as string,
                    birthdate: data.birthdate as string | undefined,
                });
                return record as unknown as Record<string, unknown>;
            }
            case COLLECTION_IDS.USERPROFILE: {
                const profile = upsertMockProfile({
                    user_id: documentId,
                    ...data,
                } as Partial<MockProfile> & { user_id: string });
                return profile as unknown as Record<string, unknown>;
            }
            case COLLECTION_IDS.MATCHES: {
                const match = createMockMatch({
                    user_id: data.user_id as string,
                    matched_user_id: data.matched_user_id as string,
                    status: data.status as string | undefined,
                });
                return match as unknown as Record<string, unknown>;
            }
            case COLLECTION_IDS.MESSAGES: {
                const message = sendMockMessage({
                    conversation_id: data.conversation_id as string,
                    sender_id: data.sender_id as string,
                    receiver_id: data.receiver_id as string,
                    content: data.content as string,
                });
                return message as unknown as Record<string, unknown>;
            }
            default:
                throw new Error(`Unknown collection: ${collectionId}`);
        }
    },

    /**
     * Update a document
     */
    updateDocument: async (
        _databaseId: string,
        collectionId: string,
        documentId: string,
        data: Record<string, unknown>,
    ): Promise<Record<string, unknown>> => {
        await delay(100);

        switch (collectionId) {
            case COLLECTION_IDS.USERPROFILE: {
                const profile = upsertMockProfile({
                    user_id: documentId,
                    ...data,
                } as Partial<MockProfile> & { user_id: string });
                return profile as unknown as Record<string, unknown>;
            }
            default:
                throw new Error(`Update not supported for collection: ${collectionId}`);
        }
    },

    /**
     * List documents with optional queries
     */
    listDocuments: async (
        _databaseId: string,
        collectionId: string,
        queries?: unknown[],
    ): Promise<{ documents: Record<string, unknown>[]; total: number }> => {
        await delay(100);

        switch (collectionId) {
            case COLLECTION_IDS.USERPROFILE: {
                const profiles = getProfiles();
                return {
                    documents: profiles as unknown as Record<string, unknown>[],
                    total: profiles.length,
                };
            }
            case COLLECTION_IDS.MATCHES: {
                // Parse query to get user_id
                const userId = parseQueryForUserId(queries);
                const matches = userId ? getMatchesForUser(userId) : getMatches();
                return {
                    documents: matches as unknown as Record<string, unknown>[],
                    total: matches.length,
                };
            }
            case COLLECTION_IDS.CONVERSATIONS: {
                // Parse query to get user_id
                const userId = parseQueryForUserId(queries);
                const conversations = userId ? getConversationsForUser(userId) : getConversations();
                return {
                    documents: conversations as unknown as Record<string, unknown>[],
                    total: conversations.length,
                };
            }
            case COLLECTION_IDS.MESSAGES: {
                // Parse query for conversation_id
                const conversationId = parseQueryForConversationId(queries);
                const messages = conversationId ? getMessagesForConversation(conversationId) : [];
                return {
                    documents: messages as unknown as Record<string, unknown>[],
                    total: messages.length,
                };
            }
            default:
                return { documents: [], total: 0 };
        }
    },

    /**
     * Delete a document
     */
    deleteDocument: async (
        _databaseId: string,
        _collectionId: string,
        _documentId: string,
    ): Promise<void> => {
        await delay(100);
        // For demo purposes, we won't actually delete anything
        console.log('Mock: Delete document (not implemented for demo)');
    },
};

// ============================================
// MOCK STORAGE API
// ============================================

export const mockStorage = {
    createFile: async (
        _bucketId: string,
        _fileId: string,
        _file: File,
    ): Promise<{ $id: string }> => {
        await delay(500); // Simulate upload time
        return { $id: generateId() };
    },

    getFilePreview: (_bucketId: string, fileId: string): string => {
        // Return a placeholder image URL
        return `https://via.placeholder.com/400?text=${fileId}`;
    },

    deleteFile: async (_bucketId: string, _fileId: string): Promise<void> => {
        await delay(100);
    },
};

// ============================================
// MOCK ID HELPER
// ============================================

export const mockID = {
    unique: (): string => generateId(),
};

// ============================================
// MOCK QUERY HELPER
// ============================================

export const mockQuery = {
    equal: (
        field: string,
        value: string | string[],
    ): { field: string; value: string | string[]; type: 'equal' } => ({
        field,
        value,
        type: 'equal',
    }),
    orderDesc: (field: string): { field: string; type: 'orderDesc' } => ({
        field,
        type: 'orderDesc',
    }),
    orderAsc: (field: string): { field: string; type: 'orderAsc' } => ({
        field,
        type: 'orderAsc',
    }),
    or: (queries: unknown[]): { queries: unknown[]; type: 'or' } => ({
        queries,
        type: 'or',
    }),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseQueryForUserId(queries?: unknown[]): string | null {
    if (!queries || !Array.isArray(queries)) return null;

    for (const query of queries) {
        if (typeof query === 'object' && query !== null) {
            const q = query as { field?: string; value?: string | string[]; type?: string };
            if (
                q.type === 'equal' &&
                (q.field === 'user_id' || q.field === 'user_1_id' || q.field === 'user_2_id')
            ) {
                return Array.isArray(q.value) ? q.value[0] : q.value || null;
            }
        }
    }
    return null;
}

function parseQueryForConversationId(queries?: unknown[]): string | null {
    if (!queries || !Array.isArray(queries)) return null;

    for (const query of queries) {
        if (typeof query === 'object' && query !== null) {
            const q = query as { field?: string; value?: string | string[]; type?: string };
            if (q.type === 'equal' && q.field === 'conversation_id') {
                return Array.isArray(q.value) ? q.value[0] : q.value || null;
            }
        }
    }
    return null;
}
