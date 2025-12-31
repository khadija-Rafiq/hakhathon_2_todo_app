---
phase: III
title: Phase III - System Architecture
date: 2025-12-30
status: Draft
specification: specs/phase3/architecture.md
---

# Phase III: System Architecture

## Overview

The Phase III architecture implements a stateless AI chatbot that integrates with the existing Phase II backend. The system follows a microservice pattern with clear separation of concerns between the chat interface, AI processing, and data management.

## System Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ChatKit UI    │───▶│  FastAPI Server  │───▶│   Neon DB       │
│                 │    │                  │    │ (tasks, conv,   │
│ (OpenAI ChatKit)│    │ (with OpenAI     │    │  messages)      │
└─────────────────┘    │ Agent integration)│    └─────────────────┘
                       │                  │
                       ▼                  ▲
              ┌─────────────────────────┐ │
              │   OpenAI Agent         │ │
              │   (with runner)        │ │
              └─────────────────────────┘ │
                       │                  │
                       ▼                  │
              ┌─────────────────────────┐ │
              │    MCP Server          │ │
              │  (task operation tools) │ │
              └─────────────────────────┘─┘
```

## Component Interactions

### 1. ChatKit UI
- Provides the user-facing chat interface
- Sends user messages to the FastAPI server
- Receives and displays AI responses
- Handles authentication via JWT tokens

### 2. FastAPI Server
- Acts as the main application server
- Authenticates incoming requests using JWT
- Manages conversation state in the database
- Coordinates between UI, AI agent, and MCP tools
- Handles API requests from other clients

### 3. OpenAI Agent
- Processes natural language using OpenAI's API
- Selects appropriate MCP tools based on user intent
- Maintains conversation context
- Generates natural language responses

### 4. MCP Server
- Exposes task operation tools to the AI agent
- Provides a standardized interface for database operations
- Ensures all operations go through proper validation
- Maintains separation between AI logic and business logic

### 5. Neon Database
- Stores user data (from Phase II)
- Stores task data (from Phase II)
- Stores conversation history
- Stores message history

## Data Flow

1. **User sends message** → ChatKit UI → FastAPI Server
2. **Authentication** → JWT validation → User identified
3. **Conversation retrieval** → Fetch conversation history from DB
4. **AI processing** → Send message + history to OpenAI Agent
5. **Tool selection** → Agent selects appropriate MCP tool
6. **Database operation** → MCP tool executes operation
7. **Response generation** → Agent creates natural language response
8. **Store conversation** → Save user message and AI response to DB
9. **Return response** → Send response back to UI

## Stateless Architecture Explanation

The system implements a stateless request cycle:

1. **Receive user message** from the client
2. **Fetch conversation history** from the database
3. **Build message array** (history + new message)
4. **Store user message** in the database
5. **Run OpenAI agent** with MCP tools
6. **Agent invokes appropriate tools** (add_task, list_tasks, etc.)
7. **Store assistant response** in the database
8. **Return response** to the client
9. **Server retains no state** (ready for next request)

This approach ensures:
- **Scalability**: Multiple server instances can handle requests
- **Reliability**: Server restarts don't affect conversations
- **Maintainability**: No complex state management required
- **Flexibility**: Easy to modify or replace components

## Security Considerations

- All requests require valid JWT authentication
- User isolation maintained at the database level
- MCP tools validate user permissions before operations
- Conversation history is user-specific
- API keys stored securely and not exposed to clients