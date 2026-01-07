# Todo App Backend

This is the backend for a Todo Application with AI-Powered Chatbot built with FastAPI.

## Features

- User authentication with JWT
- Task management (CRUD operations)
- AI chatbot with natural language processing
- Conversation history management

## API Endpoints

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/tasks` - Task management
- `/api/chat` - AI chatbot functionality

## Environment Variables

The following environment variables need to be set:

- `DATABASE_URL` - PostgreSQL database URL
- `JWT_SECRET_KEY` - Secret key for JWT token signing
- `JWT_ALGORITHM` - Algorithm for JWT (default: HS256)
- `OPENROUTER_API_KEY` - API key for OpenRouter (for AI functionality)

## Running Locally

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```