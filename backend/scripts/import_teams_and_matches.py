"""
Complete import script: Creates teams from JSON, then processes match schedule
This script:
1. Creates teams via API (which generates team IDs)
2. Fetches all teams to build name->ID mapping
3. Processes match schedule and maps team names to IDs
"""
import json
import csv
import asyncio
import httpx
import sys
import os
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
import re

# When running inside Docker, use internal service name and port
# When running outside Docker, use localhost:8001
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000")  # Default to internal Docker port
USERNAME = os.environ.get("ADMIN_USERNAME", "admin@test.com")
PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")


async def login(client: httpx.AsyncClient) -> str:
    """Login and get auth token"""
    print("Logging in...")
    response = await client.post(
        f"{BASE_URL}/api/v1/admin/auth/login",
        json={"username": USERNAME, "password": PASSWORD},
        timeout=10.0,
        follow_redirects=True
    )
    
    if response.status_code != 200:
        print(f"ERROR: Login failed: {response.status_code}")
        print(f"   Error: {response.text}")
        sys.exit(1)
    
    token = response.json()["access_token"]
    print("Login successful!\n")
    return token


async def create_teams_from_json(client: httpx.AsyncClient, token: str, teams_json_path: str) -> List[Dict]:
    """Create teams from JSON file and return created teams with IDs"""
    print("Creating teams from JSON...")
    
    with open(teams_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    teams_data = data.get("teams", [])
    created_teams = []
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    for team_data in teams_data:
        # Remove _original_line if present (not needed for API)
        team_payload = {k: v for k, v in team_data.items() if not k.startswith("_")}
        
        try:
            response = await client.post(
                f"{BASE_URL}/api/v1/admin/teams/",
                json=team_payload,
                headers=headers,
                timeout=10.0,
                follow_redirects=True
            )
            
            if response.status_code == 201:
                created_team = response.json()
                created_teams.append(created_team)
                print(f"  Created: {created_team['name']} (ID: {created_team['id']})")
            elif response.status_code == 400 and "already exists" in response.text.lower():
                print(f"  Skipped: {team_data['name']} (already exists)")
            else:
                print(f"  ERROR: Failed to create {team_data['name']}: {response.status_code}")
                print(f"    {response.text}")
        except Exception as e:
            print(f"  ERROR: Exception creating {team_data['name']}: {str(e)}")
    
    print(f"\nCreated {len(created_teams)} teams\n")
    return created_teams


async def fetch_all_teams(client: httpx.AsyncClient, token: str) -> Dict[str, str]:
    """Fetch all teams and create name->ID mapping"""
    print("Fetching all teams to build name->ID mapping...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = await client.get(
        f"{BASE_URL}/api/v1/admin/teams/",
        headers=headers,
        timeout=10.0,
        follow_redirects=True
    )
    
    if response.status_code != 200:
        print(f"ERROR: Failed to fetch teams: {response.status_code}")
        print(response.text)
        sys.exit(1)
    
    teams = response.json()
    name_to_id = {team["name"]: team["id"] for team in teams}
    
    print(f"Found {len(name_to_id)} teams\n")
    return name_to_id


def generate_team_name_from_player_names(player_names_str: str) -> str:
    """
    Generate team name from player names string (e.g., "Milos Milutinovic-Marko Milutinovic")
    Uses the same logic as the API: takes surname (2nd word), first 3 letters, uppercase, join with " | "
    """
    # Split by dashes to get individual player names
    players_str = re.split(r'[-–—]', player_names_str)
    players = [p.strip() for p in players_str if p.strip()]
    
    surnames = []
    for player_name in players:
        name_parts = player_name.strip().split()
        if len(name_parts) >= 2:
            surname = name_parts[1]  # 2nd word is surname
            # Take first 3 letters, uppercase
            surname_code = surname[:3].upper()
            surnames.append(surname_code)
    
    # Combine all surname codes with " | " separator
    return " | ".join(surnames) if surnames else None


def parse_matches_csv(file_path: str, team_name_mapping: Dict[str, str]) -> List[Dict]:
    """
    Parse matches from CSV file
    Expected columns: Start (or Date), End (or Time), Group, Team A, Team B
    Team A and Team B columns contain player names (e.g., "Milos Milutinovic-Marko Milutinovic")
    The script will automatically generate team names and match them to database teams
    """
    matches = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Try to find date and time columns (case-insensitive)
            date_col = None
            time_col = None
            team_a_col = None
            team_b_col = None
            group_col = None
            
            for col in row.keys():
                col_lower = col.lower().strip()
                if 'start' in col_lower or 'date' in col_lower:
                    date_col = col
                elif 'end' in col_lower or 'time' in col_lower:
                    time_col = col
                elif 'team a' in col_lower or col_lower == 'team a':
                    team_a_col = col
                elif 'team b' in col_lower or col_lower == 'team b':
                    team_b_col = col
                elif 'home' in col_lower:
                    # Fallback: if no Team A/B, use Home/Away
                    if not team_a_col:
                        team_a_col = col
                elif 'away' in col_lower:
                    if not team_b_col:
                        team_b_col = col
                elif 'group' in col_lower or 'grupa' in col_lower:
                    group_col = col
            
            if not all([date_col, team_a_col, team_b_col]):
                print(f"WARNING: Skipping row - missing required columns")
                print(f"  Found: date_col={date_col}, team_a_col={team_a_col}, team_b_col={team_b_col}")
                continue
            
            # Parse date
            date_str = row[date_col].strip()
            try:
                # Try various date formats
                # Handle "Start" column format: "2025-11-30 Sun 16:00" or just date+time
                dt = None
                
                # First, try to parse the date_str directly (might contain date and time)
                for fmt in [
                    "%Y-%m-%d %a %H:%M",  # "2025-11-30 Sun 16:00"
                    "%Y-%m-%d %H:%M",     # "2025-11-30 16:00"
                    "%d.%m.%Y %H:%M",     # "30.11.2025 16:00"
                    "%d/%m/%Y %H:%M",     # "30/11/2025 16:00"
                    "%Y-%m-%d %H:%M:%S",  # With seconds
                    "%d.%m.%Y %H:%M:%S",
                    "%d/%m/%Y %H:%M:%S"
                ]:
                    try:
                        dt = datetime.strptime(date_str, fmt)
                        break
                    except ValueError:
                        continue
                
                # If date_str didn't work and we have a time column, combine them
                if dt is None and time_col and row.get(time_col):
                    time_str = row[time_col].strip()
                    datetime_str = f"{date_str} {time_str}"
                    for fmt in [
                        "%Y-%m-%d %H:%M",
                        "%d.%m.%Y %H:%M",
                        "%d/%m/%Y %H:%M",
                        "%Y-%m-%d %H:%M:%S",
                        "%d.%m.%Y %H:%M:%S",
                        "%d/%m/%Y %H:%M:%S"
                    ]:
                        try:
                            dt = datetime.strptime(datetime_str, fmt)
                            break
                        except ValueError:
                            continue
                
                # If still no match, try just date
                if dt is None:
                    for fmt in ["%Y-%m-%d", "%d.%m.%Y", "%d/%m/%Y"]:
                        try:
                            dt = datetime.strptime(date_str, fmt)
                            break
                        except ValueError:
                            continue
                
                if dt is None:
                    print(f"WARNING: Could not parse date: '{date_str}'")
                    continue
                
                # Store full datetime (date + time)
                match_datetime = dt
            except Exception as e:
                print(f"WARNING: Error parsing date: {e}")
                continue
            
            # Get team player names from CSV
            team_a_players = row[team_a_col].strip()
            team_b_players = row[team_b_col].strip()
            
            # Generate team names from player names (same logic as API)
            home_team_name = generate_team_name_from_player_names(team_a_players)
            away_team_name = generate_team_name_from_player_names(team_b_players)
            
            if not home_team_name:
                print(f"WARNING: Could not generate team name from: '{team_a_players}'")
                continue
            if not away_team_name:
                print(f"WARNING: Could not generate team name from: '{team_b_players}'")
                continue
            
            # Map generated team names to IDs
            home_team_id = team_name_mapping.get(home_team_name)
            away_team_id = team_name_mapping.get(away_team_name)
            
            if not home_team_id:
                print(f"WARNING: Home team not found: '{home_team_name}' (from players: {team_a_players})")
                print(f"  Available teams: {list(team_name_mapping.keys())[:5]}...")
                continue
            if not away_team_id:
                print(f"WARNING: Away team not found: '{away_team_name}' (from players: {team_b_players})")
                print(f"  Available teams: {list(team_name_mapping.keys())[:5]}...")
                continue
            
            # Get group
            if group_col and row.get(group_col):
                group = row[group_col].strip().upper()
                if group not in ["A", "B"]:
                    # Try to extract A or B
                    match = re.search(r'[AB]', group, re.IGNORECASE)
                    if match:
                        group = match.group().upper()
                    else:
                        print(f"WARNING: Invalid group: {group}, skipping")
                        continue
            else:
                # Try to infer from teams - check if both teams are in same group
                # This would require checking the teams list, but for now we'll require group column
                print(f"WARNING: No group specified, skipping")
                continue
            
            # Get round (kolo)
            round_value = None
            for col in row.keys():
                col_lower = col.lower().strip()
                if 'round' in col_lower or 'kolo' in col_lower:
                    round_value = row[col].strip() if row.get(col) else None
                    break
            
            matches.append({
                "date": match_datetime.isoformat(),
                "group": group,
                "round": round_value,
                "home_team_id": home_team_id,
                "away_team_id": away_team_id,
                "_original_home_team": team_a_players,
                "_original_away_team": team_b_players,
                "_generated_home_name": home_team_name,
                "_generated_away_name": away_team_name
            })
    
    return matches


async def create_matches(client: httpx.AsyncClient, token: str, matches: List[Dict]) -> int:
    """Create matches via API"""
    print(f"Creating {len(matches)} matches...")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    created_count = 0
    skipped_count = 0
    
    for match_data in matches:
        # Remove _original fields (not needed for API)
        match_payload = {k: v for k, v in match_data.items() if not k.startswith("_")}
        
        try:
            response = await client.post(
                f"{BASE_URL}/api/v1/admin/matches/",
                json=match_payload,
                headers=headers,
                timeout=10.0,
                follow_redirects=True
            )
            
            if response.status_code == 201:
                created_count += 1
                match_info = response.json()
                print(f"  Created: {match_info.get('home_team_name', '?')} vs {match_info.get('away_team_name', '?')} on {match_data['date']}")
            elif response.status_code == 400 and "already exists" in response.text.lower():
                skipped_count += 1
                print(f"  Skipped: Match already exists")
            else:
                print(f"  ERROR: Failed to create match: {response.status_code}")
                print(f"    {response.text}")
        except Exception as e:
            print(f"  ERROR: Exception creating match: {str(e)}")
    
    print(f"\nCreated {created_count} matches, skipped {skipped_count}\n")
    return created_count


async def main():
    """Main workflow"""
    if len(sys.argv) < 2:
        print("Usage: python import_teams_and_matches.py <teams_json> [matches_csv]")
        print("\nExample:")
        print("  python import_teams_and_matches.py teams_import.json")
        print("  python import_teams_and_matches.py teams_import.json matches.csv")
        print("\nEnvironment variables:")
        print("  BASE_URL - API base URL (default: http://localhost:8000)")
        print("  ADMIN_USERNAME - Admin username (default: admin@test.com)")
        print("  ADMIN_PASSWORD - Admin password (default: admin123)")
        sys.exit(1)
    
    teams_json = sys.argv[1]
    matches_csv = sys.argv[2] if len(sys.argv) > 2 else None
    
    async with httpx.AsyncClient() as client:
        # Step 1: Login
        token = await login(client)
        
        # Step 2: Create teams from JSON
        created_teams = await create_teams_from_json(client, token, teams_json)
        
        # Step 3: Fetch all teams to build name->ID mapping
        team_name_mapping = await fetch_all_teams(client, token)
        
        # Step 4: Process matches if provided
        if matches_csv:
            print("Processing match schedule...")
            matches = parse_matches_csv(matches_csv, team_name_mapping)
            
            if matches:
                print(f"Parsed {len(matches)} matches from schedule\n")
                
                # Step 5: Create matches
                await create_matches(client, token, matches)
            else:
                print("No matches found in schedule file")
        else:
            print("No match schedule provided.")
            print("To import matches, provide a CSV file with columns:")
            print("  Date, Time, Home Team, Away Team, Group")
            print("  Team names should match generated names (e.g., 'MIL | MIL')")


if __name__ == "__main__":
    asyncio.run(main())

