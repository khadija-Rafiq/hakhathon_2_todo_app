# Phase V: Advanced Cloud Deployment with Kafka and Dapr

## Overview
This Phase V implementation adds event-driven architecture using Kafka and Dapr for the Todo application. The system is now composed of multiple microservices that communicate through events, enabling advanced features like recurring tasks, reminders, and real-time synchronization.

## Architecture Components

### Main API Service
- Handles user requests and authentication
- Publishes events to Kafka topics via Dapr
- Supports all existing features plus event publishing

### Recurring Task Service
- Consumes task events to manage recurring tasks
- Generates new task instances based on recurrence rules
- Runs as a separate service for scalability

### Notification Service
- Consumes reminder events to send notifications
- Supports multiple notification channels
- Handles due date reminders

### Audit Service
- Consumes all task events for compliance logging
- Maintains audit trail of all operations
- Supports regulatory requirements

### WebSocket Service
- Consumes task update events for real-time sync
- Broadcasts updates to connected clients
- Enables multi-client synchronization

## Kafka Topics

### task-events
- Events: `created`, `updated`, `deleted`
- Payload: Complete task data with metadata
- Used by: Recurring Task Service, Audit Service, WebSocket Service

### reminders
- Events: `scheduled`, `triggered`
- Payload: Task ID, title, due date, user ID
- Used by: Notification Service

### task-updates
- Events: `realtime-update`
- Payload: Task changes for client sync
- Used by: WebSocket Service

## Dapr Integration

### Components
- **pubsub.kafka**: Kafka pub/sub component
- **state.redis**: State management (optional)
- **bindings.http**: HTTP bindings (if needed)

### Configuration
Dapr components are defined in `backend/config/components/` directory.

## Services Architecture

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Frontend      │     │   Main API      │
│   (Next.js)     │◄───►│   (FastAPI)     │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
                                │
                                ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   WebSocket     │     │   Kafka/       │
│   Service       │     │   Zookeeper    │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│                │    │                 │    │                 │
│ Recurring Task │    │ Notification    │    │ Audit Service   │
│ Service        │    │ Service         │    │                 │
│                │    │                 │    │                 │
└────────────────┘    └─────────────────┘    └─────────────────┘
```

## Deployment Options

### Local Development (Minikube)
```bash
# Start Minikube
minikube start

# Install Dapr
dapr init -k

# Deploy to Minikube
kubectl apply -f k8s-manifests/deployment.yaml
```

### Cloud Platforms
- **Azure Kubernetes Service (AKS)**: Full Dapr support
- **Google Kubernetes Engine (GKE)**: Compatible with Dapr
- **Oracle Cloud Infrastructure (OKE)**: Dapr-ready environment

## Running Locally

### With Docker Compose
```bash
# Start the entire stack
docker-compose -f compose-kafka.yaml up -d

# Access services:
# - API: http://localhost:8000
# - Frontend: http://localhost:3000
# - WebSocket: ws://localhost:8765
```

### Manual Setup
1. Start Kafka/Zookeeper
2. Start PostgreSQL
3. Run backend services:
   ```bash
   # Main API
   cd backend && python -m main_dapr

   # Recurring Task Service
   cd backend && python -m services.recurring_task_service

   # Notification Service
   cd backend && python -m services.notification_service

   # Audit Service
   cd backend && python -m services.audit_service

   # WebSocket Service
   cd backend && python -m services.websocket_service
   ```

## Event Schema

### Task Event
```json
{
  "event_type": "string",
  "task_id": "integer",
  "task_data": "object",
  "user_id": "string",
  "timestamp": "datetime"
}
```

### Reminder Event
```json
{
  "task_id": "integer",
  "title": "string",
  "due_at": "datetime",
  "remind_at": "datetime",
  "user_id": "string"
}
```

## Advanced Features Implemented

### 1. Recurring Tasks
- Daily, weekly, monthly recurrence patterns
- End date and occurrence limits
- Individual instance management

### 2. Due Dates & Reminders
- Task due date management
- Reminder scheduling system
- Multiple notification channels

### 3. Priority Management
- High/Medium/Low priority levels
- Priority-based sorting and filtering

### 4. Tagging System
- Custom tag creation and management
- Multi-tag assignment per task

### 5. Search & Filter
- Full-text search across tasks
- Advanced filtering by status, priority, tags
- Sorting by various attributes

## Benefits of Event-Driven Architecture

1. **Scalability**: Services can scale independently
2. **Resilience**: Failure in one service doesn't impact others
3. **Maintainability**: Clear separation of concerns
4. **Flexibility**: Easy to add new event consumers
5. **Real-time Processing**: Immediate response to events

## Security Considerations

- All services use JWT authentication
- Secure communication between services
- Encrypted data transmission
- Role-based access control

## Monitoring and Observability

- Structured logging across all services
- Event processing metrics
- Service health monitoring
- Error tracking and alerting

## Future Enhancements

- Integration with managed Kafka services (Confluent Cloud, Redpanda)
- Enhanced security with mutual TLS
- Advanced monitoring with distributed tracing
- Auto-scaling based on event load