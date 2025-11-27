export type PlayerRole = "main" | "reserve";

export type Player = {
  id: string;
  name: string;
  role: PlayerRole;
};

export type Team = {
  id: string;
  name: string;
  group: "A" | "B";
  players: Player[];
  active: boolean;
};

export type MatchStatus = "scheduled" | "in_progress" | "played" | "cancelled";

export type Match = {
  id: string;
  date: string;
  group: "A" | "B";
  homeTeamId: string;
  awayTeamId: string;
  homeSets: number[];
  awaySets: number[];
  status: MatchStatus;
};

export type TeamStanding = {
  teamId: string;
  teamName: string;
  group: "A" | "B";
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsFor: number;
  setsAgainst: number;
  gamesFor: number;
  gamesAgainst: number;
  points: number;
  setDiff: number;
  gameDiff: number;
  position: number;
};

export type DashboardStats = {
  teams: {
    active: number;
    total: number;
    group_a: number;
    group_b: number;
  };
  matches: {
    scheduled: number;
    played: number;
    total: number;
  };
};
