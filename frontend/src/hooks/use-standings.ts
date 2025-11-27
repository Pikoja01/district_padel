/**
 * React Query hooks for standings data
 */
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { transformStandings, transformTeamStanding } from "@/lib/api-helpers";
import type { TeamStanding } from "@/types";

export function useStandings(params?: { group?: "A" | "B" | "all" }) {
  return useQuery({
    queryKey: ["standings", params],
    queryFn: async () => {
      const apiStandings = await publicApi.getStandings(params);
      return transformStandings(apiStandings);
    },
  });
}

export function useTeamStanding(teamId: string | undefined) {
  return useQuery<TeamStanding>({
    queryKey: ["teamStanding", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("Team ID is required");
      const apiStanding = await publicApi.getTeamStanding(teamId);
      return transformTeamStanding(apiStanding);
    },
    enabled: !!teamId,
  });
}


