import {
  usePendingInvites,
  useAcceptInvite,
  useRejectInvite,
} from "@/hooks/useInvites";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, User, BookOpen, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkspaceInviteWithDetails } from "@/types/workspaceInvite.types";

function InvitesPage() {
  const { data: invites, isLoading } = usePendingInvites();
  const acceptInvite = useAcceptInvite();
  const rejectInvite = useRejectInvite();

  const roleLabels: Record<string, string> = {
    editor: "Editor",
    viewer: "Visualizador",
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-6 pt-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Convites</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Convites pendentes para workspaces
        </p>
      </div>

      {invites?.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Inbox className="size-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            Nenhum convite pendente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invites?.map((invite: WorkspaceInviteWithDetails) => (
            <Card key={invite.id} className="border-0 bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage
                        src={invite.inviter_avatar_url ?? undefined}
                      />
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {invite.inviter_name}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <BookOpen className="size-3 shrink-0" />
                        <span className="truncate">
                          {invite.workspace_name}
                        </span>
                        <span>·</span>
                        <span>{roleLabels[invite.role] ?? invite.role}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Expira em{" "}
                        {new Date(invite.expires_at).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectInvite.mutate(invite.id)}
                      disabled={rejectInvite.isPending}
                    >
                      <X className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => acceptInvite.mutate(invite.id)}
                      disabled={acceptInvite.isPending}
                    >
                      <Check className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvitesPage;
