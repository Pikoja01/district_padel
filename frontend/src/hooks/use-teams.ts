/**
 * React Query hooks for teams data
 */
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { transformTeams, transformTeam } from "@/lib/api-helpers";
import type { Team } from "@/types";

export function useTeams(params?: { group?: "A" | "B"; active?: boolean }) {
  return useQuery({
    queryKey: ["teams", params],
    queryFn: async () => {
      const apiTeams = await publicApi.getTeams(params);
      return transformTeams(apiTeams);
    },
  });
}

export function useTeam(teamId: string | undefined) {
  return useQuery<Team>({
    queryKey: ["team", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("Team ID is required");
      const apiTeam = await publicApi.getTeam(teamId);
      return transformTeam(apiTeam);
    },
    enabled: !!teamId,
  });
}


