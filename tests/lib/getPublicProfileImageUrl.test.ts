import getPublicProfileImageUrl from '@/lib/getPublicProfileImageUrl';

describe('getPublicProfileImageUrl', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        // Set up test env vars
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
        process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID = 'test-project';
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID = 'profile-images';
    });

    afterEach(() => {
        // Restore original env
        process.env = { ...originalEnv };
    });

    it('returns empty string when userId is null', () => {
        const result = getPublicProfileImageUrl(null);
        expect(result).toBe('');
    });

    it('returns empty string when userId is undefined', () => {
        const result = getPublicProfileImageUrl(undefined);
        expect(result).toBe('');
    });

    it('returns empty string when userId is empty string', () => {
        const result = getPublicProfileImageUrl('');
        expect(result).toBe('');
    });

    it('returns empty string when endpoint is missing', () => {
        delete process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const result = getPublicProfileImageUrl('user-123');
        expect(result).toBe('');
    });

    it('returns empty string when projectId is missing', () => {
        delete process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const result = getPublicProfileImageUrl('user-123');
        expect(result).toBe('');
    });

    it('returns empty string when bucketId is missing', () => {
        delete process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;
        const result = getPublicProfileImageUrl('user-123');
        expect(result).toBe('');
    });

    it('returns correct URL for valid userId', () => {
        const result = getPublicProfileImageUrl('user-123');
        expect(result).toBe(
            'https://cloud.appwrite.io/v1/storage/buckets/profile-images/files/user-user-123.jpg/view?project=test-project',
        );
    });

    it('adds cache buster when bustCache is true', () => {
        const now = Date.now();
        vi.spyOn(Date, 'now').mockReturnValue(now);

        const result = getPublicProfileImageUrl('user-123', { bustCache: true });
        expect(result).toBe(
            `https://cloud.appwrite.io/v1/storage/buckets/profile-images/files/user-user-123.jpg/view?project=test-project&t=${now}`,
        );

        vi.restoreAllMocks();
    });

    it('does not add cache buster when bustCache is false', () => {
        const result = getPublicProfileImageUrl('user-123', { bustCache: false });
        expect(result).toBe(
            'https://cloud.appwrite.io/v1/storage/buckets/profile-images/files/user-user-123.jpg/view?project=test-project',
        );
    });

    it('does not add cache buster when options is empty object', () => {
        const result = getPublicProfileImageUrl('user-123', {});
        expect(result).toBe(
            'https://cloud.appwrite.io/v1/storage/buckets/profile-images/files/user-user-123.jpg/view?project=test-project',
        );
    });
});
