---
phase: III
title: Phase III - MCP Tools Specification
date: 2025-12-30
status: Draft
specification: specs/phase3/mcp-tools.md
---

# Phase III: MCP Tools Specification

## Overview

This document specifies the Model Context Protocol (MCP) tools that the OpenAI agent will use to interact with the todo application database. These tools provide a standardized interface for all task operations while maintaining separation between AI logic and business logic.

## Tool Specifications

### Tool: add_task

**Description**: Create a new task for a user

**Parameters**:
```json
{
  "user_id": {
    "type": "string",
    "required": true,
    "description": "The ID of the user creating the task"
  },
  "title": {
    "type": "string",
    "required": true,
    "description": "The title of the task (1-200 characters)",
    "minLength": 1,
    "maxLength": 200
  },
  "description": {
    "type": "string",
    "required": false,
    "description": "Optional detailed description of the task",
    "maxLength": 5000
  }
}
```

**Return Format**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Task Title",
    "description": "Task description",
    "completed": false,
    "created_at": "2025-12-30T10:00:00Z",
    "updated_at": "2025-12-30T10:00:00Z"
  },
  "message": "Task created successfully"
}
```

**Error Cases**:
- Invalid user_id: Returns error with message "Invalid user ID"
- Title validation failure: Returns error with message "Title must be 1-200 characters"
- Database error: Returns error with message "Failed to create task"

**Example**:
```json
{
  "user_id": "user-123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

---

### Tool: list_tasks

**Description**: Retrieve tasks for a user with optional filtering

**Parameters**:
```json
{
  "user_id": {
    "type": "string",
    "required": true,
    "description": "The ID of the user whose tasks to retrieve"
  },
  "status": {
    "type": "string",
    "enum": ["all", "pending", "completed"],
    "required": false,
    "default": "all",
    "description": "Filter tasks by completion status"
  }
}
```

**Return Format**:
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
      "created_at": "2025-12-30T10:00:00Z",
      "updated_at": "2025-12-30T10:00:00Z"
    }
  ],
  "count": 1
}
```

**Error Cases**:
- Invalid user_id: Returns error with message "Invalid user ID"
- Database error: Returns error with message "Failed to retrieve tasks"

**Example**:
```json
{
  "user_id": "user-123",
  "status": "pending"
}
```

---

### Tool: complete_task

**Description**: Mark a task as complete or incomplete

**Parameters**:
```json
{
  "user_id": {
    "type": "string",
    "required": true,
    "description": "The ID of the user who owns the task"
  },
  "task_id": {
    "type": "integer",
    "required": true,
    "description": "The ID of the task to update"
  },
  "completed": {
    "type": "boolean",
    "required": false,
    "default": true,
    "description": "Whether the task is completed (default: true)"
  }
}
```

**Return Format**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Task Title",
    "description": "Task description",
    "completed": true,
    "created_at": "2025-12-30T10:00:00Z",
    "updated_at": "2025-12-30T11:00:00Z"
  },
  "message": "Task completion status updated"
}
```

**Error Cases**:
- Invalid user_id: Returns error with message "Invalid user ID"
- Invalid task_id: Returns error with message "Task not found"
- Task doesn't belong to user: Returns error with message "Task does not belong to user"
- Database error: Returns error with message "Failed to update task"

**Example**:
```json
{
  "user_id": "user-123",
  "task_id": 456,
  "completed": true
}
```

---

### Tool: update_task

**Description**: Modify task title or description

**Parameters**:
```json
{
  "user_id": {
    "type": "string",
    "required": true,
    "description": "The ID of the user who owns the task"
  },
  "task_id": {
    "type": "integer",
    "required": true,
    "description": "The ID of the task to update"
  },
  "title": {
    "type": "string",
    "required": false,
    "minLength": 1,
    "maxLength": 200,
    "description": "New title for the task (1-200 characters)"
  },
  "description": {
    "type": "string",
    "required": false,
    "maxLength": 5000,
    "description": "New description for the task"
  }
}
```

**Return Format**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Updated Task Title",
    "description": "Updated description",
    "completed": false,
    "created_at": "2025-12-30T10:00:00Z",
    "updated_at": "2025-12-30T11:00:00Z"
  },
  "message": "Task updated successfully"
}
```

**Error Cases**:
- Invalid user_id: Returns error with message "Invalid user ID"
- Invalid task_id: Returns error with message "Task not found"
- Task doesn't belong to user: Returns error with message "Task does not belong to user"
- Title validation failure: Returns error with message "Title must be 1-200 characters"
- Database error: Returns error with message "Failed to update task"

**Example**:
```json
{
  "user_id": "user-123",
  "task_id": 456,
  "title": "Updated task title",
  "description": "Updated task description"
}
```

---

### Tool: delete_task

**Description**: Remove a task from the user's list

**Parameters**:
```json
{
  "user_id": {
    "type": "string",
    "required": true,
    "description": "The ID of the user who owns the task"
  },
  "task_id": {
    "type": "integer",
    "required": true,
    "description": "The ID of the task to delete"
  }
}
```

**Return Format**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "title": "Task Title",
    "description": "Task description",
    "completed": false,
    "created_at": "2025-12-30T10:00:00Z",
    "updated_at": "2025-12-30T10:00:00Z"
  },
  "message": "Task deleted successfully"
}
```

**Error Cases**:
- Invalid user_id: Returns error with message "Invalid user ID"
- Invalid task_id: Returns error with message "Task not found"
- Task doesn't belong to user: Returns error with message "Task does not belong to user"
- Database error: Returns error with message "Failed to delete task"

**Example**:
```json
{
  "user_id": "user-123",
  "task_id": 456
}
```

## MCP Server Implementation Requirements

### Authentication
- All tools must validate that the user_id parameter matches the authenticated user
- Tools must return appropriate errors if user_id is invalid or doesn't match authentication

### Validation
- All input parameters must be validated before database operations
- Tools must return appropriate error messages for validation failures

### Error Handling
- Tools must handle database errors gracefully
- Error messages should be informative but not expose internal details
- All errors must follow the standard error response format

### Performance
- Tools should be optimized for performance
- Appropriate database indexes must be used
- Tools should return results efficiently

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