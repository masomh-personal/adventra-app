/**
 * Mock Data Store for Demo Mode
 * This provides a complete mock backend for the app to work as a brochure site.
 * Data persists in localStorage so it survives page refreshes.
 */

// Types - Compatible with Appwrite SDK Models.User
export interface MockUser {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    email: string;
    password: string; // Only for mock - never do this in production!
    emailVerification: boolean;
    prefs: Record<string, unknown>;
    // Additional fields to match Appwrite User type
    phone: string;
    phoneVerification: boolean;
    status: boolean;
    labels: string[];
    passwordUpdate: string;
    registration: string;
    mfa: boolean;
    targets: unknown[];
    accessedAt: string;
}

export interface MockProfile {
    $id: string;
    user_id: string;
    bio: string | null;
    adventure_preferences: string[] | null;
    skill_summary: string | null; // JSON stringified
    profile_image_url: string | null;
    birthdate: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    dating_preferences: string | null;
}

export interface MockUserRecord {
    $id: string;
    user_id: string;
    name: string;
    email: string;
    birthdate: string | null;
}

export interface MockMatch {
    $id: string;
    user_id: string;
    matched_user_id: string;
    status: string;
    created_at: string;
}

export interface MockConversation {
    $id: string;
    conversation_id: string;
    user_1_id: string;
    user_2_id: string;
    last_message_timestamp: string;
}

export interface MockMessage {
    $id: string;
    message_id: string;
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
}

interface MockSession {
    $id: string;
    userId: string;
    expire: string;
}

// Storage keys
const STORAGE_KEYS = {
    USERS: 'adventra_mock_users',
    PROFILES: 'adventra_mock_profiles',
    USER_RECORDS: 'adventra_mock_user_records',
    MATCHES: 'adventra_mock_matches',
    CONVERSATIONS: 'adventra_mock_conversations',
    MESSAGES: 'adventra_mock_messages',
    CURRENT_SESSION: 'adventra_mock_session',
};

// Helper to safely access localStorage (SSR-safe)
const getStorage = () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
};

// Generic storage helpers
function getFromStorage<T>(key: string, defaultValue: T[]): T[] {
    const storage = getStorage();
    if (!storage) return defaultValue;
    try {
        const data = storage.getItem(key);
        return data ? (JSON.parse(data) as T[]) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function saveToStorage<T>(key: string, data: T[]): void {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(key, JSON.stringify(data));
}

// Generate unique ID
export function generateId(): string {
    return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
}

// ============================================
// SEED DATA - Demo profiles for the brochure site
// ============================================

// Helper to create a full mock user with all required fields
function createFullMockUser(data: {
    $id: string;
    name: string;
    email: string;
    password: string;
}): MockUser {
    const now = '2024-01-01T00:00:00.000Z';
    return {
        $id: data.$id,
        $createdAt: now,
        $updatedAt: now,
        name: data.name,
        email: data.email,
        password: data.password,
        emailVerification: true,
        prefs: {},
        phone: '',
        phoneVerification: false,
        status: true,
        labels: [],
        passwordUpdate: now,
        registration: now,
        mfa: false,
        targets: [],
        accessedAt: now,
    };
}

const DEMO_USERS: MockUser[] = [
    createFullMockUser({
        $id: 'demo-user-1',
        name: 'Masom H',
        email: 'masom@demo.com',
        password: 'Demo123!',
    }),
];

const DEMO_USER_RECORDS: MockUserRecord[] = [
    {
        $id: 'demo-user-1',
        user_id: 'demo-user-1',
        name: 'Masom H',
        email: 'masom@demo.com',
        birthdate: '1990-01-01',
    },
];

const DEMO_PROFILES: MockProfile[] = [
    {
        $id: 'demo-user-1',
        user_id: 'demo-user-1',
        bio: null,
        adventure_preferences: null,
        skill_summary: null,
        profile_image_url: null,
        birthdate: '1990-01-01',
        instagram_url: null,
        facebook_url: null,
        dating_preferences: null,
    },
];

const DEMO_CONVERSATIONS: MockConversation[] = [];

const DEMO_MESSAGES: MockMessage[] = [];

const DEMO_MATCHES: MockMatch[] = [];

// ============================================
// DATA ACCESS FUNCTIONS
// ============================================

// Initialize mock data if not present
export function initializeMockData(): void {
    const storage = getStorage();
    if (!storage) return;

    // Only initialize if no data exists
    if (!storage.getItem(STORAGE_KEYS.USERS)) {
        saveToStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    }
    if (!storage.getItem(STORAGE_KEYS.USER_RECORDS)) {
        saveToStorage(STORAGE_KEYS.USER_RECORDS, DEMO_USER_RECORDS);
    }
    if (!storage.getItem(STORAGE_KEYS.PROFILES)) {
        saveToStorage(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
    }
    if (!storage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
        saveToStorage(STORAGE_KEYS.CONVERSATIONS, DEMO_CONVERSATIONS);
    }
    if (!storage.getItem(STORAGE_KEYS.MESSAGES)) {
        saveToStorage(STORAGE_KEYS.MESSAGES, DEMO_MESSAGES);
    }
    if (!storage.getItem(STORAGE_KEYS.MATCHES)) {
        saveToStorage(STORAGE_KEYS.MATCHES, DEMO_MATCHES);
    }
}

// Reset to demo data
export function resetMockData(): void {
    saveToStorage(STORAGE_KEYS.USERS, DEMO_USERS);
    saveToStorage(STORAGE_KEYS.USER_RECORDS, DEMO_USER_RECORDS);
    saveToStorage(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, DEMO_CONVERSATIONS);
    saveToStorage(STORAGE_KEYS.MESSAGES, DEMO_MESSAGES);
    saveToStorage(STORAGE_KEYS.MATCHES, DEMO_MATCHES);
    const storage = getStorage();
    if (storage) storage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
}

// ============================================
// USER / AUTH FUNCTIONS
// ============================================

export function getUsers(): MockUser[] {
    return getFromStorage<MockUser>(STORAGE_KEYS.USERS, DEMO_USERS);
}

export function getUserByEmail(email: string): MockUser | null {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): MockUser | null {
    const users = getUsers();
    return users.find(u => u.$id === id) || null;
}

export function createUser(data: {
    id: string;
    email: string;
    password: string;
    name: string;
}): MockUser {
    const users = getUsers();

    if (getUserByEmail(data.email)) {
        throw new Error('User with this email already exists');
    }

    const now = new Date().toISOString();
    const newUser: MockUser = {
        $id: data.id,
        $createdAt: now,
        $updatedAt: now,
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        emailVerification: true,
        prefs: {},
        phone: '',
        phoneVerification: false,
        status: true,
        labels: [],
        passwordUpdate: now,
        registration: now,
        mfa: false,
        targets: [],
        accessedAt: now,
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
}

// ============================================
// SESSION FUNCTIONS
// ============================================

export function getCurrentSession(): MockSession | null {
    const storage = getStorage();
    if (!storage) return null;
    try {
        const session = storage.getItem(STORAGE_KEYS.CURRENT_SESSION);
        return session ? (JSON.parse(session) as MockSession) : null;
    } catch {
        return null;
    }
}

export function createSession(userId: string): MockSession {
    const session: MockSession = {
        $id: generateId(),
        userId,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
    const storage = getStorage();
    if (storage) {
        storage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    }
    return session;
}

export function deleteSession(): void {
    const storage = getStorage();
    if (storage) {
        storage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
}

export function getCurrentUser(): MockUser | null {
    const session = getCurrentSession();
    if (!session) return null;
    return getUserById(session.userId);
}

// ============================================
// USER RECORDS (Database)
// ============================================

export function getUserRecords(): MockUserRecord[] {
    return getFromStorage<MockUserRecord>(STORAGE_KEYS.USER_RECORDS, DEMO_USER_RECORDS);
}

export function getUserRecordById(id: string): MockUserRecord | null {
    const records = getUserRecords();
    return records.find(r => r.user_id === id) || null;
}

export function createUserRecord(data: {
    user_id: string;
    name: string;
    email: string;
    birthdate?: string;
}): MockUserRecord {
    const records = getUserRecords();

    const newRecord: MockUserRecord = {
        $id: data.user_id,
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate || null,
    };

    records.push(newRecord);
    saveToStorage(STORAGE_KEYS.USER_RECORDS, records);
    return newRecord;
}

// ============================================
// PROFILES
// ============================================

export function getProfiles(): MockProfile[] {
    return getFromStorage<MockProfile>(STORAGE_KEYS.PROFILES, DEMO_PROFILES);
}

export function getProfileById(userId: string): MockProfile | null {
    const profiles = getProfiles();
    return profiles.find(p => p.user_id === userId) || null;
}

export function upsertProfile(data: Partial<MockProfile> & { user_id: string }): MockProfile {
    const profiles = getProfiles();
    const existingIndex = profiles.findIndex(p => p.user_id === data.user_id);

    const profile: MockProfile = {
        $id: data.user_id,
        user_id: data.user_id,
        bio: data.bio ?? null,
        adventure_preferences: data.adventure_preferences ?? null,
        skill_summary: data.skill_summary ?? null,
        profile_image_url: data.profile_image_url ?? null,
        birthdate: data.birthdate ?? null,
        instagram_url: data.instagram_url ?? null,
        facebook_url: data.facebook_url ?? null,
        dating_preferences: data.dating_preferences ?? null,
    };

    if (existingIndex >= 0) {
        profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
    } else {
        profiles.push(profile);
    }

    saveToStorage(STORAGE_KEYS.PROFILES, profiles);
    return profile;
}

// ============================================
// MATCHES
// ============================================

export function getMatches(): MockMatch[] {
    return getFromStorage<MockMatch>(STORAGE_KEYS.MATCHES, DEMO_MATCHES);
}

export function getMatchesForUser(userId: string): MockMatch[] {
    const matches = getMatches();
    return matches.filter(m => m.user_id === userId || m.matched_user_id === userId);
}

export function createMatch(data: {
    user_id: string;
    matched_user_id: string;
    status?: string;
}): MockMatch {
    const matches = getMatches();

    const newMatch: MockMatch = {
        $id: generateId(),
        user_id: data.user_id,
        matched_user_id: data.matched_user_id,
        status: data.status || 'pending',
        created_at: new Date().toISOString(),
    };

    matches.push(newMatch);
    saveToStorage(STORAGE_KEYS.MATCHES, matches);
    return newMatch;
}

// ============================================
// CONVERSATIONS
// ============================================

export function getConversations(): MockConversation[] {
    return getFromStorage<MockConversation>(STORAGE_KEYS.CONVERSATIONS, DEMO_CONVERSATIONS);
}

export function getConversationsForUser(userId: string): MockConversation[] {
    const conversations = getConversations();
    return conversations.filter(c => c.user_1_id === userId || c.user_2_id === userId);
}

export function getOrCreateConversation(user1: string, user2: string): MockConversation {
    const conversations = getConversations();
    const existing = conversations.find(
        c =>
            (c.user_1_id === user1 && c.user_2_id === user2) ||
            (c.user_1_id === user2 && c.user_2_id === user1),
    );

    if (existing) return existing;

    const newConvo: MockConversation = {
        $id: generateId(),
        conversation_id: generateId(),
        user_1_id: user1,
        user_2_id: user2,
        last_message_timestamp: new Date().toISOString(),
    };

    conversations.push(newConvo);
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
    return newConvo;
}

// ============================================
// MESSAGES
// ============================================

export function getMessages(): MockMessage[] {
    return getFromStorage<MockMessage>(STORAGE_KEYS.MESSAGES, DEMO_MESSAGES);
}

export function getMessagesForConversation(conversationId: string): MockMessage[] {
    const messages = getMessages();
    return messages
        .filter(m => m.conversation_id === conversationId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function sendMessage(data: {
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
}): MockMessage {
    const messages = getMessages();
    const conversations = getConversations();

    const newMessage: MockMessage = {
        $id: generateId(),
        message_id: generateId(),
        conversation_id: data.conversation_id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        created_at: new Date().toISOString(),
    };

    messages.push(newMessage);
    saveToStorage(STORAGE_KEYS.MESSAGES, messages);

    // Update conversation timestamp
    const convoIndex = conversations.findIndex(c => c.conversation_id === data.conversation_id);
    if (convoIndex >= 0) {
        conversations[convoIndex].last_message_timestamp = newMessage.created_at;
        saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
    }

    return newMessage;
}
