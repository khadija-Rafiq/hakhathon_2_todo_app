---
phase: III
title: Phase III - AI-Powered Todo Chatbot Overview
date: 2025-12-30
status: Draft
specification: specs/phase3/overview.md
---

# Phase III: AI-Powered Todo Chatbot Overview

## Objective

Create a natural language interface for the todo application using AI agents and Model Context Protocol (MCP) architecture. This phase transforms the existing web application into an intelligent chatbot that understands natural language commands for all task operations.

## Technology Stack

- **Chat UI**: OpenAI ChatKit
- **AI Framework**: OpenAI Agents SDK
- **Tool Protocol**: Official MCP SDK (Model Context Protocol)
- **Backend**: FastAPI + SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT

## Success Criteria

- Users can interact with their todo list using natural language
- The system correctly interprets commands like "Add buy groceries to my list"
- Conversations persist across sessions
- The server maintains no state between requests
- Friendly, helpful responses with proper error handling
- All Phase II functionality accessible through chat interface

## Integration with Phase II

Phase III builds upon the existing Phase II infrastructure:

- Reuses the PostgreSQL database schema from Phase II
- Leverages existing user authentication system
- Maintains the same task management functionality
- Preserves data isolation between users
- Extends the API with a new chat endpoint

## Key Features

1. **Natural Language Processing**: Understands commands like "Add", "List", "Complete", "Delete", "Update"
2. **Context Awareness**: Maintains conversation context and provides relevant responses
3. **Stateless Architecture**: Server doesn't retain state between requests
4. **Persistent Conversations**: Conversation history stored in database
5. **Error Handling**: Graceful handling of invalid commands with helpful feedback

## Architecture Overview

```
ChatKit UI ──▶ FastAPI Server ──▶ Neon DB
              │                     (tasks, conversations, messages)
              ▼
         OpenAI Agent ──▶ MCP Server
         (with runner)    (task operation tools)
```

This architecture ensures that all task operations go through the same validated backend as Phase II, maintaining data consistency and security.