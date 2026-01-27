"""
WebSocket Service - Consumer for processing task updates for real-time sync
This service processes task update events and broadcasts them to connected clients.
"""

from kafka import KafkaConsumer
import json
import os
import logging
from datetime import datetime
import asyncio
import websockets
from typing import Dict, Set

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set to hold all connected WebSocket clients
connected_clients: Set[websockets.WebSocketServerProtocol] = set()

async def register_client(websocket):
    """Register a new client connection."""
    connected_clients.add(websocket)
    logger.info(f"Client connected. Total clients: {len(connected_clients)}")

async def unregister_client(websocket):
    """Unregister a client connection."""
    connected_clients.remove(websocket)
    logger.info(f"Client disconnected. Total clients: {len(connected_clients)}")

async def broadcast_message(message: Dict):
    """Broadcast a message to all connected clients."""
    if connected_clients:
        # Remove closed connections
        closed_connections = set()
        for client in connected_clients:
            if client.closed:
                closed_connections.add(client)

        for client in closed_connections:
            connected_clients.remove(client)

        # Send message to all remaining clients
        if connected_clients:
            await asyncio.gather(
                *[client.send(json.dumps(message)) for client in connected_clients],
                return_exceptions=True
            )
            logger.info(f"Broadcasted message to {len(connected_clients)} clients")

async def handle_client(websocket, path):
    """Handle a new WebSocket client connection."""
    await register_client(websocket)
    try:
        # Keep the connection alive
        await websocket.wait_closed()
    finally:
        await unregister_client(websocket)

def process_task_update_event(event_data):
    """Process a task update event and broadcast to WebSocket clients."""
    try:
        # Format the message for WebSocket broadcast
        ws_message = {
            "type": "task_update",
            "event_type": event_data.get('event_type', 'unknown'),
            "task_id": event_data.get('task_id'),
            "user_id": event_data.get('user_id'),
            "timestamp": event_data.get('timestamp', datetime.utcnow().isoformat()),
            "task_data": event_data.get('task_data', {}),
            "update_type": event_data.get('update_type', 'general')
        }

        # Schedule broadcasting to all connected clients
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(broadcast_message(ws_message))
        loop.close()

    except Exception as e:
        logger.error(f"Error processing task update event: {str(e)}")

def websocket_consumer():
    """Start the WebSocket consumer that listens for task update events."""
    try:
        # Connect to Kafka
        consumer = KafkaConsumer(
            'task-updates',
            bootstrap_servers=os.getenv('KAFKA_BROKERS', 'localhost:9092'),
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            group_id='websocket-service-group',
            auto_offset_reset='earliest'
        )

        logger.info("Starting WebSocket Consumer...")

        for message in consumer:
            try:
                event_data = message.value
                logger.debug(f"Received task update event: {event_data}")

                # Process the task update event
                process_task_update_event(event_data)

            except Exception as e:
                logger.error(f"Error processing task update message: {str(e)}")

    except Exception as e:
        logger.error(f"Error in WebSocket consumer: {str(e)}")

async def start_websocket_server():
    """Start the WebSocket server."""
    server = await websockets.serve(handle_client, "localhost", 8765)
    logger.info("WebSocket server started on ws://localhost:8765")
    await server.wait_closed()

def run_websocket_services():
    """Run both the WebSocket server and consumer."""
    import threading

    # Start WebSocket server in a separate thread
    def start_ws_server():
        asyncio.run(start_websocket_server())

    ws_thread = threading.Thread(target=start_ws_server, daemon=True)
    ws_thread.start()

    # Run the consumer in the main thread
    websocket_consumer()

if __name__ == "__main__":
    run_websocket_services()