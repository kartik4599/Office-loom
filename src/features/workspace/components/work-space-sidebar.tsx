import { useGetChannels } from "@/features/channel/api/use-get-channels";
import CreateChannelModal from "@/features/channel/components/create-channel-modal";
import { useCreateChannelModal } from "@/features/channel/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspaces";
import {
  AlertTriangle,
  Hash,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import SidebarItem from "./side-bar-item";
import UserItems from "./user-items";
import WorkspaceHeader from "./work-space-header";
import WorkspaceSection from "./workspace-section";

const WorkspaceSidebar = () => {
  const {
    data: workspace,
    isLoading: workspaceLoading,
    workspaceId,
  } = useGetWorkspace();
  const { data: member, isLoading: memberLoading } =
    useCurrentMember(workspaceId);
  const { data: channels } = useGetChannels(workspaceId);
  const { data: members } = useGetMembers(workspaceId);
  const [_, setOpen] = useCreateChannelModal();

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
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          id="threads"
          icon={MessageSquareText}
          workspaceId={workspaceId}
        />
        <SidebarItem
          label="Drafts & Sent"
          id="drafts"
          icon={SendHorizonal}
          workspaceId={workspaceId}
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}>
        {channels?.map((item) => (
          <SidebarItem
            label={item.name}
            id={item._id}
            icon={Hash}
            workspaceId={workspaceId}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Message" hint="New channel">
        {members?.map((member) => (
          <UserItems
            id={member.user._id}
            workspaceId={workspaceId}
            image={member.user.image}
            label={member.user.name}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
