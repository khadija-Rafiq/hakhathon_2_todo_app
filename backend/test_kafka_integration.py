"""
Test script to demonstrate Kafka integration functionality
Note: This will work even if Kafka is not running, but will log errors
"""

from kafka_producer import get_event_publisher
from datetime import datetime

def test_kafka_events():
    print("Testing Kafka event publishing...")

    # Get the event publisher
    publisher = get_event_publisher()

    # Test task event
    print("\n1. Testing task event publishing:")
    task_data = {
        "id": 1,
        "title": "Test Task",
        "description": "This is a test task",
        "completed": False,
        "user_id": "test_user_123"
    }

    success = publisher.publish_task_event("created", task_data, "test_user_123")
    print(f"Task event published: {success}")

    # Test reminder event
    print("\n2. Testing reminder event publishing:")
    success = publisher.publish_reminder_event(
        task_id=1,
        title="Test Task",
        due_at=datetime.now(),
        remind_at=datetime.now(),
        user_id="test_user_123"
    )
    print(f"Reminder event published: {success}")

    # Test task update event
    print("\n3. Testing task update event publishing:")
    changes = {"field": "completed", "old_value": False, "new_value": True}
    success = publisher.publish_task_update_event(1, "test_user_123", "toggle_completion", changes)
    print(f"Task update event published: {success}")

    print("\nTest completed. If Kafka is not running, you'll see error messages, which is expected.")

if __name__ == "__main__":
    test_kafka_events()