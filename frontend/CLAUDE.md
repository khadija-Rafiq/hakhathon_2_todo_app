# Frontend Development Guidelines

## Technology Stack
- Next.js 14 (App Router)
- TypeScript 5+
- Tailwind CSS 3+
- Axios for HTTP requests
- Headless UI for accessible components
- Lucide React for icons

## Architecture Patterns
- Component-based architecture with clear separation of concerns
- Use React hooks (useState, useEffect, etc.) for state management
- Follow Next.js App Router file-based routing convention
- Leverage TypeScript for type safety throughout
- Use Tailwind CSS for utility-first styling

## Component Structure
- Presentational components (TaskCard, Header) in components/
- Container components (TaskList, Dashboard) in app/
- Reusable UI components in components/
- Business logic components in components/

## API Integration
- All API calls go through lib/api.ts
- Use axios for HTTP requests with interceptors
- Include authentication tokens automatically via request interceptor
- Handle errors globally via response interceptor
- Use environment variables for API URLs (NEXT_PUBLIC_API_URL)

## State Management
- Use React hooks (useState, useEffect) for local component state
- Use Next.js App Router for navigation and page-level state
- Implement optimistic updates where appropriate for better UX
- Handle loading and error states consistently across components

## Authentication
- Use JWT tokens stored in localStorage for session management
- Include authentication tokens automatically in all API requests
- Redirect to login page when authentication fails
- Implement logout functionality that clears tokens

## Responsive Design
- Implement mobile-first responsive design
- Use Tailwind CSS responsive utility classes
- Test layouts at common breakpoints (375px, 768px, 1024px, 1440px)
- Ensure touch targets are appropriately sized for mobile devices

## Environment Configuration
- Use NEXT_PUBLIC_API_URL for backend API endpoint
- Store sensitive information in environment variables
- Use .env.local for local development settings
- Configure different environments for development/production