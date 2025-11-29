/**
 * Helper functions to transform API responses to frontend types
 */
import type { ApiTeam, ApiMatch, ApiTeamStanding } from "./api";
import type { Team, Match, TeamStanding } from "@/types";

/**
 * Transform API team to frontend Team type
 */
export function transformTeam(apiTeam: ApiTeam): Team {
  return {
    id: apiTeam.id,
    name: apiTeam.name,
    group: apiTeam.group,
    active: apiTeam.active,
    players: apiTeam.players.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
    })),
  };
}

/**
 * Transform API match to frontend Match type
 */
export function transformMatch(apiMatch: ApiMatch): Match {
  // Sort match sets by set_number and extract games
  const sortedSets = [...apiMatch.match_sets].sort(
    (a, b) => a.set_number - b.set_number
  );

  const homeSets: number[] = [];
  const awaySets: number[] = [];

  sortedSets.forEach((set) => {
    homeSets.push(set.home_games);
    awaySets.push(set.away_games);
  });

  return {
    id: apiMatch.id,
    date: apiMatch.date,
    group: apiMatch.group,
    kolo: apiMatch.round || null,
    homeTeamId: apiMatch.home_team_id,
    awayTeamId: apiMatch.away_team_id,
    homeSets,
    awaySets,
    status: apiMatch.status,
  };
}

/**
 * Transform API team standing to frontend TeamStanding type
 */
export function transformTeamStanding(apiStanding: ApiTeamStanding): TeamStanding {
  return {
    teamId: apiStanding.team_id,
    teamName: apiStanding.team_name,
    group: apiStanding.group,
    matchesPlayed: apiStanding.matches_played,
    matchesWon: apiStanding.matches_won,
    matchesLost: apiStanding.matches_lost,
    setsFor: apiStanding.sets_for,
    setsAgainst: apiStanding.sets_against,
    gamesFor: apiStanding.games_for,
    gamesAgainst: apiStanding.games_against,
    points: apiStanding.points,
    setDiff: apiStanding.set_diff,
    gameDiff: apiStanding.game_diff,
    position: apiStanding.position,
  };
}

/**
 * Transform array of API teams to frontend Team[] type
 */
export function transformTeams(apiTeams: ApiTeam[]): Team[] {
  return apiTeams.map(transformTeam);
}

/**
 * Transform array of API matches to frontend Match[] type
 */
export function transformMatches(apiMatches: ApiMatch[]): Match[] {
  return apiMatches.map(transformMatch);
}

/**
 * Transform array of API standings to frontend TeamStanding[] type
 */
export function transformStandings(apiStandings: ApiTeamStanding[]): TeamStanding[] {
  return apiStandings.map(transformTeamStanding);
}


