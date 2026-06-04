import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: userService.getMe,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
