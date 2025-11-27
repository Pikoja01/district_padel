"""
Script to create matches, enter results, and show standings
"""
import asyncio
import httpx
from datetime import date, timedelta

import os

BASE_URL = "http://localhost:8000"
USERNAME = os.environ.get("ADMIN_USERNAME", "admin@test")
PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")


async def create_matches_and_results():
    """Create matches, enter results, and show standings"""
    async with httpx.AsyncClient() as client:
        # Login
        print("🔐 Logging in...")
        login_response = await client.post(
            f"{BASE_URL}/api/v1/admin/auth/login",
            json={"username": USERNAME, "password": PASSWORD},
            timeout=10.0,
            follow_redirects=True
        )
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return
        
        token = login_response.json()["access_token"]
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        print("✅ Login successful!\n")
        
        # Get all teams
        print("📋 Fetching teams...")
        teams_response = await client.get(
            f"{BASE_URL}/api/v1/admin/teams",
            headers=headers,
            timeout=10.0,
            follow_redirects=True
        )
        
        if teams_response.status_code != 200:
            print(f"❌ Failed to get teams: {teams_response.status_code}")
            return
        
        teams = teams_response.json()
        print(f"✅ Found {len(teams)} teams\n")
        
        # Organize teams by group
        group_a_teams = [t for t in teams if t["group"] == "A"]
        group_b_teams = [t for t in teams if t["group"] == "B"]
        
        print(f"   Group A: {len(group_a_teams)} teams")
        print(f"   Group B: {len(group_b_teams)} teams\n")
        
        # Get existing matches to avoid duplicates
        print("📋 Checking existing matches...")
        existing_matches_response = await client.get(
            f"{BASE_URL}/api/v1/admin/matches",
            headers=headers,
            timeout=10.0,
            follow_redirects=True
        )
        existing_matches = existing_matches_response.json() if existing_matches_response.status_code == 200 else []
        existing_match_keys = set()
        for m in existing_matches:
            # Check exact home/away matchup (not just team pair)
            key = (str(m["home_team_id"]), str(m["away_team_id"]))
            existing_match_keys.add(key)
        print(f"   Found {len(existing_matches)} existing matches\n")
        
        # Create matches and results
        today = date.today()
        day_offset = 0
        
        # Helper function to create match and enter result
        async def create_match_with_result(home_team, away_team, sets_result, description):
            nonlocal day_offset
            match_key = (str(home_team["id"]), str(away_team["id"]))
            
            if match_key in existing_match_keys:
                print(f"   ⏭️  Skipping {home_team['name']} vs {away_team['name']} (already exists)")
                return None
            
            match_data = {
                "date": str(today + timedelta(days=day_offset)),
                "group": home_team["group"],
                "home_team_id": home_team["id"],
                "away_team_id": away_team["id"]
            }
            
            response = await client.post(
                f"{BASE_URL}/api/v1/admin/matches",
                json=match_data,
                headers=headers,
                timeout=10.0,
                follow_redirects=True
            )
            
            if response.status_code == 201:
                match_info = response.json()
                print(f"   ✅ Created: {match_info['home_team_name']} vs {match_info['away_team_name']}")
                
                # Enter result
                result_data = {"sets": sets_result}
                result_response = await client.post(
                    f"{BASE_URL}/api/v1/admin/matches/{match_info['id']}/result",
                    json=result_data,
                    headers=headers,
                    timeout=10.0,
                    follow_redirects=True
                )
                if result_response.status_code == 200:
                    print(f"      ✅ Result: {description}\n")
                    day_offset += 1
                    existing_match_keys.add(match_key)
                    return match_info["id"]
                else:
                    print(f"      ❌ Failed to enter result: {result_response.status_code} - {result_response.text}")
            else:
                if response.status_code != 400 or "already exists" not in response.text.lower():
                    print(f"      ❌ Failed: {response.status_code} - {response.text}")
            return None        
        # Group A matches - create all combinations (3 teams = 6 matches)
        print("⚽ Creating Group A matches...")
        if len(group_a_teams) >= 3:
            # Find team indices by name for clarity
            eagles = next((t for t in group_a_teams if t["name"] == "Eagles"), group_a_teams[0])
            tigers = next((t for t in group_a_teams if t["name"] == "Tigers"), group_a_teams[1])
            sharks = next((t for t in group_a_teams if t["name"] == "Sharks"), group_a_teams[2])
            
            # Eagles vs Tigers - 2-0 win (3 points)
            await create_match_with_result(
                eagles, tigers,
                [
                    {"set_number": 1, "home_games": 6, "away_games": 4},
                    {"set_number": 2, "home_games": 6, "away_games": 3}
                ],
                "2-0 (6-4, 6-3) - Eagles wins 3pts"
            )
            
            # Eagles vs Sharks - 1-2 loss (1 point for Eagles, 2 points for Sharks)
            await create_match_with_result(
                eagles, sharks,
                [
                    {"set_number": 1, "home_games": 4, "away_games": 6},
                    {"set_number": 2, "home_games": 6, "away_games": 3},
                    {"set_number": 3, "home_games": 5, "away_games": 7}
                ],
                "1-2 (4-6, 6-3, 5-7) - Sharks wins 2pts, Eagles gets 1pt"
            )
            
            # Tigers vs Sharks - 2-1 win (2 points)
            await create_match_with_result(
                tigers, sharks,
                [
                    {"set_number": 1, "home_games": 6, "away_games": 2},
                    {"set_number": 2, "home_games": 4, "away_games": 6},
                    {"set_number": 3, "home_games": 6, "away_games": 4}
                ],
                "2-1 (6-2, 4-6, 6-4) - Tigers wins 2pts, Sharks gets 1pt"
            )
            
            # Tigers vs Eagles (reverse) - 2-1 win (2 points)
            await create_match_with_result(
                tigers, eagles,
                [
                    {"set_number": 1, "home_games": 7, "away_games": 5},
                    {"set_number": 2, "home_games": 3, "away_games": 6},
                    {"set_number": 3, "home_games": 6, "away_games": 3}
                ],
                "2-1 (7-5, 3-6, 6-3) - Tigers wins 2pts, Eagles gets 1pt"
            )
            
            # Sharks vs Tigers (reverse) - 2-0 win (3 points)
            await create_match_with_result(
                sharks, tigers,
                [
                    {"set_number": 1, "home_games": 6, "away_games": 2},
                    {"set_number": 2, "home_games": 6, "away_games": 4}
                ],
                "2-0 (6-2, 6-4) - Sharks wins 3pts"
            )
            
            # Sharks vs Eagles (reverse) - 2-1 win (2 points)
            await create_match_with_result(
                sharks, eagles,
                [
                    {"set_number": 1, "home_games": 4, "away_games": 6},
                    {"set_number": 2, "home_games": 7, "away_games": 5},
                    {"set_number": 3, "home_games": 6, "away_games": 4}
                ],
                "2-1 (4-6, 7-5, 6-4) - Sharks wins 2pts, Eagles gets 1pt"
            )
        
        # Group B matches - create all combinations
        print("⚽ Creating Group B matches...")
        if len(group_b_teams) >= 2:
            # Lions vs Wolves - 2-0 win (3 points)
            await create_match_with_result(
                group_b_teams[0], group_b_teams[1],
                [
                    {"set_number": 1, "home_games": 6, "away_games": 3},
                    {"set_number": 2, "home_games": 7, "away_games": 5}
                ],
                "2-0 (6-3, 7-5) - Lions wins 3pts"
            )
            
            # Wolves vs Lions (reverse) - 2-1 win (2 points)
            await create_match_with_result(
                group_b_teams[1], group_b_teams[0],
                [
                    {"set_number": 1, "home_games": 6, "away_games": 4},
                    {"set_number": 2, "home_games": 3, "away_games": 6},
                    {"set_number": 3, "home_games": 7, "away_games": 5}
                ],
                "2-1 (6-4, 3-6, 7-5) - Wolves wins 2pts, Lions gets 1pt"
            )
        
        # Show standings
        print("📊 Fetching standings...")
        standings_response = await client.get(
            f"{BASE_URL}/api/v1/public/standings",
            headers={"Content-Type": "application/json"},
            timeout=10.0,
            follow_redirects=True
        )
        
        if standings_response.status_code == 200:
            standings = standings_response.json()
            print("\n" + "="*80)
            print("📊 CURRENT LEAGUE STANDINGS")
            print("="*80)
            
            # Group A standings
            group_a_standings = [s for s in standings if s["group"] == "A"]
            if group_a_standings:
                print("\n🏆 GROUP A")
                print("-"*80)
                print(f"{'Pos':<5} {'Team':<20} {'MP':<5} {'W':<5} {'L':<5} {'Sets':<10} {'Games':<12} {'Points':<8}")
                print("-"*80)
                for s in sorted(group_a_standings, key=lambda x: (x["position"], -x["points"])):
                    sets_str = f"{s['sets_for']}-{s['sets_against']}"
                    games_str = f"{s['games_for']}-{s['games_against']}"
                    print(f"{s['position']:<5} {s['team_name']:<20} {s['matches_played']:<5} {s['matches_won']:<5} {s['matches_lost']:<5} {sets_str:<10} {games_str:<12} {s['points']:<8}")
            
            # Group B standings
            group_b_standings = [s for s in standings if s["group"] == "B"]
            if group_b_standings:
                print("\n🏆 GROUP B")
                print("-"*80)
                print(f"{'Pos':<5} {'Team':<20} {'MP':<5} {'W':<5} {'L':<5} {'Sets':<10} {'Games':<12} {'Points':<8}")
                print("-"*80)
                for s in sorted(group_b_standings, key=lambda x: (x["position"], -x["points"])):
                    sets_str = f"{s['sets_for']}-{s['sets_against']}"
                    games_str = f"{s['games_for']}-{s['games_against']}"
                    print(f"{s['position']:<5} {s['team_name']:<20} {s['matches_played']:<5} {s['matches_won']:<5} {s['matches_lost']:<5} {sets_str:<10} {games_str:<12} {s['points']:<8}")
            
            print("\n" + "="*80)
        else:
            print(f"❌ Failed to get standings: {standings_response.status_code}")
            print(standings_response.text)


if __name__ == "__main__":
    asyncio.run(create_matches_and_results())

