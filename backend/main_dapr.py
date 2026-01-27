from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dapr.ext.fastapi import DaprApp
import os

from routes.auth_routes import router as auth_router
from routes.tasks import router as tasks_router
from routes.chat import router as chat_router
from database import create_db_and_tables

# Initialize FastAPI app
app = FastAPI(title="Todo API")

# Enable Dapr extension for FastAPI
dapr_app = DaprApp(app)

# -------------------------
# CORS configuration
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Startup event
# -------------------------
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# -------------------------
# Health check (IMPORTANT FOR K8s)
# -------------------------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# -------------------------
# Dapr Subscription for Kafka topics
# -------------------------
@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-events')
def handle_task_events(event: dict) -> None:
    """Handle incoming task events from Kafka"""
    print(f"Received task event: {event}")
    # This would trigger the appropriate handler based on event type
    # For now, just log the event
    pass

@dapr_app.subscribe(pubsub='kafka-pubsub', topic='reminders')
def handle_reminder_events(event: dict) -> None:
    """Handle incoming reminder events from Kafka"""
    print(f"Received reminder event: {event}")
    # This would trigger the notification service logic
    pass

@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-updates')
def handle_task_updates(event: dict) -> None:
    """Handle incoming task update events from Kafka"""
    print(f"Received task update event: {event}")
    # This would trigger WebSocket broadcast logic
    pass

# -------------------------
# Root route
# -------------------------
@app.get("/")
def root():
    return {"message": "Todo API is running with Dapr integration"}

# -------------------------
# API Routes
# -------------------------
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api", tags=["tasks"])
app.include_router(chat_router, prefix="/api", tags=["chat"])