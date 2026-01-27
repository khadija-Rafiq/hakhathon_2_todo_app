from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from typing import Optional
from auth import get_current_user_payload
from models import Task, TaskCreate, TaskUpdate, TaskRead, User
from database import get_session
from datetime import datetime, timedelta
import json
import calendar

# Import Kafka event publisher
from kafka_producer import get_event_publisher

router = APIRouter()

@router.get("/{user_id}/tasks", response_model=list[TaskRead])
def get_tasks(
    user_id: str,
    status_param: Optional[str] = None,
    session: Session = Depends(get_session),
    token_data: dict = Depends(get_current_user_payload)
):
    """Get all tasks for a specific user with optional status filtering"""
    # Verify that user_id matches the token user_id
    if user_id != token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )

    # Build query
    query = select(Task).where(Task.user_id == user_id)

    # Apply status filter if provided
    if status_param:
        if status_param == "completed":
            query = query.where(Task.completed == True)
        elif status_param == "pending":
            query = query.where(Task.completed == False)
        elif status_param != "all":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be 'all', 'pending', or 'completed'"
            )

    tasks = session.exec(query).all()
    return tasks


def calculate_next_occurrence(recurrence_rule_str: Optional[str], current_time: datetime, end_date: Optional[datetime]) -> Optional[datetime]:
    """Calculate the next occurrence time based on the recurrence rule."""
    if not recurrence_rule_str:
        return None

    try:
        recurrence_rule = json.loads(recurrence_rule_str)
        recurrence_type = recurrence_rule.get('type', 'daily')
        interval = recurrence_rule.get('interval', 1)

        # Calculate next occurrence based on type
        if recurrence_type == 'daily':
            next_time = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
            next_time += timedelta(days=interval)
        elif recurrence_type == 'weekly':
            next_time = current_time.replace(hour=0, minute=0, second=0, microsecond=0)
            next_time += timedelta(weeks=interval)
        elif recurrence_type == 'monthly':
            # Add months by calculating the target month/year
            current_month = current_time.month
            current_year = current_time.year
            target_month = ((current_month - 1 + interval) % 12) + 1
            target_year = current_year + ((current_month - 1 + interval) // 12)

            # Handle days that might not exist in shorter months
            max_day = calendar.monthrange(target_year, target_month)[1]
            day = min(current_time.day, max_day)

            next_time = current_time.replace(year=target_year, month=target_month, day=day, hour=0, minute=0, second=0, microsecond=0)
        else:
            return None

        # Check if next occurrence is past the end date
        if end_date and next_time > end_date:
            return None

        return next_time
    except Exception:
        return None


@router.post("/{user_id}/tasks", response_model=TaskRead)
def create_task(
    user_id: str,
    task_create: TaskCreate,
    session: Session = Depends(get_session),
    token_data: dict = Depends(get_current_user_payload)
):
    """Create a new task for a user"""
    # Verify that user_id matches the token user_id
    if user_id != token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Validate title length
    if not task_create.title or len(task_create.title) < 1 or len(task_create.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be between 1 and 200 characters"
        )

    # Validate recurrence rule if this is a recurring task
    if task_create.is_recurring and task_create.recurrence_rule:
        try:
            recurrence_data = json.loads(task_create.recurrence_rule)
            recurrence_type = recurrence_data.get('type')
            if recurrence_type not in ['daily', 'weekly', 'monthly']:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid recurrence type. Must be 'daily', 'weekly', or 'monthly'"
                )
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid recurrence rule format. Must be valid JSON."
            )

    # Calculate next occurrence if this is a recurring task
    next_occurrence = None
    if task_create.is_recurring:
        next_occurrence = calculate_next_occurrence(
            task_create.recurrence_rule,
            datetime.utcnow(),
            task_create.end_date
        )

    # Create task
    task = Task(
        user_id=user_id,
        title=task_create.title,
        description=task_create.description,
        priority=task_create.priority,
        category=task_create.category,
        due_date=task_create.due_date,
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        # Recurring task fields
        is_recurring=task_create.is_recurring,
        recurrence_rule=task_create.recurrence_rule,
        next_occurrence=next_occurrence,
        end_date=task_create.end_date,
        max_occurrences=task_create.max_occurrences,
        occurrences_count=1 if task_create.is_recurring else 0
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    # Publish task creation event to Kafka via Dapr
    event_publisher = get_event_publisher()
    task_dict = task.dict() if hasattr(task, 'dict') else {c.name: getattr(task, c.name) for c in task.__table__.columns}
    event_publisher.publish_task_event("created", task_dict, user_id)

    return task


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    token_data: dict = Depends(get_current_user_payload)
):
    """Get a specific task by ID"""
    # Verify that user_id matches the token user_id
    if user_id != token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_update: TaskUpdate,  # Changed to TaskUpdate
    session: Session = Depends(get_session),
    token_data: dict = Depends(get_current_user_payload)
):
    """Update a specific task"""
    # Verify that user_id matches the token user_id
    if user_id != token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Validate title length if provided
    if task_update.title and (len(task_update.title) < 1 or len(task_update.title) > 200):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be between 1 and 200 characters"
        )

    # Validate recurrence rule if this is a recurring task
    if task_update.is_recurring and task_update.recurrence_rule:
        try:
            recurrence_data = json.loads(task_update.recurrence_rule)
            recurrence_type = recurrence_data.get('type')
            if recurrence_type not in ['daily', 'weekly', 'monthly']:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid recurrence type. Must be 'daily', 'weekly', or 'monthly'"
                )
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid recurrence rule format. Must be valid JSON."
            )

    # Update task fields
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.priority is not None:
        task.priority = task_update.priority
    if task_update.category is not None:
        task.category = task_update.category
    if task_update.due_date is not None:
        task.due_date = task_update.due_date
    if task_update.completed is not None:
        task.completed = task_update.completed
    # Update recurring task fields
    if task_update.is_recurring is not None:
        task.is_recurring = task_update.is_recurring
    if task_update.recurrence_rule is not None:
        task.recurrence_rule = task_update.recurrence_rule
    if task_update.end_date is not None:
        task.end_date = task_update.end_date
    if task_update.max_occurrences is not None:
        task.max_occurrences = task_update.max_occurrences

    # Recalculate next occurrence if recurrence fields were updated
    if (task_update.is_recurring or task_update.recurrence_rule or
        task_update.end_date or task_update.max_occurrences):
        if task.is_recurring and task.recurrence_rule:
            task.next_occurrence = calculate_next_occurrence(
                task.recurrence_rule,
                datetime.utcnow(),
                task.end_date
            )
        else:
            task.next_occurrence = None

    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    # Publish task update event to Kafka via Dapr
    event_publisher = get_event_publisher()
    task_dict = task.dict() if hasattr(task, 'dict') else {c.name: getattr(task, c.name) for c in task.__table__.columns}
    event_publisher.publish_task_event("updated", task_dict, user_id)

    # If due date was updated, publish reminder event
    if task_update.due_date is not None:
        event_publisher.publish_reminder_event(
            task_id=task.id,
            title=task.title,
            due_at=task.due_date,
            remind_at=task.due_date,  # For simplicity, use due date as reminder time
            user_id=user_id
        )

    return task


@router.delete("/{user_id}/tasks/{task_id}", response_model=TaskRead)
def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    token_data: dict = Depends(get_current_user_payload)
):
    """Delete a specific task"""
    # Verify that user_id matches the token user_id
    if user_id != token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    # Publish task deletion event to Kafka via Dapr before deleting
    event_publisher = get_event_publisher()
    task_dict = task.dict() if hasattr(task, 'dict') else {c.name: getattr(task, c.name) for c in task.__table__.columns}
    event_publisher.publish_task_event("deleted", task_dict, user_id)

    session.delete(task)
    session.commit()

    return task


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_complete(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    token_data: dict = Depends(get_current_user_payload)
):
    """Toggle the completion status of a task"""
    # Verify that user_id matches the token user_id
    if user_id != token_data.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    # Publish task update event to Kafka via Dapr
    event_publisher = get_event_publisher()
    task_dict = task.dict() if hasattr(task, 'dict') else {c.name: getattr(task, c.name) for c in task.__table__.columns}
    event_publisher.publish_task_event("updated", task_dict, user_id)

    return task


# Dapr Cron Binding endpoint for processing recurring tasks
@router.post("/dapr/trigger-recurring-tasks")
def trigger_recurring_tasks():
    """
    Dapr Cron Binding endpoint to process recurring tasks.
    This endpoint will be called by Dapr's cron binding to generate new task instances.
    """
    # This is a placeholder for the actual implementation
    # In a real scenario, this would be called by Dapr cron binding
    # and would process all tasks that need to be generated based on their recurrence rules
    from database import engine
    from sqlmodel import create_engine, Session, select
    from datetime import datetime

    with Session(engine) as session:
        # Find all recurring tasks that should generate new instances
        current_time = datetime.utcnow()
        recurring_tasks = session.exec(
            select(Task).where(
                Task.is_recurring == True,
                Task.next_occurrence <= current_time,
                Task.end_date >= current_time
            )
        ).all()

        for task in recurring_tasks:
            # Generate a new instance of the recurring task
            new_task = Task(
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                completed=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                # Recurring task fields for the new instance
                is_recurring=False,  # Individual instances are not recurring
                parent_task_id=task.id,  # Link back to the recurring task
                recurrence_rule=None,  # Individual instances don't have recurrence
                next_occurrence=None,
                last_occurrence=datetime.utcnow(),
                end_date=None,
                max_occurrences=None,
                occurrences_count=0
            )

            session.add(new_task)

            # Update the parent task with the next occurrence
            if task.max_occurrences is None or task.occurrences_count < task.max_occurrences:
                task.last_occurrence = datetime.utcnow()
                task.occurrences_count += 1

                # Calculate next occurrence
                task.next_occurrence = calculate_next_occurrence(
                    task.recurrence_rule,
                    datetime.utcnow(),
                    task.end_date
                )

                # If max occurrences reached, disable the recurring task
                if (task.max_occurrences is not None and
                    task.occurrences_count >= task.max_occurrences):
                    task.is_recurring = False
                    task.next_occurrence = None

            session.add(task)

        session.commit()

    return {"message": f"Processed {len(recurring_tasks)} recurring tasks", "success": True}