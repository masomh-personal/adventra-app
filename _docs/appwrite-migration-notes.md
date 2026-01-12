# Appwrite Migration Notes

## Remaining Work

The migration from Supabase to Appwrite is largely complete. However, the following files still need updates:

1. **src/pages/edit-profile.tsx**
    - Still uses Supabase Storage API for image uploads (lines 112-119)
    - Still uses Supabase Database API directly (lines 131-134, 161-182)
    - Still uses Supabase Auth for signOut (line 229)
    - Should be updated to use:
        - Appwrite Storage API for image uploads
        - profilesService.upsertProfile() for database operations (already migrated)
        - account.deleteSession() for logout

2. **Test Files**
    - All test files in `tests/` directory need to be updated to mock Appwrite SDK instead of Supabase
    - This is marked as a separate todo item

## Implementation Notes

- Appwrite Storage bucket ID is stored in `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID`
- Storage uploads should use `storage.createFile()` method
- For profile images, the file ID should match the pattern: `user-${userId}.jpg`

## Quick Fix for edit-profile.tsx

The edit-profile page needs these updates:

1. Import `storage` from `@/lib/appwriteClient`
2. Import `upsertProfile` from `@/services/profilesService`
3. Import `account` from `@/lib/appwriteClient` for logout
4. Replace `supabase.storage.from().upload()` with `storage.createFile()`
5. Replace `supabase.from('userprofile').upsert()` with `upsertProfile()`
6. Replace `supabase.auth.signOut()` with `account.deleteSession('current')`
