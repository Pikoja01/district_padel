/**
 * React Query hook for admin dashboard statistics
 */
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      return await adminApi.getDashboardStats();
    },
  });
}

