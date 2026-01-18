// Shared Appwrite mock utilities for tests
// vi is globally available via vitest/globals

// Mock user data factory
export const createMockUser = (overrides = {}) => ({
    $id: 'user-123',
    $createdAt: '2024-01-01T00:00:00.000Z',
    $updatedAt: '2024-01-01T00:00:00.000Z',
    name: 'Test User',
    email: 'test@example.com',
    phone: '',
    emailVerification: true,
    phoneVerification: false,
    prefs: {},
    ...overrides,
});

// Mock account functions
export const mockAccountGet = vi.fn();
export const mockAccountDeleteSession = vi.fn();
export const mockAccountCreateEmailSession = vi.fn();
export const mockAccountCreateMagicURLSession = vi.fn();
export const mockAccountCreate = vi.fn();

// Mock database functions
export const mockDatabasesCreateDocument = vi.fn();
export const mockDatabasesGetDocument = vi.fn();
export const mockDatabasesListDocuments = vi.fn();
export const mockDatabasesUpdateDocument = vi.fn();
export const mockDatabasesDeleteDocument = vi.fn();

// Mock storage functions
export const mockStorageGetFilePreview = vi.fn();

// Reset all mocks helper
export const resetAllAppwriteMocks = () => {
    mockAccountGet.mockReset();
    mockAccountDeleteSession.mockReset();
    mockAccountCreateEmailSession.mockReset();
    mockAccountCreateMagicURLSession.mockReset();
    mockAccountCreate.mockReset();
    mockDatabasesCreateDocument.mockReset();
    mockDatabasesGetDocument.mockReset();
    mockDatabasesListDocuments.mockReset();
    mockDatabasesUpdateDocument.mockReset();
    mockDatabasesDeleteDocument.mockReset();
    mockStorageGetFilePreview.mockReset();
};

// Factory to create the appwriteClient mock
export const createAppwriteClientMock = () => ({
    account: {
        get: mockAccountGet,
        deleteSession: mockAccountDeleteSession,
        createEmailSession: mockAccountCreateEmailSession,
        createMagicURLSession: mockAccountCreateMagicURLSession,
        create: mockAccountCreate,
    },
    databases: {
        createDocument: mockDatabasesCreateDocument,
        getDocument: mockDatabasesGetDocument,
        listDocuments: mockDatabasesListDocuments,
        updateDocument: mockDatabasesUpdateDocument,
        deleteDocument: mockDatabasesDeleteDocument,
    },
    storage: {
        getFilePreview: mockStorageGetFilePreview,
    },
    databaseId: 'test-database-id',
});
