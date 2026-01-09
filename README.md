<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Woo5G10eK6K0SbIHKQOms07tvUvU5Xyg


## Setup Guide (For New Store Owners)

This theme requires a **Supabase** backend to store your products and settings. Follow these steps to link your own database:

### 1. Create a Supabase Project
1. Go to [database.new](https://database.new) and create a new project.
2. Once created, go to **Project Settings** > **API**.
3. Copy your `Project URL` and `anon` public key.

### 2. Configure Environment Variables
1. Creating a file named `.env` in the root directory (copy `.env.example`).
2. Add your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_KEY=your-anon-key-here
   ```

### 3. Run the App
1. Install dependencies:
   `npm install`
2. Run the development server:
   `npm run dev`


### 4. Image Handling
The theme handles images automatically. You do **NOT** need to set up a storage bucket.
- Images are automatically compressed (optimized for web) and stored directly in your database.
- You can also paste external Image URLs (like from Unsplash) directly into the product form.

