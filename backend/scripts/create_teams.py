"""
Script to create 5 teams with Serbian-style player names
"""
import asyncio
import httpx
import sys

BASE_URL = "http://localhost:8000"  # Internal container port
USERNAME = "admin@test"
PASSWORD = "admin123"

TEAMS = [
    {
        "name": "Eagles",
        "group": "A",
        "players": [
            {"name": "Marko Markovic", "role": "main"},
            {"name": "Petar Petrovic", "role": "main"},
            {"name": "Stefan Stefanovic", "role": "reserve"}
        ]
    },
    {
        "name": "Lions",
        "group": "B",
        "players": [
            {"name": "Nikola Nikolic", "role": "main"},
            {"name": "Milan Milanovic", "role": "main"}
        ]
    },
    {
        "name": "Tigers",
        "group": "A",
        "players": [
            {"name": "Jovan Jovanovic", "role": "main"},
            {"name": "Aleksandar Aleksandrovic", "role": "main"},
            {"name": "Dusan Dusanic", "role": "reserve"}
        ]
    },
    {
        "name": "Wolves",
        "group": "B",
        "players": [
            {"name": "Luka Lukic", "role": "main"},
            {"name": "Filip Filipovic", "role": "main"}
        ]
    },
    {
        "name": "Sharks",
        "group": "A",
        "players": [
            {"name": "Nemanja Nemanjic", "role": "main"},
            {"name": "Marko Novakovic", "role": "main"},
            {"name": "Stefan Milic", "role": "reserve"}
        ]
    }
]


async def create_teams():
    """Create all teams"""
    async with httpx.AsyncClient() as client:
        # First, login to get a fresh token
        print("🔐 Logging in...")
        login_response = await client.post(
            f"{BASE_URL}/api/v1/admin/auth/login",
            json={"username": USERNAME, "password": PASSWORD},
            timeout=10.0,
            follow_redirects=True
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"   Error: {login_response.text}")
            return
        
        token_data = login_response.json()
        token = token_data["access_token"]
        print(f"✅ Login successful! Token expires in 24 hours.\n")
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        for team in TEAMS:
            try:
                response = await client.post(
                    f"{BASE_URL}/api/v1/admin/teams",
                    json=team,
                    headers=headers,
                    timeout=10.0,
                    follow_redirects=True
                )
                
                if response.status_code == 201:
                    result = response.json()
                    print(f"✅ Created team: {result['name']} (ID: {result['id']})")
                    print(f"   Players: {', '.join([p['name'] for p in result['players']])}")
                else:
                    print(f"❌ Failed to create team {team['name']}: {response.status_code}")
                    print(f"   Error: {response.text}")
            except Exception as e:
                print(f"❌ Error creating team {team['name']}: {str(e)}")


if __name__ == "__main__":
    asyncio.run(create_teams())

