import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePasswordSchema,
  type UpdatePasswordSchema,
} from "@/schemas/user.schemas";
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
import { KeyRound } from "lucide-react";
import { useUpdatePassword } from "@/hooks/useMe";

export function ChangePasswordForm() {
  const updatePassword = useUpdatePassword();

  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: UpdatePasswordSchema) {
    updatePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <Card className="border-0 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          Trocar senha
        </CardTitle>
        <CardDescription>
          Sua senha deve ter no mínimo 8 caracteres
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              {...form.register("currentPassword")}
              aria-invalid={!!form.formState.errors.currentPassword}
            />
            {form.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              {...form.register("newPassword")}
              aria-invalid={!!form.formState.errors.newPassword}
            />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword")}
              aria-invalid={!!form.formState.errors.confirmPassword}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={updatePassword.isPending}>
            {updatePassword.isPending ? "Salvando..." : "Trocar senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
