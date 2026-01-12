import { Client, Account, Databases, Storage } from 'appwrite';

// Environment variables for server-side API key
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !databaseId || !apiKey) {
    throw new Error('Missing Appwrite environment variables for the server.');
}

// Initialize Appwrite client with API key (server-side only)
const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client, databaseId);
export const storage = new Storage(client);

// Export client for custom use cases
export default client;
