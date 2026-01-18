/**
 * Appwrite Client
 *
 * This module exports the Appwrite client and services.
 * In demo mode (when NEXT_PUBLIC_USE_MOCK_DATA=true or no Appwrite env vars),
 * it uses mock data stored in localStorage instead of a real backend.
 */

// Check if we should use mock mode
const useMockMode =
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' ||
    !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

// Export database ID (mock or real)
export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'mock-database';

// Use 'any' type to avoid union type issues between mock and real SDK

let account: any;

let databases: any;

let storage: any;

if (useMockMode) {
    // Use mock client
    console.warn('🎭 Running in DEMO MODE - using mock data (no real backend)');

    // Dynamic import to avoid loading Appwrite SDK when not needed
    const mockClient = require('./mockAppwriteClient');
    account = mockClient.mockAccount;
    databases = mockClient.mockDatabases;
    storage = mockClient.mockStorage;
} else {
    // Use real Appwrite client
    const { Client, Account, Databases, Storage } = require('appwrite');

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

    if (!endpoint || !projectId) {
        throw new Error('Appwrite endpoint and project ID are required');
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId);

    account = new Account(client);
    databases = new Databases(client, databaseId);
    storage = new Storage(client);
}

export { account, databases, storage };

// Default export for backwards compatibility
const appwriteClient = { account, databases, storage };
export default appwriteClient;
