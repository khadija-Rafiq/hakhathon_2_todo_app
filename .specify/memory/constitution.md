<!-- 
Sync Impact Report:
- Version change: 1.0.0 → 1.0.0 (initial version)
- Modified principles: All principles created from scratch
- Added sections: Mission Statement, Development Philosophy, Spec-Driven Development Workflow, Technology Stack Governance, Phase-by-Phase Guidelines, Code Generation Rules, Quality Standards, Documentation Requirements, Deployment Principles, Security and Authentication, AI Integration Standards, Testing and Validation, Version Control and Collaboration, Submission Guidelines
- Removed sections: None
- Templates requiring updates: ✅ Updated / ⚠ Pending
- Follow-up TODOs: None
-->
# Todo Evolution Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Spec-First Development
<!-- Example: I. Library-First -->
No code shall be written manually. All implementation must be generated through Claude Code based on clear, comprehensive specifications. This approach shifts the developer role from "syntax writer" to "system architect," focusing on design and specification rather than implementation details. Every feature requires a specification document before implementation. Specifications must be iteratively refined until Claude Code generates correct output. Manual code writing is a disqualifying violation.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Progressive Complexity
<!-- Example: II. CLI Interface -->
Each phase builds upon the previous, demonstrating natural software evolution from prototype to production system. Phase I: Foundational concepts (in-memory, single-user). Phase II: Persistent state (database, multi-user, authentication). Phase III: AI intelligence (agents, natural language, MCP). Phase IV: Cloud-native deployment (containerization, orchestration). Phase V: Distributed systems (event-driven, advanced features).
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. AI-Native Architecture
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
The system must demonstrate modern AI-native patterns, including conversational interfaces, intelligent agents, and tool-based architectures. Applications must follow cloud-native principles: containerization, orchestration, scalability, resilience, and observability. The developer is a Product Architect who defines requirements and acceptance criteria, designs system architecture and interfaces, writes specifications that guide AI code generation, reviews and validates generated code, and iterates on specifications when output is incorrect.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### IV. Cloud-Native Design
<!-- Example: IV. Integration Testing -->
Applications must follow cloud-native principles: containerization, orchestration, scalability, resilience, and observability. Clear boundaries between frontend, backend, database, AI services, and infrastructure layers. In spec-driven development, the developer is a Product Architect who defines requirements and acceptance criteria, designs system architecture and interfaces, writes specifications that guide AI code generation, reviews and validates generated code, and iterates on specifications when output is incorrect.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### V. Separation of Concerns
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
Clear boundaries between frontend, backend, database, AI services, and infrastructure layers. Every feature must follow the spec-driven workflow: Write user stories, define technical specifications, organize specifications, use Claude Code for generation, validate and iterate. What we don't do: Write boilerplate code manually, implement repetitive CRUD operations by hand, debug syntax errors in hand-written code, maintain large codebases without clear specifications. What we do: Think deeply about user needs and system design, write clear, unambiguous specifications, design clean interfaces and APIs, validate that generated code meets requirements, refine specifications iteratively.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

### VI. Spec-Driven Development Workflow
<!-- Example: VI. Simplicity -->
Every feature must follow the spec-driven workflow: Write user stories, define technical specifications, organize specifications, use Claude Code for generation, validate and iterate. If generated code is incorrect, identify the gap between specification and implementation, refine the specification to be more clear/detailed, regenerate with Claude Code, repeat until output is correct. NEVER fix by manually editing generated code - instead, improve the specification. As requirements evolve, update specifications first, then regenerate code. This maintains the single source of truth: the specification.
<!-- Example: Start simple, YAGNI principles -->

## Mission Statement

This Constitution governs the development of a progressive, cloud-native AI-powered Todo application that demonstrates mastery of spec-driven development, AI agent integration, and modern cloud-native architectures. The project serves as both a learning journey and a demonstration of architectural excellence in building intelligent, distributed systems.

**Core Mission:**
- Transform from simple console application to sophisticated cloud-native AI chatbot
- Master spec-driven development using Claude Code and Spec-Kit Plus
- Demonstrate architectural evolution through five progressive phases
- Build production-grade, scalable, event-driven systems
- Create reusable intelligence through agents, skills, and subagents

## Technology Stack Governance

### Phase I: Console Application
**Mandatory Technologies:**
- **Language:** Python 3.13+
- **Package Manager:** UV
- **Development Tools:** Claude Code, Spec-Kit Plus
- **Data Storage:** In-memory (Python data structures)

### Phase II: Full-Stack Web Application
**Mandatory Technologies:**
- **Frontend:** Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Python FastAPI
- **ORM:** SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** Better Auth with JWT
- **Hosting:** Vercel (frontend), any cloud provider (backend)

### Phase III: AI Chatbot
**Mandatory Technologies:**
- **Chat UI:** OpenAI ChatKit
- **AI Framework:** OpenAI Agents SDK
- **Tool Protocol:** Official MCP SDK (Model Context Protocol)
- **Backend:** FastAPI + SQLModel
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** Better Auth with JWT

### Phase IV: Local Kubernetes Deployment
**Mandatory Technologies:**
- **Containerization:** Docker, Docker Desktop
- **Docker AI:** Gordon (Docker AI Agent) - if available
- **Orchestration:** Kubernetes (Minikube)
- **Package Manager:** Helm Charts
- **AI DevOps:** kubectl-ai, kagent
- **Application:** Phase III Todo Chatbot

### Phase V: Advanced Cloud Deployment
**Mandatory Technologies:**
- **Cloud Provider:** DigitalOcean Kubernetes (DOKS) OR Google Cloud (GKE) OR Azure (AKS)
- **Event Streaming:** Kafka (Redpanda Cloud recommended)
- **Distributed Runtime:** Dapr (all building blocks)
- **CI/CD:** GitHub Actions
- **Monitoring:** To be determined based on cloud provider

### Technology Substitution Policy
**PROHIBITED:** Core stack technologies cannot be substituted without explicit approval.

**ALLOWED:** Additional supporting libraries and tools that enhance the core stack.

## Phase-by-Phase Guidelines

### Phase I: In-Memory Python Console App

**Objective:** Build foundational CRUD operations with clean architecture.

**Feature Requirements:**
- Add Task (title, description)
- Delete Task (by ID)
- Update Task (title, description)
- View All Tasks (with status indicators)
- Mark Task as Complete/Incomplete

**Architectural Requirements:**
- Clean separation between data layer, business logic, and presentation
- Proper error handling for all operations
- Input validation (title required, length limits)
- Clear user feedback for all operations

**Deliverables:**
- GitHub repository with Constitution, specs/, src/, README.md, CLAUDE.md
- Working console application
- All specifications documented
- Clear setup instructions

**Success Criteria:**
- All CRUD operations work correctly
- No crashes on invalid input
- Clean code architecture
- Complete specification coverage

### Phase II: Full-Stack Web Application

**Objective:** Transform console app into multi-user web application with persistent storage.

**Feature Requirements:**
- All Phase I features as web interface
- User authentication (signup/signin)
- RESTful API for task operations
- Responsive UI design
- Per-user task isolation

**Architectural Requirements:**

#### Monorepo Structure
```
hackathon-todo/
├── .spec-kit/
│   └── config.yaml
├── specs/
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── CLAUDE.md
├── frontend/
│   ├── CLAUDE.md
│   └── [Next.js app]
├── backend/
│   ├── CLAUDE.md
│   └── [FastAPI app]
├── docker-compose.yml
└── README.md
```

#### API Design
**Endpoint Pattern:** `/api/{user_id}/tasks`

**Security:** JWT-based authentication
- Better Auth issues JWT tokens on login
- Frontend includes token in `Authorization: Bearer <token>` header
- Backend verifies JWT and matches user_id
- All queries filtered by authenticated user

**API Endpoints:**
```
GET    /api/{user_id}/tasks          # List all user's tasks
POST   /api/{user_id}/tasks          # Create new task
GET    /api/{user_id}/tasks/{id}     # Get specific task
PUT    /api/{user_id}/tasks/{id}     # Update task
DELETE /api/{user_id}/tasks/{id}     # Delete task
PATCH  /api/{user_id}/tasks/{id}/complete  # Toggle completion
```

#### Database Schema
```sql
-- users table (managed by Better Auth)
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

**Deliverables:**
- Monorepo with frontend and backend
- Deployed frontend (Vercel)
- Deployed backend API
- Working authentication
- User-isolated task management
- Complete API documentation

**Success Criteria:**
- Multiple users can create accounts
- Each user sees only their own tasks
- All CRUD operations work via web interface
- Responsive design works on mobile and desktop
- Proper error handling and validation

### Phase III: AI-Powered Todo Chatbot

**Objective:** Create natural language interface using AI agents and MCP architecture.

**Feature Requirements:**
- Conversational interface for all task operations
- Natural language understanding ("Add buy groceries to my list")
- Context-aware responses
- Stateless server with persistent conversation history
- Error handling with helpful feedback

**Architectural Requirements:**

#### System Architecture
```
ChatKit UI ──▶ FastAPI Server ──▶ Neon DB
              │                     (tasks, conversations, messages)
              ▼
         OpenAI Agent ──▶ MCP Server
         (with runner)    (task operation tools)
```

#### Database Models
```python
class Task:
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

class Conversation:
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

class Message:
    id: int
    user_id: str
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str
    created_at: datetime
```

#### MCP Tools Specification

**Tool: add_task**
```json
{
  "name": "add_task",
  "description": "Create a new task",
  "parameters": {
    "user_id": {"type": "string", "required": true},
    "title": {"type": "string", "required": true},
    "description": {"type": "string", "required": false}
  }
}
```

**Tool: list_tasks**
```json
{
  "name": "list_tasks",
  "description": "Retrieve tasks from the list",
  "parameters": {
    "user_id": {"type": "string", "required": true},
    "status": {
      "type": "string",
      "enum": ["all", "pending", "completed"],
      "required": false
    }
  }
}
```

**Tool: complete_task**
```json
{
  "name": "complete_task",
  "description": "Mark a task as complete",
  "parameters": {
    "user_id": {"type": "string", "required": true},
    "task_id": {"type": "integer", "required": true}
  }
}
```

**Tool: delete_task**
```json
{
  "name": "delete_task",
  "description": "Remove a task from the list",
  "parameters": {
    "user_id": {"type": "string", "required": true},
    "task_id": {"type": "integer", "required": true}
  }
}
```

**Tool: update_task**
```json
{
  "name": "update_task",
  "description": "Modify task title or description",
  "parameters": {
    "user_id": {"type": "string", "required": true},
    "task_id": {"type": "integer", "required": true},
    "title": {"type": "string", "required": false},
    "description": {"type": "string", "required": false}
  }
}
```

#### Chat Endpoint
```
POST /api/{user_id}/chat

Request:
{
  "conversation_id": 123,  // optional, creates new if not provided
  "message": "Add buy groceries to my list"
}

Response:
{
  "conversation_id": 123,
  "response": "I've added 'Buy groceries' to your task list.",
  "tool_calls": [
    {"tool": "add_task", "parameters": {...}, "result": {...}}
  ]
}
```

#### Stateless Request Cycle
1. Receive user message
2. Fetch conversation history from database
3. Build message array (history + new message)
4. Store user message
5. Run OpenAI agent with MCP tools
6. Agent invokes appropriate tools
7. Store assistant response
8. Return response to client
9. Server retains no state (ready for next request)

#### Agent Behavior Rules
```markdown
WHEN user mentions: THEN agent should:
- "add", "create", "remember" → use add_task
- "show", "list", "see" → use list_tasks
- "done", "complete", "finished" → use complete_task
- "delete", "remove", "cancel" → use delete_task
- "change", "update", "rename" → use update_task
- always confirm actions with friendly response
- handle errors gracefully
- provide context-aware suggestions
```

**Deliverables:**
- ChatKit-based UI
- FastAPI with OpenAI Agents SDK + MCP
- MCP server with all tools
- Stateless architecture
- Database migration scripts
- Conversation history persistence

**Success Criteria:**
- Natural language commands work correctly
- Agent selects appropriate tools
- Conversations persist across sessions
- Server can restart without losing state
- Friendly, helpful responses
- Proper error handling

### Phase IV: Local Kubernetes Deployment

**Objective:** Deploy chatbot to local Kubernetes cluster with AI-assisted operations.

**Feature Requirements:**
- All Phase III features deployed on Minikube
- Containerized frontend and backend
- Helm charts for deployment
- AI-assisted DevOps operations

**Architectural Requirements:**

#### Containerization
```dockerfile
# Backend Dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

#### Helm Chart Structure
```
helm-charts/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── configmap.yaml
    └── secrets.yaml
```

#### Kubernetes Resources
- **Deployments:** Frontend (2 replicas), Backend (2 replicas)
- **Services:** ClusterIP for backend, LoadBalancer for frontend
- **ConfigMaps:** Environment configuration
- **Secrets:** API keys, database credentials
- **Ingress:** Optional for routing

#### AI DevOps Tools Usage

**Docker AI (Gordon):**
```bash
docker ai "build and tag the backend image for development"
docker ai "what's using the most resources in my containers?"
docker ai "troubleshoot why my container won't start"
```

**kubectl-ai:**
```bash
kubectl-ai "deploy the todo frontend with 2 replicas"
kubectl-ai "scale the backend to handle more load"
kubectl-ai "check why the pods are failing"
kubectl-ai "create a service to expose the frontend"
```

**kagent:**
```bash
kagent "analyze the cluster health"
kagent "optimize resource allocation"
kagent "troubleshoot the deployment issues"
```

**Deliverables:**
- Dockerfiles for all services
- Helm charts
- Minikube deployment instructions
- AI-assisted operations documentation
- Health checks and readiness probes

**Success Criteria:**
- Application runs on Minikube
- Multiple replicas handle load
- Services communicate correctly
- Rolling updates work
- Health monitoring operational
- Can deploy/update using AI tools

### Phase V: Advanced Cloud Deployment

**Objective:** Implement advanced features and deploy to production Kubernetes with event-driven architecture.

**Feature Requirements:**

**Intermediate Level:**
- Priorities (high/medium/low)
- Tags/Categories (work/home/personal)
- Search & Filter (by keyword, status, priority, date)
- Sort Tasks (by due date, priority, alphabetically)

**Advanced Level:**
- Recurring Tasks (auto-reschedule: daily, weekly, monthly)
- Due Dates & Time Reminders (date/time pickers, browser notifications)

**Architectural Requirements:**

#### Part A: Event-Driven Architecture with Kafka

**System Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ KUBERNETES CLUSTER                                      │
│                                                         │
│  Frontend ──▶ Chat API ──▶ MCP Tools ──▶ Neon DB       │
│                  │                                      │
│                  ▼                                      │
│          ┌──────────────────┐                          │
│          │   KAFKA CLUSTER   │                          │
│          │  ┌─────────────┐ │                          │
│          │  │ task-events │ │                          │
│          │  │ reminders   │ │                          │
│          │  └─────────────┘ │                          │
│          └──────┬───┬───────┘                          │
│                 │   │                                   │
│                 ▼   ▼                                   │
│    ┌──────────────────┐  ┌────────────────────┐       │
│    │ Recurring Task   │  │ Notification       │       │
│    │ Service          │  │ Service            │       │
│    └──────────────────┘  └────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

**Kafka Topics:**

1. **task-events**
   - Producer: Chat API (all CRUD operations)
   - Consumers: Recurring Task Service, Audit Service
   - Purpose: Complete audit trail of all task operations

2. **reminders**
   - Producer: Chat API (when due date set)
   - Consumer: Notification Service
   - Purpose: Scheduled reminder triggers

3. **task-updates**
   - Producer: Chat API (any change)
   - Consumer: WebSocket Service
   - Purpose: Real-time multi-client synchronization

**Event Schemas:**

```json
// Task Event
{
  "event_type": "created|updated|completed|deleted",
  "task_id": 123,
  "task_data": {
    "title": "Buy groceries",
    "description": "...",
    "completed": false,
    "priority": "high",
    "due_date": "2025-12-25T10:00:00Z",
    "recurring": {
      "enabled": true,
      "pattern": "weekly",
      "interval": 1
    }
  },
  "user_id": "user123",
  "timestamp": "2025-12-23T12:00:00Z"
}

// Reminder Event
{
  "task_id": 123,
  "title": "Team meeting",
  "due_at": "2025-12-24T14:00:00Z",
  "remind_at": "2025-12-24T13:45:00Z",
  "user_id": "user123"
}
```

**Kafka Service Recommendation:**
- **Primary:** Redpanda Cloud (Serverless tier, free, Kafka-compatible)
- **Local:** Redpanda Docker container
- **Alternative:** Self-hosted with Strimzi operator

#### Part B: Dapr Integration

**Dapr Building Blocks:**

1. **Pub/Sub** - Kafka abstraction
   ```python
   # Publish via Dapr (no Kafka library needed)
   await httpx.post(
       "http://localhost:3500/v1.0/publish/kafka-pubsub/task-events",
       json=event
   )
   ```

2. **State Management** - Conversation state
   ```python
   # Save state via Dapr
   await httpx.post(
       "http://localhost:3500/v1.0/state/statestore",
       json=[{"key": f"conversation-{id}", "value": data}]
   )
   ```

3. **Service Invocation** - Inter-service communication
   ```python
   # Frontend → Backend via Dapr
   fetch("http://localhost:3500/v1.0/invoke/backend-service/method/api/chat")
   ```

4. **Bindings** - Scheduled reminders
   ```yaml
   # Cron binding for reminder checks
   apiVersion: dapr.io/v1alpha1
   kind: Component
   metadata:
     name: reminder-cron
   spec:
     type: bindings.cron
     metadata:
       - name: schedule
         value: "*/5 * * * *"  # Every 5 minutes
   ```

5. **Secrets Management**
   ```python
   # Get secret via Dapr
   response = await httpx.get(
       "http://localhost:3500/v1.0/secrets/kubernetes-secrets/openai-api-key"
   )
   ```

**Dapr Component Configuration:**
```yaml
# kafka-pubsub.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "redpanda-cluster.cloud:9092"
    - name: consumerGroup
      value: "todo-service"

# statestore.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      value: "postgresql://..."
```

#### Part C: Cloud Deployment

**Cloud Provider Setup:**

**Option 1: DigitalOcean (DOKS)**
- New accounts: $200 credit for 60 days
- Managed Kubernetes service
- Integrated monitoring

**Option 2: Google Cloud (GKE)**
- New accounts: $300 credit for 90 days
- Google Kubernetes Engine
- Stackdriver monitoring

**Option 3: Azure (AKS)**
- New accounts: $200 credit for 30 days
- Azure Kubernetes Service
- Azure Monitor

**Deployment Process:**
1. Create Kubernetes cluster
2. Configure kubectl
3. Install Dapr
4. Deploy Dapr components
5. Deploy Helm charts
6. Configure CI/CD
7. Set up monitoring

**CI/CD Pipeline (GitHub Actions):**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker images
        run: |
          docker build -t registry/frontend:${{ github.sha }} ./frontend
          docker build -t registry/backend:${{ github.sha }} ./backend
          docker push registry/frontend:${{ github.sha }}
          docker push registry/backend:${{ github.sha }}
      - name: Deploy to Kubernetes
        run: |
          helm upgrade --install todo-app ./helm-charts \
            --set frontend.image.tag=${{ github.sha }} \
            --set backend.image.tag=${{ github.sha }}
```

**Deliverables:**
- All advanced features implemented
- Event-driven architecture with Kafka
- Full Dapr integration
- Cloud deployment (DOKS/GKE/AKS)
- CI/CD pipeline
- Monitoring and logging
- Production-grade configuration

**Success Criteria:**
- All intermediate and advanced features work
- Events flow through Kafka correctly
- Recurring tasks auto-create
- Reminders send on schedule
- Multi-client real-time sync works
- Application scales horizontally
- Zero-downtime deployments
- Monitoring shows system health

## Code Generation Rules

### Specification Requirements
1. **Every feature must have a specification before implementation**
2. **Specifications must include:**
   - User stories with acceptance criteria
   - Technical design (API, data models, business logic)
   - Edge cases and error handling
   - UI/UX requirements (if applicable)

### Claude Code Usage
1. **Always reference specifications:** `@specs/features/feature-name.md`
2. **Read project guidelines:** CLAUDE.md files at root and subfolders
3. **Generate, don't write:** Use Claude Code for all implementation
4. **Iterate on specs:** If output is wrong, fix the spec, not the code

### Code Quality Standards
1. **No manual code writing** - Specification-driven only
2. **Clean architecture** - Separation of concerns
3. **Error handling** - All edge cases covered
4. **Type safety** - Use TypeScript, Python type hints
5. **Validation** - Input validation at all boundaries
6. **Testing** - Unit tests for business logic

### Prohibited Practices
1. Manual code writing (disqualifies submission)
2. Copying code from external sources without specification
3. Skipping specification documentation
4. Generating code without reading CLAUDE.md
5. Implementing features not in specifications

## Quality Standards

### Code Quality
- **Clean Code:** Follow language-specific best practices
- **Type Safety:** Use TypeScript, Python type hints
- **Error Handling:** Comprehensive try-catch, validation
- **Logging:** Structured logging for debugging
- **Comments:** Explain why, not what
- **Naming:** Clear, descriptive variable/function names

### API Quality
- **RESTful Design:** Follow REST conventions
- **Consistent Naming:** Kebab-case for URLs
- **Error Responses:** Standard format with helpful messages
- **Documentation:** OpenAPI/Swagger specs
- **Versioning:** Plan for API evolution

### Database Quality
- **Normalization:** Proper schema design
- **Indexes:** On foreign keys and query columns
- **Migrations:** Version-controlled schema changes
- **Constraints:** Foreign keys, unique constraints
- **Transactions:** ACID compliance where needed

### UI/UX Quality
- **Responsive Design:** Mobile-first approach
- **Accessibility:** WCAG 2.1 AA compliance
- **Loading States:** Spinners, skeletons
- **Error States:** User-friendly error messages
- **Empty States:** Helpful guidance when no data

### AI Quality
- **Clear Prompts:** Unambiguous instructions to agents
- **Tool Descriptions:** Clear parameter documentation
- **Error Recovery:** Graceful handling of AI failures
- **Context Management:** Efficient token usage
- **Response Validation:** Check AI outputs

## Documentation Requirements

### Required Documents

#### 1. Constitution (This Document)
- Project governance and principles
- Development workflows
- Technical standards
- Phase-by-phase guidelines

#### 2. CLAUDE.md (Root Level)
```markdown
# Todo App - Hackathon II

## Project Overview
[Description of the project]

## Spec-Kit Structure
[How specifications are organized]

## Development Workflow
[How to use specs and Claude Code]

## Project Structure
[Folder organization]

## Commands
[How to run the project]
```

#### 3. CLAUDE.md (Frontend)
```markdown
# Frontend Guidelines

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS

## Patterns
[Development patterns]

## Component Structure
[How components are organized]

## API Client
[How to call backend]
```

#### 4. CLAUDE.md (Backend)
```markdown
# Backend Guidelines

## Stack
- FastAPI
- SQLModel
- Neon PostgreSQL

## Project Structure
[File organization]

## API Conventions
[REST patterns]

## Database
[How to use SQLModel]
```

#### 5. README.md
```markdown
# Hackathon II: Todo Evolution

## Overview
[Project description]

## Features
[What the app does]

## Technology Stack
[Technologies used]

## Setup Instructions
### Prerequisites
### Installation
### Running Locally

## Deployment
[How to deploy]

## Architecture
[System architecture diagram and explanation]

## API Documentation
[Link to API docs or inline documentation]

## Contributing
[How to contribute - if applicable]

## License
[License information]
```

#### 6. Specification Files
All specs in `/specs` folder following Spec-Kit structure.

### Documentation Quality Standards
- **Clear:** Easy to understand for new developers
- **Complete:** Cover all features and configurations
- **Current:** Updated with code changes
- **Accurate:** Match actual implementation
- **Examples:** Include code samples and use cases

## Deployment Principles

### Phase II: Web Application
- **Frontend:** Deploy to Vercel (zero config)
- **Backend:** Deploy to cloud provider (Railway, Render, etc.)
- **Database:** Neon Serverless (included in connection)

### Phase III: AI Chatbot
- **Same as Phase II plus:**
- **ChatKit Domain:** Configure OpenAI domain allowlist
- **Environment Variables:** Secure API key management

### Phase IV: Local Kubernetes
- **Minikube:** Local cluster for development
- **Docker Desktop:** Container runtime
- **Helm:** Package management
- **AI Tools:** kubectl-ai, kagent for operations

### Phase V: Production Cloud
- **Cloud Provider:** DOKS/GKE/AKS
- **Event Streaming:** Redpanda Cloud
- **Dapr:** Distributed runtime
- **CI/CD:** GitHub Actions
- **Monitoring:** Cloud-native observability

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Health checks configured
- [ ] Monitoring/logging enabled
- [ ] Secrets securely stored
- [ ] Resource limits set
- [ ] Auto-scaling configured (Phase V)
- [ ] Backup strategy in place (Phase V)

## Security and Authentication

### Authentication Architecture (Phase II+)

**Better Auth with JWT:**
1. User signs up/signs in via Better Auth
2. Better Auth issues JWT token
3. Frontend stores token (secure HttpOnly cookie recommended)
4. Frontend includes token in API requests: `Authorization: Bearer <token>`
5. Backend verifies JWT signature using shared secret
6. Backend extracts user_id from token
7. Backend filters all queries by user_id

**Environment Variables:**
```env
# Frontend
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key
BETTER_AUTH_SECRET=shared-secret-key

# Backend
BETTER_AUTH_SECRET=shared-secret-key
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### Security Best Practices
1. **Never commit secrets** - Use .env files, .gitignore
2. **Validate all inputs** - Prevent injection attacks
3. **Use HTTPS** - Encrypt data in transit
4. **Parameterized queries** - Prevent SQL injection
5. **Rate limiting** - Prevent abuse
6. **CORS configuration** - Restrict origins
7. **JWT expiry** - Short-lived tokens (7 days max)
8. **Password hashing** - Better Auth handles this

### Data Privacy
- Users only see their own data
- All queries filtered by authenticated user_id
- No cross-user data leakage
- Proper error messages (don't reveal existence of other users' data)

## AI Integration Standards

### OpenAI Agents SDK Usage

**Agent Configuration:**
```python
from openai_agents import Agent, Runner

agent = Agent(
    name="todo-assistant",
    instructions="""
    You are a helpful todo list assistant.
    You help users manage their tasks through natural language.
    Always confirm actions and provide friendly responses.
    """,
    tools=[add_task, list_tasks, complete_task, delete_task, update_task],
    model="gpt-4"
)
```

**Runner Pattern:**
```python
# Stateless request handling
async def handle_chat(user_id: str, conversation_id: int, message: str):
    # 1. Fetch history
    history = await get_conversation_history(conversation_id)
    
    # 2. Build messages
    messages = history + [{"role": "user", "content": message}]
    
    # 3. Store user message
    await store_message(conversation_id, "user", message)
    
    # 4. Run agent
    response = await agent.run(messages, user_id=user_id)
    
    # 5. Store assistant response
    await store_message(conversation_id, "assistant", response.content)
    
    # 6. Return response
    return response
```

### MCP (Model Context Protocol) Standards

**Tool Definition:**
```python
from mcp import Tool, ToolParameter

add_task_tool = Tool(
    name="add_task",
    description="Create a new task for the user",
    parameters=[
        ToolParameter(
            name="user_id",
            type="string",
            description="The ID of the user creating the task",
            required=True
        ),
        ToolParameter(
            name="title",
            type="string",
            description="The title of the task (1-200 characters)",
            required=True
        ),
        ToolParameter(
            name="description",
            type="string",
            description="Optional description of the task (max 1000 characters)",
            required=False
        )
    ]
)

@add_task_tool.handler
async def handle_add_task(user_id: str, title: str, description: str = None):
    # Validate
    if not title or len(title) > 200:
        return {"error": "Title must be 1-200 characters"}
    
    # Create task
    task = await create_task(user_id, title, description)
    
    # Return result
    return {
        "task_id": task.id,
        "status": "created",
        "title": task.title
    }
```

**Tool Quality Standards:**
- Clear, descriptive names
- Comprehensive parameter documentation
- Input validation
- Error handling
- Consistent response format
- Helpful error messages

## Testing and Validation

### Testing Strategy

**Phase I: Console App**
- Manual testing of all CRUD operations
- Edge case testing (empty inputs, invalid IDs)
- Data persistence verification (in-memory)

**Phase II: Web App**
- Frontend component testing
- API endpoint testing
- Authentication flow testing
- Multi-user isolation testing
- Browser compatibility testing

**Phase III: AI Chatbot**
- Natural language command testing
- Tool selection accuracy testing
- Conversation flow testing
- Error recovery testing
- Multi-turn conversation testing

**Phase IV: Kubernetes**
- Container build testing
- Deployment testing
- Service communication testing
- Health check testing
- Scaling testing

**Phase V: Production**
- Load testing
- Event streaming testing
- Recurring task testing
- Reminder delivery testing
- Failover testing
- CI/CD pipeline testing

### Testing Checklist

**Functional Testing:**
- [ ] All CRUD operations work
- [ ] Authentication works correctly
- [ ] User isolation is enforced
- [ ] Natural language commands work
- [ ] Event streaming works
- [ ] Recurring tasks auto-create
- [ ] Reminders send on time

**Non-Functional Testing:**
- [ ] Response times acceptable
- [ ] Application scales under load
- [ ] No memory leaks
- [ ] Graceful error handling
- [ ] Logging is comprehensive
- [ ] Monitoring captures metrics

## Version Control and Collaboration

### Git Workflow

**Branch Strategy:**
```
main                    # Production-ready code
├── phase-1            # Phase I development
├── phase-2            # Phase II development
├── phase-3            # Phase III development
├── phase-4            # Phase IV development
└── phase-5            # Phase V development
```

**Commit Message Format:**
```
[Phase X] Brief description

- Detailed change 1
- Detailed change 2

Spec: @specs/features/feature-name.md
```

### Repository Structure
```
hackathon-todo/
├── .gitignore
├── .spec-kit/
│   └── config.yaml
├── specs/
│   ├── overview.md
│   ├── architecture.md
│   └── [organized specs]
├── CONSTITUTION.md          # This document
├── CLAUDE.md               # Root instructions
├── README.md
├── frontend/
│   ├── CLAUDE.md
│   └── [Next.js app]
├── backend/
│   ├── CLAUDE.md
│   └── [FastAPI app]
├── helm-charts/
│   └── [Kubernetes manifests]
├── docker-compose.yml
└── .github/
    └── workflows/
        └── deploy.yml
```

### .gitignore Essentials
```
# Environment variables
.env
.env.local

# Dependencies
node_modules/
__pycache__/
*.pyc

# Build outputs
.next/
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Unpacked OOXML (if using docx skill)
unpacked/
```

## Submission Guidelines

### What to Submit

**For Each Phase:**
1. **GitHub Repository Link** (public)
2. **Deployed Application Link** (Phases II-V)
3. **Demo Video** (max 90 seconds)
4. **WhatsApp Number** (for presentation invitation)

**Submission Form:**
https://forms.gle/KMKEKaFUD6ZX4UtY8

### Repository Requirements

**Must Include:**
- CONSTITUTION.md (this document)
- /specs folder with all specifications
- CLAUDE.md files (root, frontend, backend)
- README.md with setup instructions
- All source code
- Deployment configurations
- Clear folder structure

**Must NOT Include:**
- .env files with secrets
- node_modules or other dependencies
- Build artifacts
- Uncommitted changes

### Demo Video Requirements

**Content:**
- Show all implemented features
- Demonstrate spec-driven workflow
- Highlight key architectural decisions
- Show deployment (Phases IV-V)

**Format:**
- **Maximum 90 seconds** (judges only watch first 90 seconds)
- Can use NotebookLM or screen recording
- Clear audio and visuals
- Hosted online (YouTube, Loom, etc.)

### Evaluation Criteria

**Spec-Driven Development (30%):**
- Complete specifications for all features
- Clear relationship between specs and code
- Iterative refinement demonstrated
- No manual code writing

**Implementation Quality (30%):**
- All required features working
- Clean architecture
- Error handling
- Code quality

**AI Integration (20% for Phases III-V):**
- Natural language understanding
- Proper tool usage
- Conversation quality
- Stateless architecture

**Cloud-Native Architecture (20% for Phases IV-V):**
- Proper containerization
- Kubernetes deployment
- Event-driven architecture (Phase V)
- Dapr integration (Phase V)

### Bonus Points

**Reusable Intelligence (+200):**
- Create Claude Code Subagents
- Create Agent Skills
- Demonstrate reusability

**Cloud-Native Blueprints (+200):**
- Create deployment blueprints
- Use Agent Skills for infrastructure

**Multi-language Support (+100):**
- Urdu language support in chatbot

**Voice Commands (+200):**
- Voice input for todo commands

### Disqualifications

**Automatic disqualification for:**
1. Manual code writing (not spec-driven)
2. Plagiarism or copied code
3. Missing specifications
4. Non-functional submission
5. Late submission without prior approval

## Appendices

### Appendix A: Resources

**Core Tools:**
- Claude Code: claude.com/product/claude-code
- GitHub Spec-Kit: github.com/panaversity/spec-kit-plus
- OpenAI ChatKit: platform.openai.com/docs/guides/chatkit
- MCP SDK: github.com/modelcontextprotocol/python-sdk

**Infrastructure:**
- Neon DB: neon.tech (free tier)
- Vercel: vercel.com (free hosting)
- DigitalOcean: digitalocean.com ($200 credit)
- Google Cloud: cloud.google.com ($300 credit)
- Azure: azure.microsoft.com ($200 credit)
- Redpanda Cloud: redpanda.com/cloud (serverless free tier)
- Minikube: minikube.sigs.k8s.io

**Documentation:**
- Next.js: nextjs.org/docs
- FastAPI: fastapi.tiangolo.com
- SQLModel: sqlmodel.tiangolo.com
- Better Auth: better-auth.com
- Dapr: docs.dapr.io
- Helm: helm.sh/docs

### Appendix B: Timeline

| Milestone | Date | Description |
|-----------|------|-------------|
| Hackathon Start | Dec 1, 2025 | Documentation released |
| Phase I Due | Dec 7, 2025 | Console app checkpoint |
| Phase II Due | Dec 14, 2025 | Web app checkpoint |
| Phase III Due | Dec 21, 2025 | Chatbot checkpoint |
| Phase IV Due | Jan 4, 2026 | Local K8s checkpoint |
| Final Submission | Jan 18, 2026 | All phases complete |

**Live Presentations:**
- Every Sunday at 8:00 PM (PKT) on Zoom
- Top submissions invited to present
- Everyone welcome to attend

**Zoom Details:**
- Meeting ID: 849 7684 7088
- Passcode: 305850
- Link: https://us06web.zoom.us/j/84976847088?pwd=Z7t7NaeXwVmmR5fysCv7NiMbfbhIda.1

### Appendix C: Frequently Asked Questions

**Q: Can I skip phases?**
A: No, each phase builds on the previous. Complete them in order.

**Q: Can I use different technologies?**
A: Core stack must remain as specified. Additional tools/libraries are allowed.

**Q: Do I need DigitalOcean from the start?**
A: No, only for Phase V. Use the $200 free credit.

**Q: Can I work in a team?**
A: No, this is an individual hackathon.

**Q: What if I don't complete all phases?**
A: Submit what you complete. Partial submissions are evaluated proportionally.

**Q: Can I use AI tools other than Claude Code?**
A: Claude Code is required for spec-driven development. Other AI tools for supplementary tasks are allowed.

**Q: How detailed should specifications be?**
A: Detailed enough that Claude Code generates correct code. If output is wrong, the spec needs more detail.

**Q: What if Docker AI (Gordon) is unavailable?**
A: Use standard Docker CLI or ask Claude Code to generate docker commands.

**Q: Is Windows supported?**
A: Yes, but Windows users must use WSL 2 (Windows Subsystem for Linux).

**Q: Can I use a different cloud provider than DigitalOcean?**
A: Yes, Google Cloud (GKE) and Azure (AKS) are also acceptable.

## Conclusion

This Constitution establishes the foundation for building a sophisticated, cloud-native AI application through spec-driven development. By following these principles and guidelines, you will:

1. Master the art of specification-driven development
2. Learn to architect systems rather than write code
3. Build production-grade applications with AI assistance
4. Understand cloud-native patterns and practices
5. Create intelligent, event-driven distributed systems

Remember: **The specification is the source of truth.** When code is wrong, fix the specification, not the code.

**Good luck, and may your specs be clear and your code be clean!** 🚀

## Amendment Process

This Constitution may be amended based on:
- Clarifications needed during the hackathon
- Technology updates or changes
- Community feedback
- Judging committee decisions

All amendments will be communicated via:
- GitHub repository updates
- WhatsApp announcements
- Email notifications

**Current Version:** 1.0 (Initial Release)

**Version**: 1.0.0 | **Ratified**: 2025-12-23 | **Last Amended**: 2025-12-27
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->