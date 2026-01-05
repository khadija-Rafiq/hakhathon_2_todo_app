#!/usr/bin/env python3
"""
Test script to verify the OpenRouter agent is working properly after the fix
"""

import asyncio
import os
from agents.todo_agent import TodoAgent

async def test_agent():
    # Create an instance of the agent
    agent = TodoAgent()

    print("Testing agent initialization...")
    print("Agent created successfully!")

    # Test a simple message to see if it processes correctly
    test_message = "What can you help me with?"
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
        print("Success: Agent is working properly!")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_agent())