import { useConfirm } from "@/components/ui/confirm-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useDeleteWorkspaces } from "../api/use-delete-workspaces";

const DeleteWorkspaceComponent = ({ id }: { id: Id<"workspaces"> }) => {
  const { mutate, isPending } = useDeleteWorkspaces();
  const { confirm, ConfirmDialog } = useConfirm();
  const router = useRouter();

  const handleRemove = async () => {
    const success = await confirm({
      title: "Delete workspace",
      message: "Are you sure you want to delete this workspace?",
    });
    if (!success) return;

    mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };

  return (
    <>
      <button
        disabled={isPending}
        onClick={handleRemove}
        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600 w">
        <TrashIcon className="size-4" />
        <p className="text-sm font-semibold">Delete workspace</p>
      </button>
      <ConfirmDialog />
    </>
  );
};

export default DeleteWorkspaceComponent;
