import {
  useGetWorkspaces,
  useGetWorkspace,
} from "@/features/workspace/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspace/store/use-create-workspace-modal";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WorkspaceSwitcher = () => {
  const [_, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();
  const {
    data: currentWorkSpace,
    isLoading: currentLoading,
    workspaceId,
  } = useGetWorkspace();
  const { data: allWorkSpaces } = useGetWorkspaces();

  const otherWorkSpaces = allWorkSpaces?.filter((w) => w?._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold">
          {currentLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            currentWorkSpace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem className="cursor-pointer flex-col justify-start items-start capitalize">
          {currentWorkSpace?.name}
          <span className="text-xs text-muted-foreground">Active</span>
        </DropdownMenuItem>
        {otherWorkSpaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace?._id}
            className="cursor-pointer capitalize"
            onClick={() => router.push("/workspace/" + workspace?._id)}>
            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace?.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={setOpen.bind(null, true)}>
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
