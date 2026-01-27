"""
Notification Service - Consumer for processing reminder events
This service processes reminder events and sends notifications to users.
"""

from kafka import KafkaConsumer
import json
import os
import logging
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_notification(user_id: str, title: str, due_at, remind_at, notification_method: str = "console"):
    """
    Send notification to user based on the specified method.
    For now, we'll just log the notification, but in a real implementation
    this could send emails, push notifications, etc.
    """
    try:
        if notification_method == "console":
            # Log notification to console
            logger.info(f"NOTIFICATION for user {user_id}: Task '{title}' is due at {due_at}. Reminder sent at {remind_at}")

        elif notification_method == "email":
            # Placeholder for email implementation
            logger.info(f"Email notification sent to user {user_id} for task '{title}'")

        elif notification_method == "push":
            # Placeholder for push notification implementation
            logger.info(f"Push notification sent to user {user_id} for task '{title}'")

        else:
            logger.warning(f"Unknown notification method: {notification_method}")

    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")

def process_reminder_event(event_data):
    """Process a reminder event and send notification."""
    try:
        task_id = event_data.get('task_id')
        title = event_data.get('title')
        due_at = event_data.get('due_at')
        remind_at = event_data.get('remind_at')
        user_id = event_data.get('user_id')

        if not all([task_id, title, user_id]):
            logger.error("Missing required fields in reminder event")
            return

        logger.info(f"Processing reminder for task {task_id}, user {user_id}")

        # Send notification
        send_notification(user_id, title, due_at, remind_at)

    except Exception as e:
        logger.error(f"Error processing reminder event: {str(e)}")

def notification_consumer():
    """Start the notification consumer that listens for reminder events."""
    try:
        # Connect to Kafka
        consumer = KafkaConsumer(
            'reminders',
            bootstrap_servers=os.getenv('KAFKA_BROKERS', 'localhost:9092'),
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            group_id='notification-service-group',
            auto_offset_reset='earliest'
        )

        logger.info("Starting Notification Consumer...")

        for message in consumer:
            try:
                event_data = message.value
                logger.info(f"Received reminder event: {event_data}")

                # Process the reminder event
                process_reminder_event(event_data)

            except Exception as e:
                logger.error(f"Error processing reminder message: {str(e)}")

    except Exception as e:
        logger.error(f"Error in notification consumer: {str(e)}")

def mock_notification_scheduler():
    """Mock scheduler for demonstration purposes."""
    logger.info("Starting Mock Notification Scheduler...")

    # In a real implementation, this would schedule actual notifications
    # based on reminder times. For now, we'll just listen to the Kafka stream.
    # The actual consumer handles the timing through Kafka message processing.
    pass

if __name__ == "__main__":
    # Start the notification consumer
    notification_consumer()