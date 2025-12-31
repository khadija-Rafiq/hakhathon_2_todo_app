---
id: 7
title: Frontend API Client Implementation
stage: green
date: 2025-12-27
surface: agent
model: Qwen
feature: master
branch: master
user: user
command: /sp.implement
labels: [implementation, frontend, api-client, hackathon]
links:
  spec: specs/master/spec.md
  plan: specs/master/plan.md
  tasks: specs/master/tasks.md
  ticket: null
  adr: null
  pr: null
files:
 - frontend/lib/api.ts
 - frontend/lib/auth.ts
 - frontend/components/TaskList.tsx
tests:
 - null
---

## Prompt

Create frontend/lib/api.ts with API client functions for task operations:

Requirements:
1. Import getToken from '@/lib/auth'
2. Base URL: const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

Create these async functions:

1. getTasks(userId: string, status?: 'all' | 'pending' | 'completed')
   - GET /api/{userId}/tasks?status={status}
   - Include Authorization header with Bearer token
   - Return response.data

2. getTask(userId: string, taskId: number)
   - GET /api/{userId}/tasks/{taskId}
   - Include auth header
   - Return response.data

3. createTask(userId: string, data: {title: string, description?: string})
   - POST /api/{userId}/tasks
   - Include auth header and JSON body
   - Return response.data

4. updateTask(userId: string, taskId: number, data: {title: string, description?: string})
   - PUT /api/{userId}/tasks/{taskId}
   - Include auth header and JSON body
   - Return response.data

5. deleteTask(userId: string, taskId: number)
   - DELETE /api/{userId}/tasks/{taskId}
   - Include auth header
   - Return response.data

6. toggleComplete(userId: string, taskId: number, completed?: boolean)
   - PATCH /api/{userId}/tasks/{taskId}/complete
   - Include auth header
   - If completed is provided, send as JSON body
   - Return response.data

All functions should:
- Use fetch API
- Include proper headers: 'Content-Type': 'application/json' and Authorization: Bearer {token}
- Parse JSON responses
- Throw errors with meaningful messages
- Have proper TypeScript types

## Response snapshot

Successfully created two frontend API files:
1. frontend/lib/api.ts - Complete task API client with all 6 required functions
2. frontend/lib/auth.ts - Authentication utilities with token management and auth API functions
3. Updated frontend/components/TaskList.tsx to import the correct auth functions

The API client includes proper TypeScript typing, error handling, authentication token inclusion, and follows all specified requirements.

## Outcome

- ✅ Impact: Created complete frontend API client for task operations
- 🧪 Tests: N/A (implementation phase)
- 📁 Files: Created/updated 3 files
- 🔁 Next prompts: Ready to continue with implementation
- 🧠 Reflection: API client follows best practices for authentication and error handling

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test API integration with UI components