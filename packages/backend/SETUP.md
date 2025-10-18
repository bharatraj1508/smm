# Gmail Summarizer API - OAuth Setup Guide

## 🚀 Quick Start

This guide will help you set up the Gmail Summarizer API with OAuth 2.0 authentication.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console account
- Git

## 🔧 Installation

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**

   ```bash
   cp env.template .env
   ```

   Edit `.env` file with your actual values (see Configuration section below).

3. **Start MongoDB:**

   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud)
   # Just update MONGODB_URI in .env
   ```

4. **Start the server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## ⚙️ Configuration

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3002/auth/google/callback`
5. Copy Client ID and Client Secret to your `.env` file

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
# Required
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Optional (with defaults)
PORT=3002
MONGODB_URI=YOUR_MONGO_URI
JWT_SECRET=your_super_secure_jwt_secret_key_here
ENCRYPTION_KEY=your_32_character_encryption_key_here
SESSION_SECRET=your_super_secure_session_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### 3. Generate Secure Keys

For production, generate secure random keys:

```bash
# Generate JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate encryption key (exactly 32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔐 Authentication Flow

### 1. User Login

```
GET /auth/google
```

- Redirects user to Google OAuth
- User authorizes the application
- Google redirects back with authorization code

### 2. OAuth Callback

```
GET /auth/google/callback
```

- Exchanges authorization code for access/refresh tokens
- Stores user data and tokens in database
- Generates JWT token
- Redirects to frontend with token

### 3. Access Protected Endpoints

```
Authorization: Bearer <jwt_token>
```

## 📡 API Endpoints

### Public Endpoints

- `GET /` - API documentation
- `GET /api/gmail/health` - Health check
- `GET /api/gmail/test` - Test endpoint
- `GET /auth/health` - Auth service health
- `GET /auth/google` - Initiate OAuth login

### Protected Endpoints (require JWT token)

- `GET /auth/me` - Get user profile
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/verify` - Verify JWT token
- `GET /api/gmail/labels` - Get Gmail labels
- `GET /api/gmail/labels/:labelId` - Get specific label
- `GET /api/gmail/emails` - Get emails
- `GET /api/gmail/emails/:emailId` - Get specific email

## 🧪 Testing the API

### 1. Test Authentication

```bash
# Visit in browser
http://localhost:3002/auth/google
```

### 2. Test Protected Endpoints

```bash
# Get JWT token from OAuth callback, then:
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3002/api/gmail/labels
```

### 3. Test with Frontend

```javascript
// Frontend JavaScript example
const token = "your_jwt_token_here";

fetch("http://localhost:3002/api/gmail/labels", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  googleId: String (unique),
  accessToken: String (encrypted),
  refreshToken: String (encrypted),
  tokenExpiry: Date,
  profilePicture: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Token Encryption**: Access and refresh tokens are encrypted in database
- **JWT Authentication**: Secure session management
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Session Security**: HTTP-only cookies, secure in production
- **Token Refresh**: Automatic token refresh when expired

## 🚨 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check Google OAuth credentials
   - Verify redirect URI matches exactly
   - Ensure Gmail API is enabled

2. **"Database connection failed"**
   - Check MongoDB is running
   - Verify MONGODB_URI is correct
   - Check network connectivity

3. **"Token is invalid or expired"**
   - User needs to re-authenticate
   - Check JWT_SECRET is set correctly

4. **"CORS error"**
   - Add your frontend URL to CORS origins
   - Check FRONTEND_URL environment variable

### Debug Mode

```bash
NODE_ENV=development npm run dev
```

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB is running and accessible

## 🔄 Migration from Local Auth

If you're migrating from the previous local authentication system:

1. The old `credentials.json` file is now optional
2. Users will need to re-authenticate through OAuth
3. All existing functionality is preserved with better security
