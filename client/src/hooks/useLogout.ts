import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return function logout() {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login");
  };
}
