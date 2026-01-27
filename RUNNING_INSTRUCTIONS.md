# Running Instructions for Phase V: Advanced Cloud Deployment

## Overview
This document provides instructions for running the Todo application with Kafka and Dapr integration locally.

## Prerequisites
- Docker Desktop (for running Kafka, Zookeeper, PostgreSQL)
- Python 3.11+ (already installed in your environment)
- pip package manager

## Running with Docker Compose (Recommended)

### Step 1: Start the Infrastructure
```bash
# Navigate to project root
cd d:\practice\hackathoe-2-phase-2-3\

# Start all services (Kafka, Zookeeper, PostgreSQL, Backend, Frontend, and Microservices)
docker compose -f compose-kafka.yaml up -d
```

### Step 2: Check Service Status
```bash
# Verify all containers are running
docker compose -f compose-kafka.yaml ps
```

### Step 3: Access the Services
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000
- **WebSocket**: ws://localhost:8765

## Running Without Docker (Manual Setup)

### Step 1: Install Prerequisites
If you don't have Docker, you'll need to install and run Kafka and PostgreSQL manually:

#### Kafka Setup
1. Download Apache Kafka from https://kafka.apache.org/downloads
2. Extract and run Zookeeper: `bin/windows/zookeeper-server-start.bat config/zookeeper.properties`
3. Run Kafka: `bin/windows/kafka-server-start.bat config/server.properties`

#### PostgreSQL Setup
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a database named `todo_db`
3. Create a user with appropriate credentials

### Step 2: Set Environment Variables
Create a `.env` file in the project root:
```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### Step 3: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Run the Services Manually

#### Terminal 1 - Backend API:
```bash
cd backend
uvicorn main_dapr_simple:app --reload --port 8000
```

#### Terminal 2 - Recurring Task Service:
```bash
cd backend
python -m services.recurring_task_service
```

#### Terminal 3 - Notification Service:
```bash
cd backend
python -m services.notification_service
```

#### Terminal 4 - Audit Service:
```bash
cd backend
python -m services.audit_service
```

#### Terminal 5 - WebSocket Service:
```bash
cd backend
python -m services.websocket_service
```

#### Terminal 6 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Verifying the Kafka Integration

Even if Kafka is not running, the application will start. You can check the Kafka status at:
- http://localhost:8000/kafka-status

When Kafka is running, you'll see:
```json
{
  "kafka_producer_initialized": true,
  "kafka_brokers": "localhost:9092",
  "message": "Kafka producer is configured but may not be connected if Kafka is not running"
}
```

## Testing the Integration

1. Create a user account through the API or frontend
2. Create tasks, update them, mark as complete
3. Check the logs for event publications
4. When Kafka is running, events will be published to the appropriate topics:
   - `task-events`: All task operations
   - `reminders`: Due date and reminder events
   - `task-updates`: Real-time synchronization events

## Troubleshooting

### Common Issues:
1. **Kafka Connection Errors**: Expected if Kafka is not running. The application will still work but events won't be published.
2. **Database Connection**: Ensure PostgreSQL is running and credentials are correct.
3. **Port Conflicts**: Make sure ports 8000, 3000, 5432, 9092, 2181 are available.

### Checking Logs:
```bash
# Docker logs
docker compose -f compose-kafka.yaml logs -f

# Specific service logs
docker compose -f compose-kafka.yaml logs -f backend
```

## Stopping the Services

### With Docker:
```bash
# Stop all services
docker compose -f compose-kafka.yaml down
```

### Manual Setup:
Ctrl+C in each terminal window to stop the services.

## Next Steps
Once running successfully:
1. Test the full event-driven workflow
2. Verify microservices are processing events correctly
3. Test advanced features like recurring tasks and reminders
4. Monitor the system in a Kubernetes environment