import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => userService.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60,
  });
}

export function usePublicProfile(id: number) {
  return useQuery({
    queryKey: ["users", id, "profile"],
    queryFn: () => userService.getPublicProfile(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
