/**
 * React Query hooks for matches data
 */
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { transformMatches, transformMatch } from "@/lib/api-helpers";
import type { Match, MatchStatus } from "@/types";

export function useMatches(params?: {
  group?: "A" | "B";
  status?: MatchStatus;
  date_from?: string;
  date_to?: string;
}) {
  return useQuery({
    queryKey: ["matches", params],
    queryFn: async () => {
      const apiMatches = await publicApi.getMatches(params);
      return transformMatches(apiMatches);
    },
  });
}

export function useMatch(matchId: string | undefined) {
  return useQuery<Match>({
    queryKey: ["match", matchId],
    queryFn: async () => {
      if (!matchId) throw new Error("Match ID is required");
      const apiMatch = await publicApi.getMatch(matchId);
      return transformMatch(apiMatch);
    },
    enabled: !!matchId,
  });
}


