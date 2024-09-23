"use client";
import { useGetOrCreateConversation } from "@/features/conversation/api/use-get-or-create-conversation";
import Conversation from "@/features/conversation/components/conversation";
import { useGetMemberId } from "@/features/members/api/use-get-members";
import { getworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const page = () => {
  const memberId = useGetMemberId();
  const workspaceId = getworkspaceId();
  const { data, mutate, isPending } = useGetOrCreateConversation();

  useEffect(() => {
    mutate(
      { memberId, workspaceId },
      {
        onError: () => {
          toast.error("Error while createing conversation");
        },
      }
    );
  }, [memberId, workspaceId]);

  if (isPending) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return <Conversation id={data} />;
};

export default page;
