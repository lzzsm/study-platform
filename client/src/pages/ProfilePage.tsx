import { useMe, useUpdateProfile, useUpdatePassword } from "@/hooks/useMe";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileSchema,
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";
import { useEffect } from "react";

function ProfilePage() {
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const profileForm = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", bio: "", avatar_url: "" },
  });

  const passwordForm = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Preenche o form com os dados do usuário quando carregam
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        bio: user.bio ?? "",
        avatar_url: user.avatar_url ?? "",
      });
    }
  }, [user, profileForm]);

  function onProfileSubmit(data: UpdateProfileSchema) {
    updateProfile.mutate({
      name: data.name,
      bio: data.bio || undefined,
      avatar_url: data.avatar_url || undefined,
    });
  }

  function onPasswordSubmit(data: UpdatePasswordSchema) {
    updatePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => passwordForm.reset() },
    );
  }

  if (isLoading) return <DashboardPageSkeleton />;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* ── AVATAR + INFO ── */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={user?.avatar_url ?? undefined} />
          <AvatarFallback>
            <User className="size-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {user?.bio && (
            <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* ── EDITAR PERFIL ── */}
      <Card className="border-0 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Informações pessoais</CardTitle>
          <CardDescription>
            Atualize seu nome, bio e foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...profileForm.register("name")}
                aria-invalid={!!profileForm.formState.errors.name}
              />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={3}
                placeholder="Conte um pouco sobre você..."
                {...profileForm.register("bio")}
              />
              {profileForm.formState.errors.bio && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.bio.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="avatar_url">URL da foto de perfil</Label>
              <Input
                id="avatar_url"
                placeholder="https://..."
                {...profileForm.register("avatar_url")}
                aria-invalid={!!profileForm.formState.errors.avatar_url}
              />
              {profileForm.formState.errors.avatar_url && (
                <p className="text-xs text-destructive">
                  {profileForm.formState.errors.avatar_url.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* ── TROCAR SENHA ── */}
      <Card className="border-0 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Trocar senha</CardTitle>
          <CardDescription>
            Sua senha deve ter no mínimo 8 caracteres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register("currentPassword")}
                aria-invalid={!!passwordForm.formState.errors.currentPassword}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
                aria-invalid={!!passwordForm.formState.errors.newPassword}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
                aria-invalid={!!passwordForm.formState.errors.confirmPassword}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={updatePassword.isPending}>
              {updatePassword.isPending ? "Salvando..." : "Trocar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
