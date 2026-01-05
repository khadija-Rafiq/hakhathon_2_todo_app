#!/usr/bin/env python3
"""
Test script to verify the OpenRouter agent tool calls are working properly
"""

import asyncio
import os
from agents.todo_agent import TodoAgent

async def test_tool_call():
    # Create an instance of the agent
    agent = TodoAgent()

    print("Testing agent tool call...")

    # Test a message that should trigger a list_tasks call
    test_message = "Show me my tasks"
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

        if result.get("tool_calls"):
            print("Success: Tool call executed properly!")
        else:
            print("Info: No tool calls were made (this might be expected if no tasks exist)")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_tool_call())