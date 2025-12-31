---
phase: III
title: Phase III - Chat Endpoint Specification
date: 2025-12-30
status: Draft
specification: specs/phase3/chat-endpoint.md
---

# Phase III: Chat Endpoint Specification

## Overview

This document specifies the `/api/{user_id}/chat` endpoint that serves as the primary interface between the frontend and the AI agent system. The endpoint handles natural language processing, conversation management, and response generation.

## Endpoint Definition

### POST /api/{user_id}/chat

**Description**: Process a user's message and return an AI-generated response with any side effects (task operations).

#### Path Parameters
- `user_id` (string): The ID of the authenticated user making the request

#### Headers
- `Authorization: Bearer {jwt_token}`: Valid JWT token for authentication
- `Content-Type: application/json`: Required content type

#### Request Body
```json
{
  "conversation_id": 123,
  "message": "Add buy groceries to my list"
}
```

**Fields**:
- `conversation_id` (integer, optional): ID of the existing conversation. If not provided, a new conversation will be created.
- `message` (string, required): The user's message to process.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "conversation_id": 123,
    "response": "I've added 'Buy groceries' to your task list.",
    "tool_calls": [
      {
        "tool": "add_task",
        "parameters": {
          "user_id": "user-123",
          "title": "Buy groceries",
          "description": null
        },
        "result": {
          "success": true,
          "data": {
            "id": 456,
            "user_id": "user-123",
            "title": "Buy groceries",
            "description": null,
            "completed": false,
            "created_at": "2025-12-30T10:00:00Z",
            "updated_at": "2025-12-30T10:00:00Z"
          }
        }
      }
    ]
  }
}
```

**Response Fields**:
- `conversation_id` (integer): The ID of the conversation (newly created or existing)
- `response` (string): The AI-generated response to the user's message
- `tool_calls` (array): List of tools called during processing with their results

#### Error Responses

**400 Bad Request**
- Invalid request body format
- Missing required fields
- Invalid conversation_id format

**401 Unauthorized**
- Invalid or missing JWT token
- Token has expired

**403 Forbidden**
- User_id in path doesn't match authenticated user
- User doesn't have permission to access the conversation

**404 Not Found**
- Conversation with specified ID doesn't exist

**500 Internal Server Error**
- Unexpected server error during processing

## Authentication Flow

1. **Token Validation**: Verify JWT token in Authorization header
2. **User Verification**: Confirm that the user_id in the path matches the authenticated user
3. **Permission Check**: Ensure user has access to the specified conversation
4. **Process Request**: If authentication passes, proceed with request processing

## Stateless Request Cycle

The endpoint implements a 10-step stateless request cycle:

1. **Receive Request**: Get user message and conversation ID from client
2. **Authenticate**: Validate JWT token and verify user permissions
3. **Fetch History**: Retrieve conversation history from database
4. **Store User Message**: Save the incoming user message to the database
5. **Prepare Context**: Build message array with history and new message
6. **Invoke Agent**: Send context to OpenAI agent with MCP tools
7. **Execute Tools**: Agent calls appropriate MCP tools based on user intent
8. **Generate Response**: Agent creates natural language response
9. **Store Response**: Save AI response to the database
10. **Return Response**: Send response back to client with tool call results

## Error Handling

### Client-Side Errors (4xx)
- Invalid JSON format in request body
- Missing required fields
- Invalid user_id or conversation_id format
- User doesn't have permission to access conversation

### Server-Side Errors (5xx)
- Database connection failures
- OpenAI API errors
- MCP server errors
- Unexpected exceptions during processing

### Graceful Degradation
- If OpenAI API is unavailable, return helpful error message
- If MCP tools fail, return appropriate error without exposing internal details
- If database operations fail, return appropriate error message

## Validation Rules

### Request Validation
- Message must not be empty or exceed 1000 characters
- Conversation_id, if provided, must be a positive integer
- User_id must match the authenticated user in the JWT token

### Response Validation
- Response must be properly formatted JSON
- Tool calls must match the specified MCP tool contracts
- Conversation ID in response must match the processed conversation

## Performance Requirements

- API response time should be under 5 seconds for 95% of requests
- Handle up to 100 concurrent requests
- Efficient database queries with proper indexing
- Proper caching where appropriate