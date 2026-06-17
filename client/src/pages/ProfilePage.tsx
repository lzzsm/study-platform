import { useMe } from "@/hooks/useMe";
import { Separator } from "@/components/ui/separator";
import { ProfileHeader } from "@/components/ProfileHeader";
import { EditProfileForm } from "@/components/EditProfileForm";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";
import { DangerZone } from "@/components/DangerZone";

function ProfilePage() {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <DashboardPageSkeleton />;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      <ProfileHeader
        name={user?.name}
        email={user?.email}
        bio={user?.bio}
        avatarUrl={user?.avatar_url}
      />

      <Separator />

      <EditProfileForm user={user} />

      <Separator />

      <ChangePasswordForm />

      <Separator />
      
      <DangerZone />
    </div>
  );
}

export default ProfilePage;
