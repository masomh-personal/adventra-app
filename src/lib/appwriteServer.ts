/**
 * Appwrite Server Client
 *
 * This module exports the Appwrite server client with API key authentication.
 * In demo mode, it uses the same mock client as the regular client.
 */

// Check if we should use mock mode
const useMockMode =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ||
    !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
    !process.env.APPWRITE_API_KEY;

// Export database ID (mock or real)
export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'mock-database';

// Conditional exports based on mode

let account: any;

let databases: any;

let storage: any;

if (useMockMode) {
    // Use mock client (same as client-side in demo mode)
    console.warn('🎭 Server running in DEMO MODE - using mock data');

    const mockClient = require('./mockAppwriteClient');
    account = mockClient.mockAccount;
    databases = mockClient.mockDatabases;
    storage = mockClient.mockStorage;
} else {
    // Use real Appwrite server client
    const { Client, Account, Databases, Storage } = require('appwrite');

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
        throw new Error('Appwrite endpoint, project ID, and API key are required');
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

    account = new Account(client);
    databases = new Databases(client, databaseId);
    storage = new Storage(client);
}

export { account, databases, storage };

// Default export for backwards compatibility
const appwriteServer = { account, databases, storage };
export default appwriteServer;
