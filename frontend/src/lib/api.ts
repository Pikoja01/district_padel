/**
 * API Client for District Padel Backend
 */
import type { DashboardStats } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

// API Response Types (matching backend schemas)
export type ApiTeam = {
  id: string;
  name: string;
  group: "A" | "B";
  active: boolean;
  players: Array<{
    id: string;
    name: string;
    role: "main" | "reserve";
  }>;
};

export type ApiMatchSet = {
  id: string;
  set_number: number;
  home_games: number;
  away_games: number;
};

export type ApiMatch = {
  id: string;
  date: string;
  group: "A" | "B";
  home_team_id: string;
  away_team_id: string;
  status: "scheduled" | "in_progress" | "played" | "cancelled";
  match_sets: ApiMatchSet[];
  home_team_name?: string;
  away_team_name?: string;
};

export type ApiTeamStanding = {
  team_id: string;
  team_name: string;
  group: "A" | "B";
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  sets_for: number;
  sets_against: number;
  games_for: number;
  games_against: number;
  points: number;
  set_diff: number;
  game_diff: number;
  position: number;
};

export type ApiToken = {
  access_token: string;
  token_type: string;
};

export type ApiError = {
  detail: string;
};

// Error class for API errors
export class ApiErrorException extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: ApiError
  ) {
    super(message);
    this.name = "ApiErrorException";
  }
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

// Remove auth token from localStorage
export function removeAuthToken(): void {
  localStorage.removeItem("auth_token");
}

// Base fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData: ApiError | undefined;

      try {
        errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiErrorException(response.status, errorMessage, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiErrorException) {
      throw error;
    }

    // Network or other errors
    throw new ApiErrorException(
      0,
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

// Public API endpoints
export const publicApi = {
  // Get all teams
  getTeams: async (params?: { group?: "A" | "B"; active?: boolean }): Promise<ApiTeam[]> => {
    const searchParams = new URLSearchParams();
    if (params?.group) searchParams.append("group", params.group);
    if (params?.active !== undefined) searchParams.append("active", String(params.active));
    
    const query = searchParams.toString();
    return apiRequest<ApiTeam[]>(`/api/v1/public/teams/${query ? `?${query}` : ""}`);
  },

  // Get team by ID
  getTeam: async (teamId: string): Promise<ApiTeam> => {
    return apiRequest<ApiTeam>(`/api/v1/public/teams/${teamId}`);
  },

  // Get all matches
  getMatches: async (params?: {
    group?: "A" | "B";
    status?: "scheduled" | "played";
    date_from?: string;
    date_to?: string;
  }): Promise<ApiMatch[]> => {
    const searchParams = new URLSearchParams();
    if (params?.group) searchParams.append("group", params.group);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.date_from) searchParams.append("date_from", params.date_from);
    if (params?.date_to) searchParams.append("date_to", params.date_to);
    
    const query = searchParams.toString();
    return apiRequest<ApiMatch[]>(`/api/v1/public/matches/${query ? `?${query}` : ""}`);
  },

  // Get match by ID
  getMatch: async (matchId: string): Promise<ApiMatch> => {
    return apiRequest<ApiMatch>(`/api/v1/public/matches/${matchId}`);
  },

  // Get standings
  getStandings: async (params?: { group?: "A" | "B" | "all" }): Promise<ApiTeamStanding[]> => {
    const searchParams = new URLSearchParams();
    if (params?.group && params.group !== "all") {
      searchParams.append("group", params.group);
    }
    
    const query = searchParams.toString();
    return apiRequest<ApiTeamStanding[]>(`/api/v1/public/standings/${query ? `?${query}` : ""}`);
  },

  // Get team standings
  getTeamStanding: async (teamId: string): Promise<ApiTeamStanding> => {
    return apiRequest<ApiTeamStanding>(`/api/v1/public/standings/teams/${teamId}`);
  },
};

// Admin API endpoints
export const adminApi = {
  // Authentication
  login: async (username: string, password: string): Promise<ApiToken> => {
    const token = await apiRequest<ApiToken>("/api/v1/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setAuthToken(token.access_token);
    return token;
  },

  logout: (): void => {
    removeAuthToken();
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest("/api/v1/admin/auth/me");
  },

  // Teams management
  getTeams: async (): Promise<ApiTeam[]> => {
    return apiRequest<ApiTeam[]>("/api/v1/admin/teams/");
  },

  getTeam: async (teamId: string): Promise<ApiTeam> => {
    return apiRequest<ApiTeam>(`/api/v1/admin/teams/${teamId}`);
  },

  createTeam: async (data: {
    name: string;
    group: "A" | "B";
    players: Array<{ player_id?: string; name?: string; role: "main" | "reserve" }>;
  }): Promise<ApiTeam> => {
    return apiRequest<ApiTeam>("/api/v1/admin/teams/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTeam: async (
    teamId: string,
    data: {
      name?: string;
      group?: "A" | "B";
      active?: boolean;
    }
  ): Promise<ApiTeam> => {
    return apiRequest<ApiTeam>(`/api/v1/admin/teams/${teamId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    return apiRequest<void>(`/api/v1/admin/teams/${teamId}`, {
      method: "DELETE",
    });
  },

  activateTeam: async (teamId: string): Promise<ApiTeam> => {
    return apiRequest<ApiTeam>(`/api/v1/admin/teams/${teamId}/activate`, {
      method: "POST",
    });
  },

  // Matches management
  getMatches: async (): Promise<ApiMatch[]> => {
    return apiRequest<ApiMatch[]>("/api/v1/admin/matches/");
  },

  getMatch: async (matchId: string): Promise<ApiMatch> => {
    return apiRequest<ApiMatch>(`/api/v1/admin/matches/${matchId}`);
  },

  createMatch: async (data: {
    date: string;
    group: "A" | "B";
    home_team_id: string;
    away_team_id: string;
  }): Promise<ApiMatch> => {
    return apiRequest<ApiMatch>("/api/v1/admin/matches/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateMatch: async (
    matchId: string,
    data: {
      date?: string;
      group?: "A" | "B";
      home_team_id?: string;
      away_team_id?: string;
    }
  ): Promise<ApiMatch> => {
    return apiRequest<ApiMatch>(`/api/v1/admin/matches/${matchId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  enterMatchResult: async (
    matchId: string,
    data: {
      sets: Array<{
        set_number: number;
        home_games: number;
        away_games: number;
      }>;
    }
  ): Promise<ApiMatch> => {
    return apiRequest<ApiMatch>(`/api/v1/admin/matches/${matchId}/result`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteMatch: async (matchId: string): Promise<void> => {
    return apiRequest<void>(`/api/v1/admin/matches/${matchId}`, {
      method: "DELETE",
    });
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>("/api/v1/admin/dashboard/stats");
  },
};

