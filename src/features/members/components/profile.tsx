import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import {
  AlertTriangle,
  ChevronDown,
  Loader,
  MailIcon,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCurrentMember } from "../api/use-current-member";
import { useDeleteMember } from "../api/use-delete-member";
import { useGetMember } from "../api/use-get-members";
import { useUpdateMember } from "../api/use-update-member";
import { FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { useGenerateUpload } from "@/features/storage/api/use-generate-upload";
import { useUpdateProfileMember } from "../api/use-update-profile-member";

interface ProfileProps {
  profileMemberId: Id<"members">;
  onClose: () => void;
}
const Profile = ({ profileMemberId, onClose }: ProfileProps) => {
  const { ConfirmDialog, confirm } = useConfirm();
  const { data: member, isLoading } = useGetMember(profileMemberId);
  const [imageLoading, setImageLoading] = useState(false);
  const workspaceId = GetworkspaceId();
  const { data: currentMember } = useCurrentMember(workspaceId);

  const { mutate: updateMember } = useUpdateMember();

  const { mutate: deleteMember } = useDeleteMember();

  const { mutate: updatePhoto } = useUpdateProfileMember();

  const router = useRouter();

  const inputref = useRef<HTMLInputElement>(null);
  const { mutate: mutateImage } = useGenerateUpload();

  const removeHandler = async (type: "leave" | "remove") => {
    const options =
      type === "leave"
        ? {
            title: "Leave workspace",
            message: "Are you sure you want to leave this workspace",
          }
        : {
            title: "Remove member",
            message: "Are you sure you want to remove this member",
          };

    const ok = await confirm(options);
    if (!ok) return;

    deleteMember(
      { id: profileMemberId },
      {
        onSuccess: () => {
          onClose();
          toast.success("Member removed");
          if (type === "leave") router.push("/");
        },
        onError: () => {
          toast.error("Error Occured");
        },
      }
    );
  };

  const upadateHandler = async (role: "admin" | "member") => {
    const ok = await confirm({
      title: "Change role",
      message: "Are you sure you want to change this member's role?",
    });

    updateMember(
      { id: profileMemberId, role },
      {
        onSuccess: () => {
          toast.success("Member updated");
        },
        onError: () => {
          toast.error("Error Occured");
        },
      }
    );
  };

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

  const fileHandler = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    try {
      setImageLoading(true);
      const url = await mutateImage({}, { throwError: true });
      if (!url) throw new Error("Failed to upload image");

      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": files[0].type },
        body: files[0],
      });
      if (!result.ok) throw new Error("Failed to upload image");
      const data = await result.json();

      updatePhoto(
        { image: data.storageId },
        {
          onSuccess: () => {
            toast.success("Profile picture updated");
          },
        }
      );
    } catch (e) {
      toast.error("Error occured while updating profile picture");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <input
        onChange={({ target: { files } }) => fileHandler(files)}
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputref}
      />
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full">
          <AvatarImage
            src={imageLoading ? "" : member.user.image}
            className="object-contain"
          />
          <AvatarFallback className="bg-[#C5E4EA] font-bold aspect-square text-6xl">
            {imageLoading ? "Loading" : avatarFallback}
          </AvatarFallback>
          {currentMember?._id === member._id && (
            <div
              onClick={() => inputref.current?.click()}
              className="cursor-pointer absolute z-10 bg-white rounded-full bottom-10 shadow-md right-5 p-2">
              <FaPencilAlt className="size-5 m-auto" />
            </div>
          )}
        </Avatar>
        <p className="text-xl font-bold mt-2">{member.user.name}</p>
        <div className="flex flex-col p-4 w-full">
          {currentMember?.role === "admin" &&
            currentMember._id !== member._id && (
              <div className="flex items-center gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="w-full capitalize">
                      {member.role} <ChevronDown className="size-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) =>
                        upadateHandler(role as "admin" | "member")
                      }>
                      <DropdownMenuRadioItem value="admin">
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="member">
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={removeHandler.bind(null, "remove")}
                  variant={"destructive"}
                  className="w-full capitalize">
                  Remove
                </Button>
              </div>
            )}
          {currentMember?.role !== "admin" &&
            currentMember?._id === member._id && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={removeHandler.bind(null, "leave")}
                  variant={"destructive"}
                  className="w-full capitalize">
                  Leave
                </Button>
              </div>
            )}
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
