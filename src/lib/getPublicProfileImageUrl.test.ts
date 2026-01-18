import getPublicProfileImageUrl from './getPublicProfileImageUrl';

describe('getPublicProfileImageUrl', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            NEXT_PUBLIC_APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
            NEXT_PUBLIC_APPWRITE_PROJECT_ID: 'test-project-id',
            NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID: 'test-bucket-id',
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('Edge Cases', () => {
        test('returns empty string for null userId', () => {
            expect(getPublicProfileImageUrl(null)).toBe('');
        });

        test('returns empty string for undefined userId', () => {
            expect(getPublicProfileImageUrl(undefined)).toBe('');
        });

        test('returns empty string when env vars are missing', () => {
            process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT = '';
            expect(getPublicProfileImageUrl('user123')).toBe('');
        });
    });

    describe('URL Generation', () => {
        test('generates correct URL format', () => {
            const url = getPublicProfileImageUrl('user123');
            expect(url).toContain('cloud.appwrite.io/v1/storage/buckets');
            expect(url).toContain('test-bucket-id');
            expect(url).toContain('user-user123.jpg');
            expect(url).toContain('project=test-project-id');
        });

        test('includes cache buster when option provided', () => {
            const url = getPublicProfileImageUrl('user123', { bustCache: true });
            expect(url).toContain('&t=');
        });

        test('does not include cache buster by default', () => {
            const url = getPublicProfileImageUrl('user123');
            expect(url).not.toContain('&t=');
        });
    });
});
