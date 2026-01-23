import requests

# Test task creation
url = "http://localhost:8000/api/dijaduaa@gmail.com/tasks"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN_HERE"  # Replace with actual token
}
data = {
    "title": "Test task",
    "description": "Test description",
    "priority": "Medium",
    "category": "Personal",
    "due_date": None,
    "is_recurring": False
}

response = requests.post(url, json=data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
