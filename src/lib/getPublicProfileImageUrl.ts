/**
 * Generates the public image URL for a user's profile photo stored in Appwrite Storage.
 *
 * @param userId - The user's ID.
 * @param options - Optional settings.
 * @param options.bustCache - If true, adds a timestamp to the URL.
 * @returns Full public URL to the image.
 */
export default function getPublicProfileImageUrl(
    userId: string | null | undefined,
    options: { bustCache?: boolean } = {},
): string {
    if (!userId || typeof userId !== 'string') return '';

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;
    const cacheBuster = options.bustCache ? `&t=${Date.now()}` : '';

    if (!endpoint || !projectId || !bucketId) return '';

    // Appwrite Storage URL format: {endpoint}/storage/buckets/{bucketId}/files/{fileId}/view?project={projectId}
    // Assuming file is named: user-{userId}.jpg
    const fileId = `user-${userId}.jpg`;

    return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}${cacheBuster}`;
}
