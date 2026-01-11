/**
 * Generates the public image URL for a user's profile photo stored in Supabase Storage.
 *
 * @param userId - The user's UUID.
 * @param options - Optional settings.
 * @param options.bustCache - If true, adds a timestamp to the URL.
 * @returns Full public URL to the image.
 */
export default function getPublicProfileImageUrl(
    userId: string | null | undefined,
    options: { bustCache?: boolean } = {},
): string {
    if (!userId || typeof userId !== 'string') return '';

    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
    const cacheBuster = options.bustCache ? `?t=${Date.now()}` : '';

    if (!baseUrl || !bucket) return '';

    return `${baseUrl}/storage/v1/object/public/${bucket}/user-${userId}.jpg${cacheBuster}`;
}
