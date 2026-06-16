import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export function ProfileHeader({
  name,
  email,
  bio,
  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16 border">
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>
          <User className="size-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-lg">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
        {bio && <p className="text-sm text-muted-foreground mt-1">{bio}</p>}
      </div>
    </div>
  );
}
