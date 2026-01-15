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

## Running with Docker

This project provides Docker and Docker Compose setup for easy deployment.

- **Python version:** 3.11 (as specified in the Dockerfile)
- **Services:**
  - `python-backend`: FastAPI backend
  - `postgres-db`: PostgreSQL database
- **Ports:**
  - Backend: `7860` (exposed as `7860:7860`)
  - Database: not exposed externally

### Required Environment Variables

Set the following variables in a `.env` file at the project root (see `.env.example` for reference):

- `DATABASE_URL` (e.g. `postgres://postgres:postgres@db:5432/todoapp`)
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM` (default: HS256)
- `OPENROUTER_API_KEY`

### Build and Run

1. Ensure Docker and Docker Compose are installed.
2. (Optional) Update `.env` with your secrets and configuration.
3. Build and start the services:

```bash
docker compose up --build
```

- The backend will be available at `http://localhost:7860`.
- The PostgreSQL database uses a persistent volume (`postgres-data`).

### Notes

- The backend runs as a non-root user for security.
- All Python dependencies are installed in a virtual environment inside the container.
- The backend service depends on the database and will wait for it to be ready before starting.
- For development, you can uncomment the `env_file: ./.env` line in `docker-compose.yml` to load environment variables automatically.
