# Supabase Configuration Guide

## Required Setup for Image Display

### 1. Make Storage Bucket Public

For images to display properly in the frontend, the `event-posters` bucket must be configured as **public**.

#### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - You should see the `event-posters` bucket

3. **Make Bucket Public**
   - Click on the `event-posters` bucket
   - Click the **Settings** icon (gear icon) or **Configuration**
   - Find the **Public bucket** toggle
   - **Enable** "Public bucket"
   - Save changes

### 2. Configure Server Environment

Ensure your server is using the correct Supabase key:

1. **Get Service Role Key** (for server-side operations)
   - In Supabase Dashboard → Settings → API
   - Copy the **service_role** key (NOT the anon key)

2. **Update Server .env File**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_service_role_key_here
   JWT_SECRET=your_jwt_secret
   ```

3. **Restart Server**
   ```bash
   cd server
   npm run dev
   ```

### 3. Verify Image URLs

After making the bucket public:

1. **Upload a new event image** through the admin panel
2. **Check the database** - the `poster_url` field should contain:
   ```
   https://your-project.supabase.co/storage/v1/object/public/event-posters/filename.png
   ```
3. **Open the URL in a browser** - you should see the image (no 404 or "Bucket not found")

### Troubleshooting

#### Images Still Not Displaying?

1. **Check Bucket is Public**
   - Storage → event-posters → Settings
   - Verify "Public bucket" is enabled

2. **Verify Server Key**
   - Make sure `SUPABASE_KEY` in server `.env` is the **service_role** key
   - Restart the server after changing

3. **Check URL Format**
   - Public URLs should contain `/object/public/` in the path
   - Example: `https://xyz.supabase.co/storage/v1/object/public/event-posters/123.png`

4. **Test Direct Access**
   - Copy a `poster_url` from the database
   - Paste it directly in browser
   - If you see the image → frontend should work
   - If you see 404 or error → bucket might not be public

#### Alternative: Keep Bucket Private

If you want to keep the bucket private (more secure but more complex):

1. You'll need to implement signed URL generation
2. Signed URLs expire (typically 1 hour)
3. Not recommended unless you have specific security requirements

### Current Setup (Simplified)

The application is now configured to use **public URLs only** for simplicity:

- ✅ Server uploads to `event-posters` bucket
- ✅ Server returns public URL
- ✅ Frontend displays image directly using `<img src={event.poster_url} />`
- ✅ No signed URLs or complex fallback logic

This works perfectly when the bucket is set to **public**.
