#!/usr/bin/env python3
"""
Test script to verify the complete_task functionality works
"""

import asyncio
import os
from agents.todo_agent import TodoAgent

async def test_complete_task():
    # Create an instance of the agent
    agent = TodoAgent()

    print("Testing agent complete task functionality...")

    # First, let's try to add a task, then complete it
    # For this test, we'll try to complete a task that may or may not exist
    test_message = "Complete task 1"
    conversation_history = []
    user_id = "test_user_123"

    print(f"\nTesting message: '{test_message}'")

    try:
        result = await agent.process_message(
            user_message=test_message,
            conversation_history=conversation_history,
            user_id=user_id
        )
        print("Response:", result.get("response", "No response"))
        print("Tool calls:", result.get("tool_calls", []))
        print("Tool results:", result.get("tool_results", []))

        print("Success: Complete task request processed!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_complete_task())