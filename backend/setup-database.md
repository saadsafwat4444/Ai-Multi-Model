# Database Setup Instructions

## 1. Create .env file
Create a `.env` file in the backend folder with:

```env
# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/ai_chat_platform

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Port
PORT=9999

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 2. Create Database
```sql
CREATE DATABASE ai_chat_platform;
```

## 3. Restart Backend
After adding the .env file, restart the backend server:

```bash
npm run start:dev
```

## 4. What happens next?
With `synchronize: true`, TypeORM will automatically create these tables:
- `users` 
- `chats`
- `messages`

**Note:** `synchronize: true` should only be used in development! For production, use migrations.
