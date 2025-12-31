# Todo Evolution - Hackathon II

## Project Overview
This is a progressive, cloud-native todo application that evolves from a simple console app to a sophisticated AI-powered system. Phase II transforms the console app into a full-stack web application with Next.js frontend, FastAPI backend, PostgreSQL database, and user authentication.

## Spec-Kit Structure
- `/specs/master/`: Contains all specifications for the master feature
  - `spec.md`: Feature specification with user stories and requirements
  - `plan.md`: Implementation plan with architecture decisions
  - `tasks.md`: Task breakdown for implementation
  - `research.md`: Research and technology decisions
  - `data-model.md`: Database schema and entity definitions
  - `contracts/`: API contract definitions

## Development Workflow
1. Write comprehensive specifications before implementation
2. Use Claude Code to generate code from specifications
3. Validate generated code meets requirements
4. Iterate on specifications if output is incorrect
5. Never manually edit generated code - improve specifications instead

## Project Structure
```
hackathon-todo-phase2/
├── specs/                 # Feature specifications
├── frontend/              # Next.js frontend application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utilities and API clients
│   └── CLAUDE.md          # Frontend development guidelines
├── backend/               # FastAPI backend application
│   ├── main.py            # Application entry point
│   ├── models.py          # Database models
│   ├── auth.py            # Authentication utilities
│   ├── routes/            # API route handlers
│   └── CLAUDE.md          # Backend development guidelines
├── CLAUDE.md              # Root development guidelines
├── README.md              # Project documentation
└── CONSTITUTION.md        # Project governance document
```

## Commands
- Start backend: `cd backend && uvicorn main:app --reload --port 8000`
- Start frontend: `cd frontend && npm run dev`
- Install backend deps: `cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -e .`
- Install frontend deps: `cd frontend && npm install`