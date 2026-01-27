"""
Kafka producer module for publishing task events to Kafka topics.
Uses Confluent Kafka client for publishing events.
"""

from typing import Dict, Any, Optional
import json
from datetime import datetime
from confluent_kafka import Producer
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def delivery_report(err, msg):
    """Callback for delivery reports from Kafka producer"""
    if err is not None:
        logger.error(f'Message delivery failed: {err}')
    else:
        logger.info(f'Message delivered to {msg.topic()} [{msg.partition()}]')

class KafkaEventPublisher:
    def __init__(self):
        self.kafka_brokers = os.getenv("KAFKA_BROKERS", "localhost:9092")
        try:
            self.producer_conf = {
                'bootstrap.servers': self.kafka_brokers,
                'acks': 'all',
                'retries': 3,
                'linger.ms': 5
            }

            self.producer = Producer(self.producer_conf)
            logger.info(f"Kafka producer initialized with brokers: {self.kafka_brokers}")
        except Exception as e:
            logger.error(f"Failed to initialize Kafka producer: {str(e)}")
            self.producer = None

    def publish_task_event(self, event_type: str, task_data: Dict[str, Any], user_id: str):
        """
        Publish a task event to the task-events topic
        """
        if not self.producer:
            logger.error("Kafka producer not initialized, skipping event publication")
            return False

        try:
            event_payload = {
                "event_type": event_type,
                "task_id": task_data.get("id"),
                "task_data": task_data,
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            }

            # Publish the event to Kafka
            self.producer.poll(0)  # Poll for delivery reports
            self.producer.produce('task-events',
                                  key=str(task_data.get("id")),
                                  value=json.dumps(event_payload),
                                  callback=delivery_report)

            # Wait for any outstanding messages to be delivered and delivery reports to be received
            self.producer.flush()

            logger.info(f"Published {event_type} event for task {task_data.get('id')} by user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to publish task event: {str(e)}")
            return False

    def publish_reminder_event(self, task_id: int, title: str, due_at: datetime, remind_at: datetime, user_id: str):
        """
        Publish a reminder event to the reminders topic
        """
        if not self.producer:
            logger.error("Kafka producer not initialized, skipping event publication")
            return False

        try:
            event_payload = {
                "task_id": task_id,
                "title": title,
                "due_at": due_at.isoformat() if due_at else None,
                "remind_at": remind_at.isoformat() if remind_at else None,
                "user_id": user_id
            }

            # Publish the reminder event to Kafka
            self.producer.poll(0)  # Poll for delivery reports
            self.producer.produce('reminders',
                                  key=str(task_id),
                                  value=json.dumps(event_payload),
                                  callback=delivery_report)

            # Wait for any outstanding messages to be delivered and delivery reports to be received
            self.producer.flush()

            logger.info(f"Published reminder event for task {task_id} for user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to publish reminder event: {str(e)}")
            return False

    def publish_task_update_event(self, task_id: int, user_id: str, update_type: str, changes: Dict[str, Any]):
        """
        Publish a task update event to the task-updates topic for real-time sync
        """
        if not self.producer:
            logger.error("Kafka producer not initialized, skipping event publication")
            return False

        try:
            event_payload = {
                "task_id": task_id,
                "user_id": user_id,
                "update_type": update_type,
                "changes": changes,
                "timestamp": datetime.utcnow().isoformat()
            }

            # Publish the task update event to Kafka
            self.producer.poll(0)  # Poll for delivery reports
            self.producer.produce('task-updates',
                                  key=str(task_id),
                                  value=json.dumps(event_payload),
                                  callback=delivery_report)

            # Wait for any outstanding messages to be delivered and delivery reports to be received
            self.producer.flush()

            logger.info(f"Published task update event for task {task_id} by user {user_id}")
            return True

        except Exception as e:
            logger.error(f"Failed to publish task update event: {str(e)}")
            return False

    def close(self):
        """Close the Kafka producer connection"""
        if self.producer:
            self.producer.flush()

# Global instance of the event publisher
event_publisher = KafkaEventPublisher()

def get_event_publisher():
    """Return the global event publisher instance"""
    return event_publisher