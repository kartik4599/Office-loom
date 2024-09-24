"use client";

import { useGetChannels } from "@/features/channel/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channel/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspaces";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const Page = () => {
  const router = useRouter();
  const {
    data: workspace,
    isLoading: workspaceLoading,
    workspaceId,
  } = useGetWorkspace();
  const [open, setOpen] = useCreateChannelModal();
  const { data: member } = useCurrentMember(workspaceId);

  const { data: channels, isLoading: channelLoading } =
    useGetChannels(workspaceId);

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  useEffect(() => {
    if (workspaceLoading || channelLoading || !workspace) return;
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && member?.role === "admin") setOpen(true);
  }, [
    channelId,
    workspaceLoading,
    channelLoading,
    router,
    open,
    workspace,
    member?.role,
    setOpen,
    workspaceId,
  ]);

  if (workspaceLoading || channelLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-muted-foreground text-sm">Channel not found</span>
    </div>
  );
};

export default Page;
