"use client";
import { useGetOrCreateConversation } from "@/features/conversation/api/use-get-or-create-conversation";
import Conversation from "@/features/conversation/components/conversation";
import { GetMemberId } from "@/features/members/api/use-get-members";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const Page = () => {
  const memberId = GetMemberId();
  const workspaceId = GetworkspaceId();
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
  }, [memberId, workspaceId, mutate]);

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

export default Page;
