import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket } from "@/services/socket";
import { toast } from "sonner";

interface InviteReceivedPayload {
  id: number;
  workspace_id: number;
  workspace_name: string;
  inviter_name: string;
  role: string;
}

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("invite:received", (payload: InviteReceivedPayload) => {
      // invalida a query de convites pendentes
      queryClient.invalidateQueries({ queryKey: ["invites"] });

      // mostra toast de notificação
      toast(`Convite recebido de ${payload.inviter_name}`, {
        description: `Para o workspace "${payload.workspace_name}"`,
        action: {
          label: "Ver convites",
          onClick: () => (window.location.href = "/invites"),
        },
      });
    });

    socket.on("invite:cancelled", () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    });

    socket.on("workspace:removed", (payload: { workspace_id: number }) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // se o usuário removido estiver dentro daquele workspace agora, manda pro dashboard
      if (window.location.pathname === `/workspaces/${payload.workspace_id}`) {
        window.location.href = "/dashboard";
      }
    });

    return () => {
      socket.off("invite:received");
      socket.off("invite:cancelled");
      socket.off("workspace:removed");
      disconnectSocket();
    };
  }, [queryClient]);
}
