"use client";

import ChatInput from "@/components/chat-input";
import { useGetChannel } from "@/features/channel/api/use-get-channels";
import Header from "@/features/channel/components/Header";
import { useGetMessage } from "@/features/messages/api/use-get-message";
import MessageList from "@/features/messages/components/message-list";
import { Loader, TriangleAlert } from "lucide-react";

const page = () => {
  const { data: channel, isLoading, channelId } = useGetChannel();
  const { results, loadMore, status } = useGetMessage({ channelId });

  if (isLoading && status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
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
    <div className="flex flex-col h-full">
      <Header channel={channel} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        variant="channel"
        loadMore={loadMore}
        isloadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default page;
