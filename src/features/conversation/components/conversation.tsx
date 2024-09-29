import {
  useGetMember,
  GetMemberId,
} from "@/features/members/api/use-get-members";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import MessageList from "@/features/messages/components/message-list";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import ChatInput from "./chat-input";
import Header from "./header";

const Conversation = ({ id }: { id: Id<"conversations"> }) => {
  const memberId = GetMemberId();
  const { data, isLoading } = useGetMember(memberId);
  const { results, loadMore, status } = useGetMessage({ conversationId: id });
  const { onOpenProfileMember } = usePanel();

  if (status === "LoadingFirstPage" || isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col h-full">
      <Header
        memberImage={data?.user.image}
        memberName={data?.user.name}
        onClick={onOpenProfileMember.bind(null, data?._id)}
        memberId={memberId}
      />
      <MessageList
        canLoadMore={status === "CanLoadMore"}
        data={results}
        loadMore={loadMore}
        isloading={isLoading}
        isloadingMore={status === "LoadingMore"}
        channelCreationTime={data?._creationTime}
        channelName={data?.user.name}
        memberImage={data?.user.image}
        memberName={data?.user.name}
        variant="conversation"
      />
      <ChatInput
        conversationId={id}
        placeholder={`Message ${data?.user.name}...`}
      />
    </div>
  );
};

export default Conversation;
