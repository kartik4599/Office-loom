import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Doc } from "../../../../convex/_generated/dataModel";
import DeleteWorkspaceComponent from "./delete-workspace-component";
import UpdateWorkspaceComponent from "./update-workspace-component";

interface PreferencesComponentProps {
  workspace: Doc<"workspaces">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreferencesModal = ({
  open,
  setOpen,
  workspace,
}: PreferencesComponentProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{workspace.name}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <UpdateWorkspaceComponent
            value={workspace.name}
            id={workspace._id}
            setOpen={setOpen}
          />
          <DeleteWorkspaceComponent id={workspace._id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;
