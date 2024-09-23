import { useConfirm } from "@/components/ui/confirm-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useDeleteChannel } from "../api/use-delete-channel";

const DeletechannelComponent = ({ id }: { id: Id<"channels"> }) => {
  const { mutate, isPending } = useDeleteChannel();
  const { confirm, ConfirmDialog } = useConfirm();
  const router = useRouter();

  const handleRemove = async () => {
    const success = await confirm({
      title: "Delete channel",
      message: "Are you sure you want to delete this channel?",
    });
    if (!success) return;

    mutate(
      { id },
      {
        onSuccess: (id) => {
          toast.success("Workspace deleted");
          if (id) router.replace("/workspace/" + id);
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
        <p className="text-sm font-semibold">Delete channel</p>
      </button>
      <ConfirmDialog />
    </>
  );
};

export default DeletechannelComponent;
