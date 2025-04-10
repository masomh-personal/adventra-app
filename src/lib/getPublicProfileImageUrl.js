/**
 * Generates the public image URL for a user's profile photo stored in Supabase Storage.
 * @param {string} userId - The user's UUID.
 * @returns {string} - Full public URL to the image.
 */
export default function getPublicProfileImageUrl(userId) {
  if (!userId || typeof userId !== 'string') return '';
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  return `${baseUrl}/storage/v1/object/public/${bucket}/user-${userId}.jpg`;
}
