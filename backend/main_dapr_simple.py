from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import router as auth_router
from routes.tasks import router as tasks_router
from routes.chat import router as chat_router
from database import create_db_and_tables

# Initialize FastAPI app
app = FastAPI(title="Todo API with Kafka Integration")

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
# Root route
# -------------------------
@app.get("/")
def root():
    return {"message": "Todo API is running with Kafka integration"}

# -------------------------
# API Routes
# -------------------------
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks_router, prefix="/api", tags=["tasks"])
app.include_router(chat_router, prefix="/api", tags=["chat"])

# -------------------------
# Kafka Integration Info
# -------------------------
@app.get("/kafka-status")
def kafka_status():
    from kafka_producer import event_publisher
    status = {
        "kafka_producer_initialized": event_publisher.producer is not None,
        "kafka_brokers": event_publisher.kafka_brokers,
        "message": "Kafka producer is configured but may not be connected if Kafka is not running"
    }
    return status