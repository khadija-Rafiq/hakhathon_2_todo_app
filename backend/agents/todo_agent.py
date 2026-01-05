"""OpenRouter Agent for Phase III Todo Chatbot"""

import os
import sys
import json
from typing import Dict, Any, List
from openai import OpenAI

# Add the backend directory to the Python path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Handle imports for both direct execution and module import
try:
    # Try relative imports first (when used as part of package)
    from ..mcp_tools.server import TodoMCPServer
    from ..mcp_tools.add_task import add_task_tool, TOOL_DEFINITION as ADD_TASK_DEF
    from ..mcp_tools.list_tasks import list_tasks_tool, TOOL_DEFINITION as LIST_TASKS_DEF
    from ..mcp_tools.complete_task import complete_task_tool, TOOL_DEFINITION as COMPLETE_TASK_DEF
    from ..mcp_tools.update_task import update_task_tool, TOOL_DEFINITION as UPDATE_TASK_DEF
    from ..mcp_tools.delete_task import delete_task_tool, TOOL_DEFINITION as DELETE_TASK_DEF
except (ImportError, ValueError):
    # Fall back to absolute imports (when run directly)
    from mcp_tools.server import TodoMCPServer
    from mcp_tools.add_task import add_task_tool, TOOL_DEFINITION as ADD_TASK_DEF
    from mcp_tools.list_tasks import list_tasks_tool, TOOL_DEFINITION as LIST_TASKS_DEF
    from mcp_tools.complete_task import complete_task_tool, TOOL_DEFINITION as COMPLETE_TASK_DEF
    from mcp_tools.update_task import update_task_tool, TOOL_DEFINITION as UPDATE_TASK_DEF
    from mcp_tools.delete_task import delete_task_tool, TOOL_DEFINITION as DELETE_TASK_DEF


class TodoAgent:
    """OpenRouter Agent configured to work with todo application MCP tools"""

    def __init__(self, openrouter_api_key: str = None):
        # Initialize OpenRouter client
        api_key = openrouter_api_key or os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set. Please configure your API key.")

        # Create OpenRouter client
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )

        # Test the API key by attempting to list models
        try:
            self.client.models.list()
        except Exception as e:
            raise ValueError(f"Invalid OPENROUTER_API_KEY provided: {str(e)}")

        # Define the tools (functions) that OpenRouter can use
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": ADD_TASK_DEF["name"],
                    "description": ADD_TASK_DEF["description"],
                    "parameters": {
                        "type": "object",
                        "properties": {
                            k: {
                                "type": v["type"],
                                "description": v.get("description", "") + (" (Note: user_id is automatically provided)" if k == "user_id" else "")
                            } for k, v in ADD_TASK_DEF["parameters"]["properties"].items()
                        },
                        "required": [param for param in ADD_TASK_DEF["parameters"]["required"] if param != "user_id"]  # Remove user_id from required params
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": LIST_TASKS_DEF["name"],
                    "description": LIST_TASKS_DEF["description"],
                    "parameters": {
                        "type": "object",
                        "properties": {
                            k: {
                                "type": v["type"],
                                "description": v.get("description", "") + (" (Note: user_id is automatically provided)" if k == "user_id" else "")
                            } for k, v in LIST_TASKS_DEF["parameters"]["properties"].items()
                        },
                        "required": [param for param in LIST_TASKS_DEF["parameters"]["required"] if param != "user_id"]  # Remove user_id from required params
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": COMPLETE_TASK_DEF["name"],
                    "description": COMPLETE_TASK_DEF["description"],
                    "parameters": {
                        "type": "object",
                        "properties": {
                            k: {
                                "type": v["type"],
                                "description": v.get("description", "") + (" (Note: user_id is automatically provided)" if k == "user_id" else "")
                            } for k, v in COMPLETE_TASK_DEF["parameters"]["properties"].items()
                        },
                        "required": [param for param in COMPLETE_TASK_DEF["parameters"]["required"] if param != "user_id"]  # Remove user_id from required params
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": UPDATE_TASK_DEF["name"],
                    "description": UPDATE_TASK_DEF["description"],
                    "parameters": {
                        "type": "object",
                        "properties": {
                            k: {
                                "type": v["type"],
                                "description": v.get("description", "") + (" (Note: user_id is automatically provided)" if k == "user_id" else "")
                            } for k, v in UPDATE_TASK_DEF["parameters"]["properties"].items()
                        },
                        "required": [param for param in UPDATE_TASK_DEF["parameters"]["required"] if param != "user_id"]  # Remove user_id from required params
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": DELETE_TASK_DEF["name"],
                    "description": DELETE_TASK_DEF["description"],
                    "parameters": {
                        "type": "object",
                        "properties": {
                            k: {
                                "type": v["type"],
                                "description": v.get("description", "") + (" (Note: user_id is automatically provided)" if k == "user_id" else "")
                            } for k, v in DELETE_TASK_DEF["parameters"]["properties"].items()
                        },
                        "required": [param for param in DELETE_TASK_DEF["parameters"]["required"] if param != "user_id"]  # Remove user_id from required params
                    }
                }
            }
        ]

        # Store the model name to use
        self.model_name = "openai/gpt-4o-mini"  # Using a reliable model from OpenRouter

        # Initialize MCP server
        self.mcp_server = TodoMCPServer()

        # Register all MCP tools with the server
        self.mcp_server.register_tool(
            ADD_TASK_DEF["name"],
            ADD_TASK_DEF["description"],
            ADD_TASK_DEF["parameters"],
            add_task_tool
        )

        self.mcp_server.register_tool(
            LIST_TASKS_DEF["name"],
            LIST_TASKS_DEF["description"],
            LIST_TASKS_DEF["parameters"],
            list_tasks_tool
        )

        self.mcp_server.register_tool(
            COMPLETE_TASK_DEF["name"],
            COMPLETE_TASK_DEF["description"],
            COMPLETE_TASK_DEF["parameters"],
            complete_task_tool
        )

        self.mcp_server.register_tool(
            UPDATE_TASK_DEF["name"],
            UPDATE_TASK_DEF["description"],
            UPDATE_TASK_DEF["parameters"],
            update_task_tool
        )

        self.mcp_server.register_tool(
            DELETE_TASK_DEF["name"],
            DELETE_TASK_DEF["description"],
            DELETE_TASK_DEF["parameters"],
            delete_task_tool
        )
    
    async def process_message(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        user_id: str
    ) -> Dict[str, Any]:
        """
        Process a user message using the OpenRouter agent with MCP tools

        Args:
            user_message: The message from the user
            conversation_history: History of the conversation
            user_id: The ID of the authenticated user

        Returns:
            Dictionary with the agent's response and any tool call results
        """
        # Prepare the conversation context
        system_context = (
            "You are a helpful todo list assistant. Your job is to understand user requests "
            "and help them manage their tasks using the available tools. Always be friendly, "
            "concise, and helpful in your responses.\n\n"
            "1. Understand the user's intent from their message\n"
            "2. Select the appropriate tool to fulfill the request\n"
            "3. Use the tool with correct parameters\n"
            "4. Generate a natural language response based on the tool result\n"
            "5. If you're unsure about something, ask the user for clarification\n"
            "6. If a request is invalid or impossible, explain why politely\n\n"
            "IMPORTANT: The user_id is automatically provided with every request, so do not ask the user for their user_id.\n\n"
            "TASK ID GUIDELINES:\n"
            "- Always include task IDs when displaying tasks to the user\n"
            "- Format tasks as: \"1. Task title (✅ completed / ⬜ pending)\"\n"
            "- Extract task IDs from user requests like: 'task 1', 'task 3', 'number 2', 'complete 3', 'delete task 2', 'update task 1 to new title'\n"
            "- When listing tasks, format as: \"You have X tasks:\\n1. Task title (✅ completed)\\n2. Task title (⬜ pending)\\n3. Task title (⬜ pending)\"\n"
            "Available tools: add_task, list_tasks, complete_task, update_task, delete_task"
        )

        # Format conversation history for the API
        formatted_history = []
        for msg in conversation_history:
            role = msg["role"]  # OpenRouter uses "user" and "assistant" roles
            formatted_history.append({
                "role": role,
                "content": msg["content"]
            })

        # Create the messages array with system context, conversation history, and user message
        messages = [
            {"role": "system", "content": system_context}
        ]
        messages.extend(formatted_history)
        messages.append({"role": "user", "content": user_message})

        try:
            # Call the OpenRouter API with function calling
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                tools=self.tools,
                tool_choice="auto",
                temperature=0.7,
                max_tokens=2048
            )

            # Check if the model decided to call a function
            tool_results = []
            tool_calls = []

            # Extract tool calls from the response
            if (response.choices and
                response.choices[0].message and
                hasattr(response.choices[0].message, 'tool_calls') and
                response.choices[0].message.tool_calls):
                for tool_call in response.choices[0].message.tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments) if tool_call.function.arguments else {}

                    print(f"Function called: {function_name}")
                    print(f"Arguments: {function_args}")

                    # CRITICAL: Always add user_id - don't rely on agent to provide it
                    function_args["user_id"] = user_id  # Force override

                    # Convert string parameters to appropriate types for specific tools
                    if function_name in ["complete_task", "update_task", "delete_task"] and "task_id" in function_args:
                        try:
                            # Convert task_id from string to integer
                            function_args["task_id"] = int(function_args["task_id"])
                        except (ValueError, TypeError):
                            print(f"Warning: Could not convert task_id '{function_args['task_id']}' to integer for function {function_name}")

                    # Convert 'completed' parameter for complete_task to boolean
                    if function_name == "complete_task" and "completed" in function_args:
                        completed_value = function_args["completed"]
                        if isinstance(completed_value, str):
                            # Convert string to boolean: 'true'/'True'/'1' -> True, everything else -> False
                            if completed_value.lower() in ['true', '1']:
                                function_args["completed"] = True
                            elif completed_value.lower() in ['false', '0']:
                                function_args["completed"] = False
                            else:
                                # If it's not a recognized boolean string, default to True for 'complete' actions
                                function_args["completed"] = True
                        elif isinstance(completed_value, int):
                            # Convert integer to boolean
                            function_args["completed"] = bool(completed_value)

                    # Execute the tool
                    try:
                        result = await self.mcp_server.execute_tool(function_name, function_args)
                        tool_results.append({
                            "tool_call_id": tool_call.id,  # Use tool_call.id instead of function_name
                            "result": result
                        })
                    except Exception as e:
                        print(f"Tool execution error: {e}")
                        tool_results.append({
                            "tool_call_id": tool_call.id,  # Use tool_call.id instead of function_name
                            "result": {"error": str(e)}
                        })

                    tool_calls.append({
                        "id": tool_call.id,
                        "function": {
                            "name": function_name,
                            "arguments": tool_call.function.arguments
                        },
                        "type": "function"
                    })

            # If there were tool calls, get a final response from the model
            if tool_results:
                # Check if this was a list_tasks call to format the response appropriately
                is_list_tasks_call = any(tc["function"]["name"] == "list_tasks" for tc in tool_calls)

                if is_list_tasks_call:
                    # Format the list_tasks response manually to show task IDs with status
                    list_result = next((tr for tr in tool_results if tr["tool_call_id"] == "list_tasks"), None)
                    if list_result and list_result["result"]["success"]:
                        tasks = list_result["result"]["data"]
                        if tasks:
                            formatted_tasks = []
                            for task in tasks:
                                status = "✅" if task["completed"] else "⬜"
                                formatted_task = f"{task['id']}. {task['title']} ({status} { 'completed' if task['completed'] else 'pending'})"
                                formatted_tasks.append(formatted_task)

                            response_text = f"You have {len(tasks)} tasks:\n" + "\n".join(formatted_tasks)
                        else:
                            response_text = "You have no tasks."

                        return {
                            "response": response_text,
                            "tool_calls": tool_calls,
                            "tool_results": tool_results
                        }

                # For other tool calls, send the function results back to the model to get the final response
                # First, recreate the messages with the assistant's tool call and the tool results
                final_messages = [
                    {"role": "system", "content": system_context}
                ]
                final_messages.extend(formatted_history)
                final_messages.append({"role": "user", "content": user_message})

                # Add the assistant's tool call response
                final_messages.append({
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [
                        {
                            "id": tc["id"],
                            "function": {
                                "name": tc["function"]["name"],
                                "arguments": tc["function"]["arguments"]
                            },
                            "type": "function"
                        } for tc in tool_calls
                    ]
                })

                # Add the tool results to the messages
                for tool_result in tool_results:
                    final_messages.append({
                        "role": "tool",
                        "content": json.dumps(tool_result["result"]),
                        "tool_call_id": tool_result["tool_call_id"]
                    })

                # Get the final response from the model
                final_response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=final_messages,
                    temperature=0.7,
                    max_tokens=2048
                )

                return {
                    "response": final_response.choices[0].message.content if final_response.choices and final_response.choices[0].message.content else "I processed your request using the appropriate tools.",
                    "tool_calls": tool_calls,
                    "tool_results": tool_results
                }

            # If no tool calls were made, return the direct response
            response_text = response.choices[0].message.content if response.choices and response.choices[0].message.content else "I'm here to help with your todo list."
            return {
                "response": response_text,
                "tool_calls": [],
                "tool_results": []
            }

        except Exception as e:
            return {
                "response": f"Sorry, I encountered an error processing your request: {str(e)}",
                "tool_calls": [],
                "tool_results": [],
                "error": str(e)
            }


# The get_gemini_type function is no longer needed since we're using OpenRouter
# The OpenRouter function definitions use standard JSON schema types directly