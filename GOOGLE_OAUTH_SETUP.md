# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for the Society Fintech application.

## Overview

The Google OAuth feature allows users (Admin, Resident, Security) to log in using their Google account. This provides a seamless and secure login experience without requiring password management.

## Features

✅ One-click Google login  
✅ Role-based authentication (Admin, Resident, Security)  
✅ Automatic dashboard redirect based on user role  
✅ Professional "Continue with Google" button  
✅ Error handling and user-friendly messages  
✅ Email verification (uses verified Google email)  

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: `Society Fintech` (or your preferred name)
5. Click "Create"

### 2. Enable Google Identity Services API

1. In the Google Cloud Console, search for "Google Identity Services"
2. Click on it and enable the API
3. You may also need to enable the "OAuth 2.0" API

### 3. Create OAuth 2.0 Credentials

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application" as the application type
4. Under "Authorized JavaScript origins", add:
   - `http://localhost:5174` (for local development with Vite)
   - `http://localhost:5173` (alternative port)
   - Your production domain (e.g., `https://yourdomain.com`)

5. Under "Authorized redirect URIs", add:
   - `http://localhost:5174` (for local development)
   - `http://localhost:3000` (for your backend)
   - Your production URLs

6. Click "Create"
7. A popup will show your "Client ID" - copy this value

### 4. Add Client ID to Frontend .env

1. Navigate to `frontend/` directory
2. Open the `.env` file
3. Add your Google Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```
   Replace `your_client_id_here` with the Client ID from step 3.

4. Save the file

### 5. Restart Frontend Server

1. Stop the current frontend server (Ctrl+C)
2. Restart with: `npm run dev`

## How It Works

### Login Flow

1. **User selects role** (Admin, Resident, or Security) using the tabs
2. **User clicks "Continue with Google"** button
3. **Google popup opens** for user to sign in with their Gmail account
4. **Backend validates** the Google token and checks if the email exists in the system
5. **If user exists**: User is logged in with their role from the database
6. **If user doesn't exist**: Error message shows "This Google account is not registered. Please contact admin."
7. **User is redirected** to the appropriate dashboard (Admin, Resident, or Security)

### Security Features

- ✅ Google JWT tokens are verified on the backend
- ✅ Only registered users can log in via Google
- ✅ User roles are determined from the database, not from client selection
- ✅ Sessions are created with proper authentication
- ✅ No passwords are stored for Google logins
- ✅ Google user ID and email are stored for audit trails

## User Registration for Google OAuth

Important: Users must be registered in the database BEFORE they can use Google login.

### Admin Registration

1. An existing admin must:
   - Log in to Admin Dashboard
   - Go to "Residents Management"
   - Add a new admin user with their Gmail address and a temporary password

2. The new admin can then log in with Google using their Gmail address

### Resident Registration

1. Admin must first:
   - Create the resident in the system with their Gmail address
   - Assign them to their flat
   - Set temporary password

2. The resident can then use Google login with their Gmail address

### Security Registration

1. Admin must:
   - Register security personnel with their Gmail address
   - Set temporary password

2. Security can then use Google login

## Troubleshooting

### Issue: "Client ID not found" error

**Solution**: Make sure `.env` file in the `frontend/` directory contains:
```
VITE_GOOGLE_CLIENT_ID=your_actual_client_id
```

### Issue: "This Google account is not registered"

**Possible causes**:
- The email used in Google account is NOT in the database
- The user account in the database is marked as inactive
- The email in database doesn't match the Google account email exactly (case-sensitive)

**Solution**:
1. Log in as Admin
2. Go to "Residents Management"
3. Ensure the user is added with the EXACT email from their Google account
4. Make sure the account status is "Active"

### Issue: CORS errors in browser console

**Solution**: Make sure the backend server is running and CORS is properly configured:
1. Backend running on `http://localhost:3000`
2. Frontend running on `http://localhost:5174`
3. Check that both servers are started

### Issue: Google button not appearing

**Possible causes**:
- Missing `VITE_GOOGLE_CLIENT_ID` in `.env`
- Frontend not restarted after adding Client ID
- Google Client ID is invalid

**Solution**:
1. Check `.env` file has correct Client ID
2. Restart frontend: `npm run dev`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Issue: "Server error during Google authentication"

**Solution**:
1. Check backend console for error messages
2. Verify Supabase connection is working
3. Ensure user exists in the database
4. Check backend is running: `npm start` from `backend/` directory

## Testing

### Test with Demo Account

Although demo accounts are for manual login, you can test Google OAuth by:

1. **Add a Google-linked account** in the database:
   - Use an email from your Google account
   - Register it as a test user (admin, resident, or security)

2. **Click "Continue with Google"**:
   - Select the same role as the database user
   - Sign in with your Gmail account
   - You should be redirected to the correct dashboard

### Test Error Handling

1. **Try with unregistered email**:
   - Click "Continue with Google"
   - Sign in with an email NOT in the database
   - Should see: "This Google account is not registered. Please contact admin."

2. **Try with cancelled login**:
   - Click "Continue with Google"
   - Close the Google popup without signing in
   - Error message should appear: "Google login cancelled or failed"

## Production Deployment

When deploying to production:

1. **Add production domains** to Google Cloud Console:
   - Add your production domain to Authorized JavaScript origins
   - Add callback URLs to Authorized redirect URIs

2. **Update environment variables**:
   ```
   VITE_GOOGLE_CLIENT_ID=your_production_client_id
   VITE_API_URL=https://yourdomain.com/api
   ```

3. **Update backend CORS settings** in `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
     credentials: true
   }));
   ```

## Security Best Practices

1. ✅ Never commit `.env` file to version control (already in .gitignore)
2. ✅ Use environment variables for sensitive data
3. ✅ Regularly rotate session secrets in production
4. ✅ Keep Google OAuth tokens secure
5. ✅ Monitor failed login attempts
6. ✅ Ensure HTTPS in production (required by Google)

## Support

For issues or questions:

1. Check Google Cloud Console for Client ID validity
2. Review backend server logs for authentication errors
3. Check browser console (F12) for frontend errors
4. Verify database has the user registered with correct email

## Additional Resources

- [Google Identity Documentation](https://developers.google.com/identity)
- [Google OAuth 2.0 Flow](https://developers.google.com/identity/protocols/oauth2)
- [React Google Login Library](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
