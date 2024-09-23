import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Loader, MailIcon } from "lucide-react";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-members";

interface ProfileProps {
  profileMemberId: Id<"members">;
}
const Profile = ({ profileMemberId }: ProfileProps) => {
  const { data: member, isLoading } = useGetMember(profileMemberId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    );
  }

  const avatarFallback = member?.user?.name?.charAt(0).toUpperCase();

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full">
          <AvatarImage src={member.user.image} className="object-contain" />
          <AvatarFallback className="bg-violet-600 font-bold aspect-square text-6xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact Information</p>
        <div className="flex flex-col gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm hover:underline text-[#1264a3]">
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
