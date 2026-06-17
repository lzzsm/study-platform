import { useState } from "react";
import { useLogoutAll, useDeleteAccount } from "@/hooks/useMe";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Trash2 } from "lucide-react";

export function DangerZone() {
  const logoutAll = useLogoutAll();
  const deleteAccount = useDeleteAccount();
  const [password, setPassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-destructive">
          <Trash2 className="size-4" />
          Zona de perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis — tenha certeza antes de prosseguir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sair de todos os dispositivos */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="text-sm font-medium">Sair de todos os dispositivos</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Invalida todas as sessões ativas
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogoutAllOpen(true)}
          >
            <LogOut className="size-4 mr-2" />
            Sair de todos
          </Button>
        </div>

        <AlertDialog open={logoutAllOpen} onOpenChange={setLogoutAllOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Sair de todos os dispositivos?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você será deslogado de todas as sessões ativas, incluindo esta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <Button
                onClick={() => logoutAll.mutate()}
                disabled={logoutAll.isPending}
              >
                {logoutAll.isPending ? "Saindo..." : "Confirmar"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Excluir conta */}
        <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
          <div>
            <p className="text-sm font-medium text-destructive">
              Excluir conta
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Remove permanentemente sua conta e todos os dados
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4 mr-2" />
            Excluir conta
          </Button>
        </div>

        <AlertDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open);
            if (!open) setPassword("");
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Excluir conta permanentemente?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Todos os seus workspaces, tarefas, metas e hábitos serão
                removidos. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5 px-1">
              <Label htmlFor="confirm-password">
                Digite sua senha para confirmar
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={!password || deleteAccount.isPending}
                onClick={() => deleteAccount.mutate(password)}
              >
                {deleteAccount.isPending ? "Excluindo..." : "Excluir conta"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
