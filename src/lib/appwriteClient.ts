import { Client, Account, Databases, Storage } from 'appwrite';

// Environment variables for public keys (client-side)
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!endpoint || !projectId || !databaseId) {
    throw new Error('Missing Appwrite environment variables for the client.');
}

// Initialize Appwrite client
const client = new Client().setEndpoint(endpoint).setProject(projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client, databaseId);
export const storage = new Storage(client);

// Export client for custom use cases
export default client;
