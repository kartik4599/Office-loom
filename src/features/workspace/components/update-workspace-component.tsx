import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUpdateWorkspaces } from "../api/use-update-workspaces";

interface UpdateWorkspaceComponentProps {
  value: string;
  id: Id<"workspaces">;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateWorkspaceComponent = ({
  value,
  id,
  setOpen,
}: UpdateWorkspaceComponentProps) => {
  const [name, setname] = useState(value);
  const { mutate, isPending } = useUpdateWorkspaces();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { name, id },
      {
        onSuccess: () => {
          toast.success("Workspace updated");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update Workspace");
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Workspace name</p>
            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
              Edit
            </p>
          </div>
          <p className="text-sm">{value}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename this workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-4">
          <Input
            value={name}
            onChange={({ target: { value } }) => setname(value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Workspace name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isPending} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending}>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWorkspaceComponent;
