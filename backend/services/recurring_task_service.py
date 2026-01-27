"""
Recurring Task Service - Consumer for processing recurring task events
This service processes recurring task events and generates new task instances
based on recurrence rules.
"""

from sqlmodel import create_engine, Session, select
from models import Task
from datetime import datetime, timedelta
import json
import calendar
import os
from kafka import KafkaConsumer
import threading
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")
engine = create_engine(DATABASE_URL)

def calculate_next_occurrence(recurrence_rule_str: str, current_time: datetime, end_date) -> datetime:
    """Calculate the next occurrence time based on the recurrence rule."""
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
    except Exception as e:
        logger.error(f"Error calculating next occurrence: {str(e)}")
        return None

def process_recurring_task(task_data):
    """Process a recurring task and generate new instances if needed."""
    try:
        with Session(engine) as session:
            # Find the recurring task in the database
            recurring_task = session.get(Task, task_data['id'])

            if not recurring_task or not recurring_task.is_recurring:
                logger.info(f"Task {task_data['id']} is not recurring, skipping.")
                return

            current_time = datetime.utcnow()

            # Check if this task should generate a new instance
            if (recurring_task.next_occurrence and
                recurring_task.next_occurrence <= current_time and
                (not recurring_task.end_date or current_time <= recurring_task.end_date)):

                # Generate a new instance of the recurring task
                new_task = Task(
                    user_id=recurring_task.user_id,
                    title=recurring_task.title,
                    description=recurring_task.description,
                    priority=recurring_task.priority,
                    category=recurring_task.category,
                    due_date=recurring_task.due_date,
                    completed=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    # Recurring task fields for the new instance
                    is_recurring=False,  # Individual instances are not recurring
                    parent_task_id=recurring_task.id,  # Link back to the recurring task
                    recurrence_rule=None,  # Individual instances don't have recurrence
                    next_occurrence=None,
                    last_occurrence=datetime.utcnow(),
                    end_date=None,
                    max_occurrences=None,
                    occurrences_count=0
                )

                session.add(new_task)

                # Update the parent task with the next occurrence
                if (recurring_task.max_occurrences is None or
                    recurring_task.occurrences_count < recurring_task.max_occurrences):

                    recurring_task.last_occurrence = datetime.utcnow()
                    recurring_task.occurrences_count += 1

                    # Calculate next occurrence
                    recurring_task.next_occurrence = calculate_next_occurrence(
                        recurring_task.recurrence_rule,
                        datetime.utcnow(),
                        recurring_task.end_date
                    )

                    # If max occurrences reached, disable the recurring task
                    if (recurring_task.max_occurrences is not None and
                        recurring_task.occurrences_count >= recurring_task.max_occurrences):

                        recurring_task.is_recurring = False
                        recurring_task.next_occurrence = None

                session.add(recurring_task)
                session.commit()

                logger.info(f"Generated new instance for recurring task {recurring_task.id}, new task ID: {new_task.id}")

    except Exception as e:
        logger.error(f"Error processing recurring task {task_data.get('id')}: {str(e)}")

def recurring_task_consumer():
    """Start the recurring task consumer that listens for events."""
    try:
        # Connect to Kafka
        consumer = KafkaConsumer(
            'task-events',
            bootstrap_servers=os.getenv('KAFKA_BROKERS', 'localhost:9092'),
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            group_id='recurring-task-service-group',
            auto_offset_reset='earliest'
        )

        logger.info("Starting Recurring Task Consumer...")

        for message in consumer:
            try:
                event_data = message.value

                # Only process 'updated' events that might affect recurring tasks
                if event_data.get('event_type') in ['created', 'updated'] and event_data.get('task_data', {}).get('is_recurring'):
                    logger.info(f"Processing recurring task event: {event_data.get('event_type')} for task {event_data.get('task_id')}")
                    process_recurring_task(event_data['task_data'])

            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")

    except Exception as e:
        logger.error(f"Error in recurring task consumer: {str(e)}")

def run_scheduler():
    """Run the scheduler that periodically checks for recurring tasks."""
    logger.info("Starting Recurring Task Scheduler...")

    while True:
        try:
            with Session(engine) as session:
                current_time = datetime.utcnow()

                # Find all recurring tasks that should generate new instances
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
                        priority=task.priority,
                        category=task.category,
                        due_date=task.due_date,
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

                if recurring_tasks:
                    logger.info(f"Processed {len(recurring_tasks)} recurring tasks")

        except Exception as e:
            logger.error(f"Error in scheduler: {str(e)}")

        # Wait for 60 seconds before checking again
        time.sleep(60)

if __name__ == "__main__":
    # Start both the Kafka consumer and the scheduler
    consumer_thread = threading.Thread(target=recurring_task_consumer, daemon=True)
    consumer_thread.start()

    # Run the scheduler in the main thread
    run_scheduler()