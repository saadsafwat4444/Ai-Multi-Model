# AI Multi-Model Chat Platform

A comprehensive AI chat platform supporting multiple AI models including Gemini, GPT, and Grok.

## 🚀 Features

- **Multi-Model Support**: Switch between different AI models (Gemini, GPT, Grok)
- **User Authentication**: Secure Google OAuth integration
- **Chat Management**: Create, delete, and manage chat conversations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Chat**: Instant messaging with AI responses

## 📁 Project Structure

```
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── auth/      # Authentication services
│   │   ├── chat/      # Chat management
│   │   ├── entities/  # Database entities
│   │   └── services/  # AI model services
│   └── package.json
├── frontend/         # Next.js web application
│   ├── app/
│   │   ├── auth/      # Authentication pages
│   │   ├── dashboard/ # Main chat interface
│   │   └── api/       # API routes
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Google OAuth** - User authentication

### Frontend
- **Next.js** - React framework
- **JavaScript** - Frontend language
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Notification system

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saadsafwat4444/Ai-Multi-Model.git
   cd Ai-Multi-Model
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Configure your environment variables
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp env.example .env.local
   # Configure your environment variables
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/ai_chat
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GEMINI_API_KEY=your-gemini-api-key
GPT_API_KEY=your-gpt-api-key
GROK_API_KEY=your-grok-api-key
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:9999
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/google` - Google OAuth login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

### Chat
- `GET /chat/history` - Get chat history
- `POST /chat` - Send message
- `GET /chat/:id/messages` - Get chat messages
- `DELETE /chat/:id` - Delete chat

## 🤖 Supported AI Models

1. **Google Gemini** - Advanced conversational AI
2. **OpenAI GPT** - Powerful language model
3. **Grok** - Real-time information access

## 📱 Usage

1. **Sign in** with your Google account
2. **Choose an AI model** from the dropdown
3. **Start chatting** with your selected AI
4. **Manage conversations** - create new chats, delete old ones
5. **Switch models** anytime during conversation

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file

2. **API Keys**
   - Verify all API keys are correctly set
   - Check API key quotas and billing

3. **CORS Issues**
   - Ensure FRONTEND_URL is correctly set in backend .env

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google for Gemini API
- OpenAI for GPT API
- xAI for Grok API
- NestJS and Next.js communities

## 📞 Support

For support, please open an issue on GitHub or contact the project maintainers.

---

**Happy Chatting! 🤖✨**
