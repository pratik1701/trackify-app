# Trackify Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/trackify"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your database:**
   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in your `.env.local` file

3. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
   - Copy the Client ID and Client Secret to your `.env.local` file

4. **Generate NextAuth secret:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output to `NEXTAUTH_SECRET` in your `.env.local` file

5. **Run database migrations:**
   ```bash
   npx prisma db push
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features

- ✅ User authentication with Google OAuth
- ✅ Protected dashboard route
- ✅ Add new subscriptions with form validation
- ✅ View subscription list with status indicators
- ✅ Monthly and yearly spend calculations
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time data updates with SWR
- ✅ TypeScript support

## Next Steps

After the basic setup is working, you can add:
- Monthly spend summary charts (Recharts)
- Category filters
- Calendar view of upcoming subscriptions
- Edit and delete subscription functionality
- Email notifications for upcoming payments 