import { useUserCurrentMember } from "@/features/members/api/user-current-member";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspaces";
import { AlertTriangle, Loader } from "lucide-react";
import WorkspaceHeader from "./work-space-header";

const WorkspaceSidebar = () => {
  const {
    data: workspace,
    isLoading: workspaceLoading,
    workspaceId,
  } = useGetWorkspace();
  const { data: member, isLoading: memberLoading } = useUserCurrentMember({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};

export default WorkspaceSidebar;
