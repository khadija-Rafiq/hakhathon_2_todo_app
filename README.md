# Hackathon II: Todo Evolution - Phase II

## 📋 Project Overview
A progressive, cloud-native todo application that evolves from a simple console app to a sophisticated AI-powered system. Phase II transforms the console app into a full-stack web application with Next.js frontend, FastAPI backend, PostgreSQL database, and user authentication.

## 🚀 Phase II Features
- ✅ User registration and authentication with JWT
- ✅ Create, read, update, delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Filter tasks by status (all, pending, completed)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Multi-user support with data isolation
- ✅ Deployed application (Vercel + Railway)

## 🛠️ Technology Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript 5+
- Tailwind CSS 3+
- Axios for API calls
- Headless UI for accessible components
- Lucide React for icons

### Backend
- Python 3.13+
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- PostgreSQL (Neon)
- JWT Authentication with python-jose
- Bcrypt for password hashing

## 📁 Project Structure

```
hackathon-todo-phase2/
├── specs/                 # Feature specifications
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── frontend/              # Next.js frontend application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utilities and API client
│   ├── package.json
│   ├── next.config.js
│   └── CLAUDE.md
├── backend/               # FastAPI backend application
│   ├── main.py            # Application entry point
│   ├── models.py          # Database models
│   ├── database.py        # Database connection
│   ├── auth.py            # Authentication utilities
│   ├── routes/
│   │   ├── auth_routes.py # Authentication endpoints
│   │   └── tasks.py       # Task endpoints
│   ├── pyproject.toml
│   └── CLAUDE.md
├── CONSTITUTION.md        # Project governance document
├── CLAUDE.md              # Root development guidelines
└── README.md              # This file
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.13+
- UV package manager (`pip install uv`)
- Neon PostgreSQL account

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -e .

# Create .env file with your Neon database connection string
# Get connection string from: https://console.neon.tech/
echo "DATABASE_URL=your_neon_connection_string" > .env
echo "SECRET_KEY=your-super-secret-key-at-least-32-characters-long" >> .env

# Run backend server
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters-long" >> .env.local

# Run development server
npm run dev
```

Visit http://localhost:3000 to access the application.

## 🌐 API Documentation

Once the backend is running, visit:
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user and get JWT token

### Tasks
- `GET /api/{user_id}/tasks` - Get all user tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion status

## 🚢 Deployment

### Backend (Railway)
1. Push code to GitHub
2. Connect Railway to your repository
3. Set environment variables:
   - `DATABASE_URL`: Neon PostgreSQL connection string
   - `SECRET_KEY`: At least 32-character secret key
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
4. Deploy

## 🧪 Testing

### Backend Testing
```bash
# Run backend tests
cd backend
pytest
```

### Frontend Testing
```bash
# Run frontend tests
cd frontend
npm run test
```

## 🤖 Spec-Driven Development

This project follows a spec-driven development approach:
1. Write comprehensive specifications in `/specs/`
2. Use Claude Code to generate implementation from specs
3. Validate that generated code meets requirements
4. If output is incorrect, improve the specification (not the code)
5. Iterate until Claude Code generates correct implementation

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write specifications in `/specs/`
4. Use Claude Code to generate implementation
5. Test your changes
6. Commit with clear messages
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

[Your Name] - [Your GitHub Profile]

## 🙏 Acknowledgments

- Panaversity for organizing Hackathon II
- Claude Code for AI-assisted development
- FastAPI and Next.js communities
- All open-source libraries used in this project