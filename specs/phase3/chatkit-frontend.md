---
phase: III
title: Phase III - ChatKit Frontend Specification
date: 2025-12-30
status: Draft
specification: specs/phase3/chatkit-frontend.md
---

# Phase III: ChatKit Frontend Specification

## Overview

This document specifies the implementation of the OpenAI ChatKit frontend for the AI-powered todo chatbot. The frontend provides a conversational interface that connects to the backend chat endpoint.

## ChatKit Installation and Setup

### Dependencies

Add the following dependencies to the frontend's `package.json`:

```json
{
  "dependencies": {
    "ai": "^3.0.0",
    "openai": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "@ai-sdk/openai": "^0.0.18",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

### Installation Commands

```bash
# Navigate to frontend directory
cd frontend

# Install ChatKit dependencies
npm install ai openai @ai-sdk/openai zod
```

## Component Structure

### Main Chat Component

Create a main chat component at `frontend/components/ChatInterface.tsx`:

```tsx
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

interface ChatInterfaceProps {
  userId: string;
  token: string;
}

export function ChatInterface({ userId, token }: ChatInterfaceProps) {
  const [conversationId, setConversationId] = useState<number | null>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: {
      userId,
      conversationId: conversationId || undefined
    },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    onResponse: (response) => {
      // Extract conversation ID from response if new conversation was created
      if (response.headers.get('X-Conversation-ID')) {
        setConversationId(parseInt(response.headers.get('X-Conversation-ID')!));
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={isLoading && message.role === 'assistant'}
          />
        ))}
      </div>
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
```

### Chat Message Component

Create a message component at `frontend/components/ChatMessage.tsx`:

```tsx
import { Message } from 'ai';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  return (
    <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-lg max-w-[80%] ${
          message.role === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {message.content}
        {isLoading && message.role === 'assistant' && (
          <span className="ml-2 inline-block h-2 w-2 animate-ping rounded-full bg-white opacity-75"></span>
        )}
      </div>
    </div>
  );
}
```

### Chat Input Component

Create an input component at `frontend/components/ChatInput.tsx`:

```tsx
import { FormEvent } from 'react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-200 flex"
    >
      <input
        value={input}
        placeholder="Type your message here..."
        onChange={handleInputChange}
        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`px-6 py-3 rounded-r-lg text-white ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

### Chat Header Component

Create a header component at `frontend/components/ChatHeader.tsx`:

```tsx
export function ChatHeader() {
  return (
    <header className="p-4 border-b border-gray-200 bg-white">
      <h1 className="text-2xl font-bold text-gray-800">Todo Chat Assistant</h1>
      <p className="text-gray-600">Ask me to manage your tasks with natural language</p>
    </header>
  );
}
```

## API Integration Patterns

### Authentication Headers

All requests to the backend must include the JWT token:

```tsx
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Conversation Context

Maintain conversation context by passing the conversation ID:

```tsx
const body = {
  userId,
  conversationId: conversationId || undefined
};
```

### Error Handling

Handle API errors gracefully:

```tsx
onError: (error) => {
  console.error('Chat error:', error);
  // Display user-friendly error message
  alert('There was an issue with your request. Please try again.');
}
```

## Domain Allowlist Configuration

### Next.js Configuration

Update `next.config.js` to allow API requests:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
```

### Environment Variables

Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_CHAT_ENDPOINT=/api/chat
```

## Page Implementation

### Chat Page

Create a chat page at `frontend/app/chat/page.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useRouter } from 'next/navigation';
import { getUserSession } from '@/lib/auth';

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const session = getUserSession();
    if (!session) {
      router.push('/login');
      return;
    }
    
    setUserId(session.userId);
    setToken(session.token);
  }, [router]);

  if (!userId || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatInterface userId={userId} token={token} />
    </div>
  );
}
```

### Dashboard Integration

Add a chat link to the dashboard at `frontend/app/dashboard/page.tsx`:

```tsx
// Add to existing dashboard page
<Link href="/chat" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
  Open AI Chat
</Link>
```

## Security Considerations

### JWT Token Handling

- Store JWT tokens securely in memory or httpOnly cookies
- Never expose tokens in client-side code unnecessarily
- Implement token refresh mechanisms

### Input Sanitization

- Sanitize user inputs before sending to backend
- Validate message content length and format
- Implement rate limiting on client-side if possible

### Error Information

- Don't expose sensitive error details to users
- Log errors on the client for debugging
- Provide user-friendly error messages

## Performance Optimization

### Message Caching

- Implement caching for conversation history
- Use virtual scrolling for long conversations
- Optimize message rendering performance

### Loading States

- Show loading indicators during API requests
- Implement optimistic UI updates where appropriate
- Handle network failures gracefully

## Testing Considerations

### Component Testing

- Test each component in isolation
- Mock API responses for testing
- Verify proper error handling

### Integration Testing

- Test the complete chat flow
- Verify authentication flow
- Test various conversation scenarios