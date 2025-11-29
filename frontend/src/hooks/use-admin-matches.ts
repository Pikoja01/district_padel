/**
 * React Query hooks for admin matches management
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { transformMatches, transformMatch } from "@/lib/api-helpers";
import type { Match } from "@/types";
import { toast } from "sonner";

export function useAdminMatches() {
  return useQuery({
    queryKey: ["admin", "matches"],
    queryFn: async () => {
      const apiMatches = await adminApi.getMatches();
      return transformMatches(apiMatches);
    },
  });
}

export function useAdminMatch(matchId: string | undefined) {
  return useQuery<Match>({
    queryKey: ["admin", "match", matchId],
    queryFn: async () => {
      if (!matchId) throw new Error("Match ID is required");
      const apiMatch = await adminApi.getMatch(matchId);
      return transformMatch(apiMatch);
    },
    enabled: !!matchId,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      date: string;
      group: "A" | "B";
      home_team_id: string;
      away_team_id: string;
    }) => {
      const apiMatch = await adminApi.createMatch(data);
      return transformMatch(apiMatch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "matches"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Mec je uspešno zakazan");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri zakazivanju meca");
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      data,
    }: {
      matchId: string;
      data: {
        date?: string;
        group?: "A" | "B";
        round?: string | null;
        home_team_id?: string;
        away_team_id?: string;
      };
    }) => {
      const apiMatch = await adminApi.updateMatch(matchId, data);
      return transformMatch(apiMatch);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "matches"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "match", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Mec je uspešno ažuriran");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri ažuriranju meca");
    },
  });
}

export function useEnterMatchResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      data,
    }: {
      matchId: string;
      data: {
        sets: Array<{
          set_number: number;
          home_games: number;
          away_games: number;
        }>;
      };
    }) => {
      const apiMatch = await adminApi.enterMatchResult(matchId, data);
      return transformMatch(apiMatch);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["admin", "matches"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "match", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Rezultat meca je uspešno unet");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri unošenju rezultata");
    },
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: string) => {
      await adminApi.deleteMatch(matchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "matches"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Mec je uspešno otkazan");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri otkazivanju meca");
    },
  });
}

