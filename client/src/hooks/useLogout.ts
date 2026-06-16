import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async function logout() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch {
        // logout continua mesmo se o servidor falhar
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.clear();
    navigate("/login");
  };
}
