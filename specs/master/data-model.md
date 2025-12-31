# Data Model: Phase II Full-Stack Web App

## Overview
Data model for the todo application with user authentication and task management capabilities.

## Entity: User

### Fields
- **id**: string (primary key)
  - Purpose: Unique identifier for the user
  - Constraints: Required, unique
  - Format: UUID or auto-generated string
- **email**: string
  - Purpose: User's email address for authentication
  - Constraints: Required, unique, valid email format
  - Max length: 255 characters
- **name**: string
  - Purpose: User's display name
  - Constraints: Required
  - Max length: 100 characters
- **password_hash**: string
  - Purpose: Securely stored password hash
  - Constraints: Required
  - Format: bcrypt hash
- **created_at**: datetime
  - Purpose: Timestamp of account creation
  - Default: Current timestamp
- **updated_at**: datetime
  - Purpose: Timestamp of last account update
  - Default: Current timestamp, auto-updated

### Relationships
- **Tasks**: One-to-many relationship with Task entity (one user to many tasks)

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Name must be 1-100 characters
- Password must be hashed (not stored in plain text)

## Entity: Task

### Fields
- **id**: integer (primary key, auto-increment)
  - Purpose: Unique identifier for the task
  - Constraints: Auto-generated, unique
- **user_id**: string (foreign key)
  - Purpose: Links task to the owning user
  - Constraints: Required, references User.id
- **title**: string
  - Purpose: Task title/description
  - Constraints: Required, 1-200 characters
- **description**: string (nullable)
  - Purpose: Detailed task description
  - Constraints: Optional, max 5000 characters
- **completed**: boolean
  - Purpose: Task completion status
  - Default: false
- **created_at**: datetime
  - Purpose: Timestamp of task creation
  - Default: Current timestamp
- **updated_at**: datetime
  - Purpose: Timestamp of last task update
  - Default: Current timestamp, auto-updated

### Relationships
- **User**: Many-to-one relationship with User entity (many tasks to one user)

### Validation Rules
- Title must be 1-200 characters
- User_id must reference a valid user
- Description, if provided, must be 1-5000 characters
- Completed field must be boolean (true/false)

## Database Schema

### SQL Tables

```sql
-- users table (managed by Better Auth)
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

## State Transitions

### Task State Transitions
- **Incomplete → Complete**: When user marks task as done
- **Complete → Incomplete**: When user unmarks completed task

### Validation on State Changes
- Only the task owner can change task state
- Updated_at timestamp is updated on any change

## API Data Contracts

### User Data Contract
```json
{
  "id": "string",
  "email": "user@example.com",
  "name": "User Name",
  "created_at": "2025-12-27T10:00:00Z",
  "updated_at": "2025-12-27T10:00:00Z"
}
```

### Task Data Contract
```json
{
  "id": 123,
  "user_id": "user-uuid",
  "title": "Task Title",
  "description": "Task description",
  "completed": false,
  "created_at": "2025-12-27T10:00:00Z",
  "updated_at": "2025-12-27T10:00:00Z"
}
```

## Indexing Strategy

### Required Indexes
- **idx_tasks_user_id**: For efficient user-based task queries
- **idx_tasks_completed**: For efficient filtering by completion status
- **users.email**: For efficient authentication lookups (handled by DB)

## Constraints

### Referential Integrity
- Tasks.user_id must reference a valid Users.id
- When a user is deleted, their tasks are also deleted (CASCADE)

### Data Quality
- Email uniqueness enforced at database level
- Task title length enforced at database level
- Required fields enforced at database level