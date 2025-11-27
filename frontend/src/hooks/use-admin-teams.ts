/**
 * React Query hooks for admin teams management
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { transformTeams, transformTeam } from "@/lib/api-helpers";
import type { Team } from "@/types";
import { toast } from "sonner";

export function useAdminTeams() {
  return useQuery({
    queryKey: ["admin", "teams"],
    queryFn: async () => {
      const apiTeams = await adminApi.getTeams();
      return transformTeams(apiTeams);
    },
  });
}

export function useAdminTeam(teamId: string | undefined) {
  return useQuery<Team>({
    queryKey: ["admin", "team", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("Team ID is required");
      const apiTeam = await adminApi.getTeam(teamId);
      return transformTeam(apiTeam);
    },
    enabled: !!teamId,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      group: "A" | "B";
      players: Array<{ player_id?: string; name?: string; role: "main" | "reserve" }>;
    }) => {
      const apiTeam = await adminApi.createTeam(data);
      return transformTeam(apiTeam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Tim je uspešno kreiran");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri kreiranju tima");
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      data,
    }: {
      teamId: string;
      data: { 
        name?: string; 
        group?: "A" | "B"; 
        active?: boolean;
        players?: Array<{ player_id?: string; name?: string; role: "main" | "reserve" }>;
      };
    }) => {
      const apiTeam = await adminApi.updateTeam(teamId, data);
      return transformTeam(apiTeam);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "team", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Tim je uspešno ažuriran");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri ažuriranju tima");
    },
  });
}

/**
 * Provides a React Query mutation hook to delete an admin team by ID.
 *
 * @returns A mutation object that deletes a team when called; use `mutate(teamId)` or `mutateAsync(teamId)` to perform the deletion and observe status callbacks (`onSuccess`, `onError`, etc.).
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      await adminApi.deleteTeam(teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Tim je uspešno obrisan");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri brisanju tima");
    },
  });
}

export function useActivateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamId: string) => {
      const apiTeam = await adminApi.activateTeam(teamId);
      return transformTeam(apiTeam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["standings"] });
      toast.success("Tim je uspešno aktiviran");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Greška pri aktiviranju tima");
    },
  });
}

