# Recurring Tasks Feature

This document describes the implementation of the recurring tasks feature in the cloud-native Todo application.

## Overview

The recurring tasks feature enables users to create tasks that automatically repeat according to specified schedules (Daily, Weekly, Monthly). The system leverages Dapr Cron Bindings for scheduling and stores recurrence rules in the PostgreSQL database.

## Architecture

### Components

1. **Frontend Task Form** (`frontend/components/TaskForm.tsx`)
   - Enhanced form with recurrence options
   - Supports Daily, Weekly, Monthly recurrence patterns
   - Configurable intervals, days of week, days of month
   - End conditions (end date or max occurrences)

2. **Backend API** (`backend/routes/tasks.py`)
   - Extended Task model with recurrence fields
   - New API endpoints for recurring tasks
   - Cron binding endpoint for processing recurring tasks

3. **Database Schema** (`backend/models.py`)
   - Extended Task model with recurrence fields:
     - `is_recurring`: Boolean indicating if task recurs
     - `recurrence_rule`: JSON string defining recurrence pattern
     - `next_occurrence`: DateTime of next scheduled occurrence
     - `last_occurrence`: DateTime of last generated occurrence
     - `end_date`: Optional end date for recurrence
     - `max_occurrences`: Optional maximum number of occurrences
     - `occurrences_count`: Count of generated occurrences
     - `parent_task_id`: Links generated instances to parent recurring task

4. **Dapr Configuration**
   - Cron binding component for scheduling
   - Subscription to connect cron to backend endpoint
   - State store component for persistence

## Recurrence Rule Format

The recurrence rule is stored as a JSON string with the following structure:

```json
{
  "type": "daily|weekly|monthly",
  "interval": 1,
  "daysOfWeek": ["monday", "wednesday", "friday"], // for weekly
  "dayOfMonth": 15 // for monthly
}
```

## Dapr Integration

### Cron Binding

The system uses Dapr's cron binding to periodically check for recurring tasks that need to generate new instances. The cron binding is configured to run every minute:

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: recurring-tasks-cron
spec:
  type: bindings.cron
  version: v1
  metadata:
  - name: schedule
    value: "@every 1m"  # Check every minute for recurring tasks
```

### Processing Endpoint

The `/dapr/trigger-recurring-tasks` endpoint is called by the cron binding to process all recurring tasks that should generate new instances based on their schedule.

## Frontend UI

The task form now includes:

1. **Repeat Dropdown**: Choose between No Repeat, Daily, Weekly, Monthly
2. **Recurrence Settings**:
   - Interval (e.g., every 1, 2, 3 days/weeks/months)
   - Days of week selection (for weekly recurrence)
   - Day of month input (for monthly recurrence)
3. **End Conditions**:
   - End date (stop recurrence after this date)
   - Max occurrences (stop recurrence after X occurrences)

## API Endpoints

### Creating Recurring Tasks

POST `/api/{user_id}/tasks`

Request body:
```json
{
  "title": "Task title",
  "description": "Task description",
  "is_recurring": true,
  "recurrence_rule": "{\"type\":\"weekly\",\"interval\":1,\"daysOfWeek\":[\"monday\",\"wednesday\",\"friday\"]}",
  "end_date": "2024-12-31T23:59:59Z",
  "max_occurrences": 10
}
```

### Updating Recurring Tasks

PUT `/api/{user_id}/tasks/{task_id}`

Same request structure as create.

## Deployment

### Prerequisites

- Dapr installed in the Kubernetes cluster
- PostgreSQL database deployed

### Deployment Steps

1. Deploy Dapr components:
   ```bash
   kubectl apply -f ./todo-chart/files/components/
   ```

2. Deploy the application with Dapr sidecar:
   ```bash
   helm install todo-app ./todo-chart
   ```

The Helm chart includes annotations to enable Dapr sidecar injection for the backend service.

## Future Enhancements

- Advanced recurrence patterns (e.g., "first Monday of each month")
- Time-based recurrence (specific times of day)
- Recurrence exceptions and overrides
- Recurrence history and statistics