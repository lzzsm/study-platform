import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
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
import { UserCog } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useMe";
import type { User } from "@/types/user.types";

interface EditProfileFormProps {
  user?: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const updateProfile = useUpdateProfile();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", bio: "", avatar_url: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        bio: user.bio ?? "",
        avatar_url: user.avatar_url ?? "",
      });
    }
  }, [user, form]);

  function onSubmit(data: UpdateProfileSchema) {
    updateProfile.mutate({
      name: data.name,
      bio: data.bio || undefined,
      avatar_url: data.avatar_url || undefined,
    });
  }

  return (
    <Card className="border-0 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <UserCog className="size-4 text-muted-foreground" />
          Informações pessoais
        </CardTitle>
        <CardDescription>
          Atualize seu nome, bio e foto de perfil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="Conte um pouco sobre você..."
              {...form.register("bio")}
            />
            {form.formState.errors.bio && (
              <p className="text-xs text-destructive">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="avatar_url">URL da foto de perfil</Label>
            <Input
              id="avatar_url"
              placeholder="https://..."
              {...form.register("avatar_url")}
              aria-invalid={!!form.formState.errors.avatar_url}
            />
            {form.formState.errors.avatar_url && (
              <p className="text-xs text-destructive">
                {form.formState.errors.avatar_url.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
