---
phase: III
title: Phase III - Database Models
date: 2025-12-30
status: Draft
specification: specs/phase3/database-models.md
---

# Phase III: Database Models

## Overview

Phase III extends the Phase II database schema with new tables to support conversation history and message storage. The existing user and task tables remain unchanged to maintain compatibility with Phase II functionality.

## Database Schema

### Updated SQL Tables

```sql
-- users table (from Phase II, managed by Better Auth)
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tasks table (from Phase II)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- conversations table (new for Phase III)
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),  -- Auto-generated from first message or user-provided
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- messages table (new for Phase III)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_id_created_at ON messages(conversation_id, created_at);
```

## SQLModel Class Definitions

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

# Import Phase II models
from backend.models import User, Task

# Phase III specific models
class ConversationBase(SQLModel):
    title: Optional[str] = Field(default=None, max_length=200)
    user_id: str = Field(foreign_key="users.id")

class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    messages: List["Message"] = Relationship(back_populates="conversation")

class MessageBase(SQLModel):
    user_id: str
    conversation_id: int
    role: str = Field(max_length=20)  # 'user' or 'assistant'
    content: str

class Message(MessageBase, table=True):
    __tablename__ = "messages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    conversation_id: int = Field(foreign_key="conversations.id")
    role: str = Field(max_length=20)  # 'user' or 'assistant'
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    conversation: Conversation = Relationship(back_populates="messages")

class ConversationWithMessages(Conversation):
    messages: List[Message] = []
```

## Indexes and Constraints

### Required Indexes
- `idx_conversations_user_id`: For efficient user-based conversation queries
- `idx_conversations_updated_at`: For efficient sorting by recency
- `idx_messages_conversation_id`: For efficient retrieval of messages in a conversation
- `idx_messages_conversation_id_created_at`: For efficient chronological retrieval of messages

### Foreign Key Relationships
- `conversations.user_id` → `users.id` (CASCADE delete)
- `messages.user_id` → `users.id` (CASCADE delete)
- `messages.conversation_id` → `conversations.id` (CASCADE delete)

### Data Integrity Constraints
- All messages must belong to an existing conversation
- All conversations must belong to an existing user
- All messages must belong to an existing user
- Role field restricted to 'user' or 'assistant' values

## Entity Descriptions

### Conversation Entity
- **Purpose**: Groups related messages into a conversation thread
- **Fields**:
  - `id`: Unique identifier for the conversation
  - `user_id`: Links to the user who owns the conversation
  - `title`: Optional title, auto-generated from first message
  - `created_at`: Timestamp when conversation was created
  - `updated_at`: Timestamp when conversation was last updated

### Message Entity
- **Purpose**: Stores individual messages in a conversation
- **Fields**:
  - `id`: Unique identifier for the message
  - `user_id`: Links to the user who owns the message
  - `conversation_id`: Links to the conversation containing the message
  - `role`: Specifies if the message is from 'user' or 'assistant'
  - `content`: The actual message text
  - `created_at`: Timestamp when message was created

## Migration Strategy

### From Phase II to Phase III
1. Add new `conversations` and `messages` tables
2. Add indexes for performance
3. Update existing models to include relationships
4. Update API endpoints to support new functionality
5. Maintain backward compatibility with Phase II APIs

## State Transitions

### Conversation State Transitions
- **New Conversation**: Created when user starts a new chat
- **Active Conversation**: Updated when new messages are added
- **Archived Conversation**: No automatic archiving, but could be implemented later

### Message State Transitions
- **New Message**: Added to conversation when user or AI sends message
- **Immutable**: Messages are not modified after creation (append-only)

## Validation Rules

### Conversation Validation
- User_id must reference a valid user
- Title, if provided, must be 1-200 characters
- Updated_at timestamp is updated on any change

### Message Validation
- User_id must reference a valid user
- Conversation_id must reference a valid conversation
- Role must be either 'user' or 'assistant'
- Content must not be empty
- Created_at is set automatically