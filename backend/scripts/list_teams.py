"""
Script to list all teams
"""
import asyncio
import os

import httpx

# Defaults support local dev; override via env vars or .env file.
ENVIRONMENT = os.getenv("ENVIRONMENT", "local").lower()
BASE_URL = os.getenv("BASE_URL", "http://localhost:8001")
USERNAME = os.getenv("USERNAME", "admin@test")
PASSWORD = os.getenv("PASSWORD", "admin123")

if ENVIRONMENT != "local" and (not USERNAME or not PASSWORD):
    raise RuntimeError("USERNAME and PASSWORD env vars are required outside local environments.")


async def list_teams():
    """List all teams"""
    async with httpx.AsyncClient() as client:
        # Login
        login_response = await client.post(
            f"{BASE_URL}/api/v1/admin/auth/login",
            json={"username": USERNAME, "password": PASSWORD},
            timeout=10.0,
            follow_redirects=True
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return
        
        try:
            token = login_response.json()["access_token"]
        except (KeyError, ValueError) as e:
            print(f"❌ Failed to extract access token: {e}")
            return

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # List teams
        response = await client.get(
            f"{BASE_URL}/api/v1/admin/teams",
            headers=headers,
            timeout=10.0,
            follow_redirects=True
        )
        
        if response.status_code == 200:
            teams = response.json()
            print(f"\n✅ Found {len(teams)} teams:\n")
            for team in teams:
                print(f"  {team['name']} (Group {team['group']})")
                for player in team['players']:
                    print(f"    - {player['name']} ({player['role']})")
                print()
        else:
            print(f"❌ Failed: {response.status_code}")
            print(response.text)


if __name__ == "__main__":
    asyncio.run(list_teams())


