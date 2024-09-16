import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useUpdateWorkspaceJoinCode } from "../api/use-update-workspaces-joincode";
import DeleteWorkspaceComponent from "./delete-workspace-component";
import UpdateWorkspaceComponent from "./update-workspace-component";

interface PreferencesComponentProps {
  workspace: Doc<"workspaces">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteModal = ({
  open,
  setOpen,
  workspace,
}: PreferencesComponentProps) => {
  const { mutate, isPending } = useUpdateWorkspaceJoinCode();
  const { ConfirmDialog, confirm } = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one"
  );

  const handleCopy = async () => {
    const inviteLink = `${window.location.origin}/join/${workspace._id}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
    setOpen(false);
  };

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { id: workspace._id },
      {
        onSuccess: () => {
          toast.success("Invite code generated");
        },
        onError: () => {
          toast.error("Failed to regenrate invite code");
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {workspace.name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {workspace.joinCode}
            </p>
            <Button onClick={handleCopy} variant={"ghost"}>
              Copy link <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              disabled={isPending}
              variant={"outline"}>
              New Code <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
};

export default InviteModal;
