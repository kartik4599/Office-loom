import { useCurrentMember } from "@/features/members/api/use-current-member";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { GetMessagesReturnType } from "../api/use-get-message";
import ChannelHero from "./channel-hero";
import ConversationHero from "./conversation-hero";
import Message from "./message";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType;
  loadMore: () => void;
  isloading: boolean;
  isloadingMore: boolean;
  canLoadMore: boolean;
}

export const getGroupedMessage = (messages: GetMessagesReturnType) => {
  const obj: Record<string, GetMessagesReturnType> = {};

  messages.forEach((msg) => {
    const date = new Date(msg?._creationTime || 0);
    const datekey = format(date, "yyy-MM-dd");
    if (!obj[datekey]) obj[datekey] = [];
    obj[datekey].unshift(msg);
  });

  return obj;
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
};

const MessageList = ({
  canLoadMore,
  data,
  isloadingMore,
  loadMore,
  channelCreationTime,
  channelName,
  memberImage,
  memberName,
  variant,
  isloading,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const groupedMessage = getGroupedMessage(data);
  const workspaceId = GetworkspaceId();
  const { data: member } = useCurrentMember(workspaceId);

  return (
    <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto message-scrollbar">
      {Object.entries(groupedMessage).map(([date, messages]) => (
        <div key={date}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(date)}
            </span>
          </div>
          {messages.map((msg, index) => {
            const previousMessage = messages[index - 1];
            const isCompact =
              previousMessage &&
              previousMessage.user._id === msg.user._id &&
              differenceInMinutes(
                new Date(msg._creationTime),
                new Date(previousMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={msg?._id}
                id={msg._id}
                memberId={msg.member._id}
                body={msg.body}
                createdAt={msg._creationTime}
                updatedAt={msg.updatedAt}
                authorImage={msg.user.image}
                authorName={msg.user.name}
                isAuthor={msg.memberId === member?._id}
                isEditing={msg._id === editingId}
                setEditingId={setEditingId}
                isCompact={isCompact}
                threadCount={msg.thread.count}
                hideThreadButton={variant === "thread"}
                threadImage={msg.thread.image}
                threadTimestamp={msg.thread.timestamp}
                threadName={msg.thread.name}
                image={msg.image}
                reactions={msg.reactions}
              />
            );
          })}
        </div>
      ))}
      {isloadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader2 className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {!isloading && (
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && (
        <ConversationHero memberName={memberName} memberImage={memberImage} />
      )}
    </div>
  );
};

export default MessageList;
