# API Contracts: Phase II Full-Stack Web App

## Overview
REST API contracts for the todo application with user authentication and task management.

## Authentication API

### POST /api/auth/register
Register a new user account

#### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "User Name"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "created_at": "2025-12-27T10:00:00Z"
  },
  "message": "User registered successfully"
}
```

#### Error Responses
- 400: Validation error (invalid email format, weak password)
- 409: Conflict (email already exists)

### POST /api/auth/login
Authenticate user and return JWT token

#### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name"
    },
    "token": "jwt-token-string"
  },
  "message": "Login successful"
}
```

#### Error Responses
- 400: Validation error (missing fields)
- 401: Unauthorized (invalid credentials)

## Task Management API

### GET /api/{user_id}/tasks
Retrieve all tasks for a specific user with optional filtering

#### Path Parameters
- user_id (string): The ID of the user whose tasks to retrieve

#### Query Parameters
- status (string, optional): Filter by status (all, pending, completed)
- limit (integer, optional): Maximum number of tasks to return
- offset (integer, optional): Number of tasks to skip

#### Headers
- Authorization: Bearer {jwt_token}

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "user_id": "user-uuid",
      "title": "Task Title",
      "description": "Task description",
      "completed": false,
      "created_at": "2025-12-27T10:00:00Z",
      "updated_at": "2025-12-27T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Error Responses
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user_id doesn't match token)
- 404: Not found (user doesn't exist)

### POST /api/{user_id}/tasks
Create a new task for a user

#### Path Parameters
- user_id (string): The ID of the user creating the task

#### Headers
- Authorization: Bearer {jwt_token}

#### Request Body
```json
{
  "title": "New Task",
  "description": "Task description"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "created_at": "2025-12-27T10:00:00Z",
    "updated_at": "2025-12-27T10:00:00Z"
  },
  "message": "Task created successfully"
}
```

#### Validation Rules
- Title must be 1-200 characters
- Description, if provided, must be 1-5000 characters

#### Error Responses
- 400: Validation error (invalid title/description)
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user_id doesn't match token)

### GET /api/{user_id}/tasks/{task_id}
Retrieve a specific task

#### Path Parameters
- user_id (string): The ID of the user
- task_id (integer): The ID of the task

#### Headers
- Authorization: Bearer {jwt_token}

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Task Title",
    "description": "Task description",
    "completed": false,
    "created_at": "2025-12-27T10:00:00Z",
    "updated_at": "2025-12-27T10:00:00Z"
  }
}
```

#### Error Responses
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user_id doesn't match token or task doesn't belong to user)
- 404: Not found (task doesn't exist)

### PUT /api/{user_id}/tasks/{task_id}
Update a specific task

#### Path Parameters
- user_id (string): The ID of the user
- task_id (integer): The ID of the task

#### Headers
- Authorization: Bearer {jwt_token}

#### Request Body
```json
{
  "title": "Updated Task Title",
  "description": "Updated description"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Updated Task Title",
    "description": "Updated description",
    "completed": false,
    "created_at": "2025-12-27T10:00:00Z",
    "updated_at": "2025-12-27T11:00:00Z"
  },
  "message": "Task updated successfully"
}
```

#### Error Responses
- 400: Validation error (invalid title/description)
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user_id doesn't match token or task doesn't belong to user)
- 404: Not found (task doesn't exist)

### PATCH /api/{user_id}/tasks/{task_id}/complete
Toggle the completion status of a task

#### Path Parameters
- user_id (string): The ID of the user
- task_id (integer): The ID of the task

#### Headers
- Authorization: Bearer {jwt_token}

#### Request Body
```json
{
  "completed": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Task Title",
    "description": "Task description",
    "completed": true,
    "created_at": "2025-12-27T10:00:00Z",
    "updated_at": "2025-12-27T11:00:00Z"
  },
  "message": "Task completion status updated"
}
```

#### Error Responses
- 400: Validation error (invalid completed value)
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user_id doesn't match token or task doesn't belong to user)
- 404: Not found (task doesn't exist)

### DELETE /api/{user_id}/tasks/{task_id}
Delete a specific task

#### Path Parameters
- user_id (string): The ID of the user
- task_id (integer): The ID of the task to delete

#### Headers
- Authorization: Bearer {jwt_token}

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Task Title",
    "description": "Task description",
    "completed": false,
    "created_at": "2025-12-27T10:00:00Z",
    "updated_at": "2025-12-27T10:00:00Z"
  },
  "message": "Task deleted successfully"
}
```

#### Error Responses
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user_id doesn't match token or task doesn't belong to user)
- 404: Not found (task doesn't exist)

## Common Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details if applicable"
  }
}
```

## Authentication Requirements

All task management endpoints require:
1. Valid JWT token in Authorization header
2. User ID in token must match the user_id in the path
3. Token must not be expired

## Rate Limiting

- Unauthenticated requests: 100/hour per IP
- Authenticated requests: 1000/hour per user

## Pagination

For endpoints that return multiple items:
- Default limit: 20 items
- Maximum limit: 100 items
- Use offset for pagination: `?limit=20&offset=40` for page 3