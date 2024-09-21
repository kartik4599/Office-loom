import { useCurrentMember } from "@/features/members/api/use-current-member";
import { getworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { GetMessagesReturnType } from "../api/use-get-message";
import ChannelHero from "./channel-hero";
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
  isloadingMore: boolean;
  canLoadMore: boolean;
}

const gerGroupedMessage = (messages: GetMessagesReturnType) => {
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
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const groupedMessage = gerGroupedMessage(data);
  const workspaceId = getworkspaceId();
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
                image={msg.image}
                //   reactions={msg.reactions}s
              />
            );
          })}
        </div>
      ))}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name="General" creationTime={channelCreationTime} />
      )}
    </div>
  );
};

export default MessageList;
