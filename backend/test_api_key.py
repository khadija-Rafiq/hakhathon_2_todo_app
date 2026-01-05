#!/usr/bin/env python3
"""
Test script to verify OpenRouter API key configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_key():
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

    if not openrouter_api_key or openrouter_api_key == "YOUR_OPENROUTER_API_KEY_HERE":
        print("X ERROR: OPENROUTER_API_KEY is not configured properly!")
        print("   Please go to https://openrouter.ai/ to get your API key")
        print("   Then update the OPENROUTER_API_KEY in backend/.env")
        return False

    if openrouter_api_key.startswith("sk-or-v1-") and len(openrouter_api_key) >= 50:
        print("V OPENROUTER_API_KEY format appears valid")
        return True
    else:
        print("X ERROR: OPENROUTER_API_KEY format is invalid!")
        print("   OpenRouter API keys typically start with 'sk-or-v1-' and are about 64 characters long")
        return False

if __name__ == "__main__":
    print("Testing OpenRouter API Key Configuration...")
    print("="*50)
    test_api_key()