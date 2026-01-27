"""
Audit Service - Consumer for processing task events for audit logging
This service processes all task events and maintains an audit log for compliance.
"""

from kafka import KafkaConsumer
import json
import os
import logging
from datetime import datetime
from sqlmodel import create_engine, Session, select
from models import Task
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")
engine = create_engine(DATABASE_URL)

class AuditLog:
    """Simple audit log model - in a real implementation this would be a proper DB table."""
    def __init__(self, event_type: str, user_id: str, task_id: int, timestamp: datetime, details: Dict[str, Any]):
        self.event_type = event_type
        self.user_id = user_id
        self.task_id = task_id
        self.timestamp = timestamp
        self.details = details

def log_audit_event(event_data: Dict[str, Any]):
    """Log the audit event to the audit log."""
    try:
        event_type = event_data.get('event_type')
        user_id = event_data.get('user_id')
        task_id = event_data.get('task_id')
        timestamp = datetime.fromisoformat(event_data.get('timestamp')) if event_data.get('timestamp') else datetime.utcnow()
        task_data = event_data.get('task_data', {})

        # In a real implementation, this would save to an audit table in the database
        audit_log_entry = AuditLog(
            event_type=event_type,
            user_id=user_id,
            task_id=task_id,
            timestamp=timestamp,
            details={
                'action': event_type,
                'task_title': task_data.get('title', ''),
                'changed_fields': []  # Would track what fields changed in a real implementation
            }
        )

        # Log to console for now
        logger.info(f"AUDIT LOG - User: {user_id}, Action: {event_type}, Task ID: {task_id}, Timestamp: {timestamp}")

        # In a real implementation, save to audit database
        # with Session(engine) as session:
        #     session.add(audit_log_entry)
        #     session.commit()

    except Exception as e:
        logger.error(f"Error logging audit event: {str(e)}")

def process_audit_event(event_data):
    """Process a task event for audit logging."""
    try:
        event_type = event_data.get('event_type')

        if event_type in ['created', 'updated', 'deleted']:
            log_audit_event(event_data)
        else:
            logger.debug(f"Skipping audit for event type: {event_type}")

    except Exception as e:
        logger.error(f"Error processing audit event: {str(e)}")

def audit_consumer():
    """Start the audit consumer that listens for task events."""
    try:
        # Connect to Kafka
        consumer = KafkaConsumer(
            'task-events',
            bootstrap_servers=os.getenv('KAFKA_BROKERS', 'localhost:9092'),
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            group_id='audit-service-group',
            auto_offset_reset='earliest'
        )

        logger.info("Starting Audit Consumer...")

        for message in consumer:
            try:
                event_data = message.value
                logger.debug(f"Received task event for audit: {event_data}")

                # Process the audit event
                process_audit_event(event_data)

            except Exception as e:
                logger.error(f"Error processing audit message: {str(e)}")

    except Exception as e:
        logger.error(f"Error in audit consumer: {str(e)}")

if __name__ == "__main__":
    # Start the audit consumer
    audit_consumer()