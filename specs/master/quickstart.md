# Quickstart Guide: Phase II Full-Stack Web App

## Overview
Quickstart guide to get the todo application up and running locally.

## Prerequisites

### System Requirements
- Node.js 18+ 
- Python 3.13+
- npm or yarn
- PostgreSQL (or Neon account for cloud database)

### Accounts Required
- [Neon.tech](https://neon.tech) account for PostgreSQL database
- [Vercel](https://vercel.com) account for frontend deployment (optional for local dev)
- [Railway](https://railway.app) account for backend deployment (optional for local dev)

## Setup Instructions

### 1. Clone and Navigate to Project
```bash
git clone <your-repo-url>
cd hackathon-todo-phase2
```

### 2. Setup Backend

#### 2.1. Navigate to Backend Directory
```bash
cd backend
```

#### 2.2. Create Virtual Environment and Install Dependencies
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies using UV (as per constitution)
uv pip install -e .
```

#### 2.3. Create Environment File
Create `.env` file in the backend directory:
```env
DATABASE_URL=your_neon_connection_string
SECRET_KEY=your-super-secret-key-at-least-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

#### 2.4. Run Backend Server
```bash
uvicorn main:app --reload --port 8000
```

The backend server will be running at `http://localhost:8000`

### 3. Setup Frontend

#### 3.1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 3.2. Install Dependencies
```bash
npm install
```

#### 3.3. Create Environment File
Create `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters-long
```

#### 3.4. Run Frontend Development Server
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Database Setup

### 1. Create Neon Database
1. Go to [Neon.tech](https://neon.tech) and sign up
2. Create a new project (e.g., "todo-app")
3. Copy the connection string

### 2. Configure Database Connection
1. Add the connection string to your backend `.env` file as `DATABASE_URL`
2. The application will automatically create tables on first run

## API Documentation

Once the backend is running, API documentation is available at:
- `http://localhost:8000/docs` (Swagger UI)
- `http://localhost:8000/redoc` (ReDoc)

## Testing the Application

### 1. Test Backend API
The backend provides several endpoints for testing:

- Health check: `GET http://localhost:8000/`
- API docs: `GET http://localhost:8000/docs`

### 2. Test Frontend
1. Visit `http://localhost:3000`
2. You should see the application interface
3. Register a new account or log in if you have one

### 3. End-to-End Test
1. Register a new user via the frontend or API
2. Create a task
3. Verify the task appears in the list
4. Update the task status
5. Delete the task

## Common Commands

### Backend Commands
```bash
# Run backend server
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .

# Lint code
flake8
```

### Frontend Commands
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

#### Issue: Database Connection Error
**Solution**: 
1. Verify your Neon connection string is correct
2. Ensure the database is active in Neon dashboard
3. Check that your connection string includes `?sslmode=require`

#### Issue: CORS Error
**Solution**:
1. Check that frontend URL is in the backend's CORS settings
2. Verify the backend is running on the expected port

#### Issue: Authentication Error
**Solution**:
1. Verify that `SECRET_KEY` is the same in both frontend and backend
2. Check that JWT configuration is consistent

#### Issue: Frontend Can't Connect to Backend
**Solution**:
1. Ensure both servers are running
2. Check that `NEXT_PUBLIC_API_URL` points to the correct backend address
3. Verify the backend is listening on the expected port

## Environment Configuration

### Development Environment
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Database: Neon PostgreSQL

### Production Environment
- Frontend: Deployed URL (e.g., `https://your-app.vercel.app`)
- Backend: Deployed URL (e.g., `https://your-backend.railway.app`)
- Database: Neon PostgreSQL

## Next Steps

1. Implement the UI components according to the design specifications
2. Connect the frontend to the backend API
3. Test all user flows
4. Deploy to production (Vercel for frontend, Railway for backend)
5. Update this documentation as needed

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)