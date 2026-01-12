# Appwrite Setup & Implementation Guide

This guide covers everything you need to know about using Appwrite in the Adventra project, including setup, configuration, and implementation details.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Appwrite Console Setup](#appwrite-console-setup)
3. [Environment Variables](#environment-variables)
4. [Implementation Overview](#implementation-overview)
5. [Development Workflow](#development-workflow)

---

## Quick Start

If you're setting up for the first time:

1. **Set up your Appwrite project** (see [Appwrite Console Setup](#appwrite-console-setup))
2. **Create `.env.local`** from `.env.example` and fill in your values (see [Environment Variables](#environment-variables))
3. **Install dependencies**: `npm install`
4. **Run the app**: `npm run dev`

---

## Appwrite Console Setup

### Step 1: Create Database

1. In Appwrite Console, navigate to your project
2. Go to **Databases** section
3. Click **Create Database**
4. Name: `adventra-db` (or your preferred name)
5. Note the Database ID (you'll need it for environment variables)

### Step 2: Create Collections

Create the following collections in your database:

#### Collection: `user`

**Attributes:**

- `user_id` (string, 255, required, unique) - Primary key
- `name` (string, 255, required)
- `email` (string, 255, required, unique)

**Indexes:**

- `user_id` (unique)
- `email` (unique)

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

#### Collection: `userprofile`

**Attributes:**

- `user_id` (string, 255, required, unique) - Primary key, references `user.user_id`
- `bio` (string, 5000, optional)
- `adventure_preferences` (string[], optional)
- `skill_summary` (string, 10000, optional) - JSON stored as string
- `profile_image_url` (string, 500, optional)
- `birthdate` (string, 10, optional) - ISO date format
- `instagram_url` (string, 500, optional)
- `facebook_url` (string, 500, optional)
- `dating_preferences` (string, 50, optional)

**Indexes:**

- `user_id` (unique)

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

#### Collection: `profiles`

**Attributes:**

- `id` (string, 255, required, unique) - Primary key
- `full_name` (string, 255, optional)
- `created_at` (datetime, optional)

**Indexes:**

- `id` (unique)

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

#### Collection: `matches`

**Attributes:**

- `user_id` (string, 255, required) - References `user.user_id`
- `matched_user_id` (string, 255, required) - References `user.user_id`
- `status` (string, 50, optional)
- `created_at` (datetime, optional)

**Indexes:**

- `user_id`
- `matched_user_id`
- Composite: `user_id` + `matched_user_id` (unique)

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

#### Collection: `messages`

**Attributes:**

- `message_id` (string, 255, required, unique) - Primary key
- `sender_id` (string, 255, required) - References `user.user_id`
- `receiver_id` (string, 255, required) - References `user.user_id`
- `content` (string, 10000, required)
- `conversation_id` (string, 255, optional)
- `created_at` (datetime, optional)

**Indexes:**

- `message_id` (unique)
- `sender_id`
- `receiver_id`
- `conversation_id`

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

#### Collection: `conversations`

**Attributes:**

- `conversation_id` (string, 255, required, unique) - Primary key
- `user_1_id` (string, 255, required) - References `user.user_id`
- `user_2_id` (string, 255, required) - References `user.user_id`
- `last_message_timestamp` (datetime, optional)

**Indexes:**

- `conversation_id` (unique)
- `user_1_id`
- `user_2_id`

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

### Step 3: Create Storage Bucket

1. Go to **Storage** section in Appwrite Console
2. Click **Create Bucket**
3. Name: `member_pictures`
4. Bucket ID: `member_pictures`
5. Note the Bucket ID (you'll need it for environment variables)

**Bucket Settings:**

- File size limit: 5 MB (adjust as needed)
- Allowed file extensions: `jpg`, `jpeg`, `png`, `gif`, `webp`
- Encryption: Enabled
- Compression: Enabled (optional)

**Permissions:**

- Read: Users (any)
- Create: Users (any)
- Update: Users (any)
- Delete: Users (any)

### Step 4: Configure Authentication

1. Go to **Auth** section in Appwrite Console
2. Enable **Email/Password** authentication
3. Enable **Magic URL** (for magic link login)
4. Configure email templates if needed
5. Set up allowed redirect URLs:
    - `http://localhost:3000/dashboard` (development)
    - `http://localhost:3000/auth/callback` (for magic links)
    - `https://your-domain.com/dashboard` (production)
    - `https://your-domain.com/auth/callback` (production)

### Step 5: Create API Key

1. Go to **Settings** > **API Keys** in Appwrite Console
2. Click **Create API Key**
3. Give it a name (e.g., "Server API Key")
4. **Scopes**: Select all necessary scopes:
    - ✅ Databases (read, write)
    - ✅ Storage (read, write)
    - ✅ Users (read, write)
5. **IMPORTANT**: Copy the API key immediately - it won't be shown again!

---

## Environment Variables

### Required Variables

Create a `.env.local` file in the root of your project (copy from `.env.example`):

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=member_pictures
APPWRITE_API_KEY=your-api-key
```

### Where to Find These Values

| Variable                                 | Location in Appwrite Console                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT`          | Usually `https://cloud.appwrite.io/v1` (or your self-hosted URL). Check Project Settings > API endpoint |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID`        | Project Settings > Project ID                                                                           |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID`       | Databases > Your Database > Settings > Database ID                                                      |
| `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID` | Storage > Your Bucket > Settings > Bucket ID                                                            |
| `APPWRITE_API_KEY`                       | Settings > API Keys > Your key (create one if needed)                                                   |

### Important Notes

- `.env.local` is gitignored (won't be committed)
- Use different values for development, staging, and production
- For production (Vercel), add these as environment variables in Vercel dashboard
- The `NEXT_PUBLIC_` prefix makes variables available to the browser
- Variables without `NEXT_PUBLIC_` are server-side only (like `APPWRITE_API_KEY`)
- **Never commit** your actual API key to git!

---

## Implementation Overview

### Architecture

Our Appwrite implementation follows best practices:

#### Client-Side (`src/lib/appwriteClient.ts`)

- Uses `Client().setEndpoint().setProject()`
- No API key (correct for client-side)
- Exports: `account`, `databases`, `storage` services
- Used in: React components, client-side pages

#### Server-Side (`src/lib/appwriteServer.ts`)

- Uses `Client().setEndpoint().setProject().setKey()`
- Includes API key (correct for server-side)
- Same service exports as client
- Used in: API routes, server-side functions

### Key Features

#### Authentication

- ✅ Email/Password signup and login
- ✅ Magic link authentication
- ✅ Session management
- ✅ Protected routes (HOC: `withAuth`)

#### Database Operations

- ✅ Document creation (`createDocument`)
- ✅ Document reading (`getDocument`, `listDocuments`)
- ✅ Document updates (`updateDocument`)
- ✅ Queries with `Query` helpers
- ✅ Upsert pattern (try update, create if fails)

#### Storage

- ✅ Public URL generation for profile images
- ⚠️ File uploads (implemented in `edit-profile.tsx` - see TODOs)

### Collection IDs

Collection IDs are defined in `src/types/appwrite.ts`:

```typescript
export const COLLECTION_IDS = {
    USER: 'user',
    USERPROFILE: 'userprofile',
    PROFILES: 'profiles',
    MATCHES: 'matches',
    MESSAGES: 'messages',
    CONVERSATIONS: 'conversations',
} as const;
```

These must match the collection IDs you create in the Appwrite Console.

---

## Development Workflow

### First Time Setup

1. **Create Appwrite project** in Appwrite Console
2. **Set up database and collections** (follow Step 2 above)
3. **Create storage bucket** (follow Step 3 above)
4. **Configure authentication** (follow Step 4 above)
5. **Create API key** (follow Step 5 above)
6. **Copy `.env.example` to `.env.local`** and fill in values
7. **Install dependencies**: `npm install`
8. **Run dev server**: `npm run dev`

### Running Locally

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# App will be available at http://localhost:3000
```

### Common Tasks

#### Clean Install

If you need to start fresh with dependencies:

```bash
npm run clean:deep
```

This removes `node_modules`, clears npm cache, and reinstalls everything.

#### Type Checking

```bash
npm run type-check
```

#### Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

---

## Important Notes

### Appwrite vs Supabase Differences

1. **No SQL joins**: Appwrite doesn't support SQL-like joins. Fetch related data separately and combine in application code.

2. **Document IDs**: Appwrite uses document IDs (usually auto-generated UUIDs). For user collections, we use `user_id` as the document ID for 1:1 relationships.

3. **Permissions**: Set permissions in the Appwrite Console for each collection and bucket.

4. **Queries**: Use Appwrite's `Query` helpers instead of SQL:
    - `Query.equal()`, `Query.notEqual()`
    - `Query.orderAsc()`, `Query.orderDesc()`
    - `Query.limit()`, `Query.offset()`
    - `Query.or()`, `Query.and()`

### Storage File Uploads

Profile image uploads are partially implemented. To complete:

1. Use `storage.createFile()` in `edit-profile.tsx`
2. Set appropriate permissions
3. Update `profile_image_url` after successful upload

Example pattern:

```typescript
await storage.createFile(bucketId, `user-${userId}.jpg`, file, [
    Permission.read(Role.any()),
    Permission.write(Role.users()),
]);
```

---

## Troubleshooting

### Common Issues

1. **"Missing Appwrite environment variables"**
    - Check that `.env.local` exists and has all required variables
    - Restart dev server after changing `.env.local`

2. **Authentication errors**
    - Verify redirect URLs are configured in Appwrite Console
    - Check that Email/Password or Magic URL is enabled in Auth settings

3. **Database errors**
    - Verify collection IDs match between code and Console
    - Check that permissions are set correctly
    - Ensure attributes match the schema

4. **Storage errors**
    - Verify bucket ID matches environment variable
    - Check bucket permissions
    - Verify file size and extension restrictions

---

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite SDK for JavaScript](https://appwrite.io/docs/sdks/javascript)
- [Appwrite Console](https://cloud.appwrite.io)
