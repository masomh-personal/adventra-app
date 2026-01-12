# Appwrite Setup Guide

This guide walks through setting up Appwrite infrastructure to replace Supabase.

## Prerequisites

- Appwrite account (already signed up)
- Access to Appwrite Console

## Step 1: Create Database

1. In Appwrite Console, navigate to your project
2. Go to **Databases** section
3. Click **Create Database**
4. Name: `adventra-db` (or your preferred name)
5. Note the Database ID (you'll need it for environment variables)

## Step 2: Create Collections

Create the following collections in your database:

### Collection: `user`

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

### Collection: `userprofile`

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

### Collection: `profiles`

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

### Collection: `matches`

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

### Collection: `messages`

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

### Collection: `conversations`

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

## Step 3: Create Storage Bucket

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

## Step 4: Configure Authentication

1. Go to **Auth** section in Appwrite Console
2. Enable **Email/Password** authentication
3. Enable **Magic URL** (for magic link login)
4. Configure email templates if needed
5. Set up allowed redirect URLs:
    - `http://localhost:3000/dashboard` (development)
    - `https://your-domain.com/dashboard` (production)

## Step 5: Get API Keys

1. Go to **Settings** > **API Keys**
2. Create a new API Key (for server-side use)
3. Give it a name (e.g., "Server API Key")
4. Scopes: Select all necessary scopes (Databases, Storage, Users)
5. **IMPORTANT**: Copy the API key immediately - it won't be shown again

## Step 6: Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=member_pictures
APPWRITE_API_KEY=your-api-key
```

**Where to find these values:**

- `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Usually `https://cloud.appwrite.io/v1` (or your self-hosted endpoint)
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: Project Settings > Project ID
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`: Databases > Your database > Settings > Database ID
- `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID`: Storage > Your bucket > Settings > Bucket ID
- `APPWRITE_API_KEY`: Settings > API Keys > Your key

## Notes

- Appwrite uses collections instead of tables (similar structure)
- Appwrite doesn't support SQL joins - relationships must be handled in application code
- Appwrite uses document IDs (usually auto-generated UUIDs) - you may need to use custom IDs for `user_id` references
- Permissions can be more granular than shown here - adjust based on your security requirements
