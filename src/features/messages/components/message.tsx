import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import React from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import Hint from "@/components/ui/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "../api/use-update-message";
import { useDeleteMessage } from "../api/use-delete-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useToggleReaction } from "@/features/reaction/api/use-toggle-reaction";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import ThreadBar from "./threadBar";
const Renderer = dynamic(() => import("./renderer"));
const Editor = dynamic(() => import("@/components/editor"));

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  // reactions?: Array<
  //   Omit<Doc<"reactions">, "memberId"> & {
  //     memberId: Id<"members">;
  //     count: number;
  //   }
  // >;
  reactions?: any;
  body: Doc<"messages">["body"];
  image?: string | null;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) =>
  `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

const Message = ({
  body,
  createdAt,
  id,
  isEditing,
  memberId,
  reactions,
  setEditingId,
  updatedAt,
  authorImage,
  authorName,
  hideThreadButton,
  image,
  isAuthor,
  isCompact,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
}: MessageProps) => {
  const avatarFallback = authorName?.charAt(0).toUpperCase();

  const { mutate: updateMessage, isPending: updateloading } =
    useUpdateMessage();

  const { mutate: deleteMessage, isPending: deleteloading } =
    useDeleteMessage();

  const { mutate: reactMessage } = useToggleReaction();

  const { onOpenMessage, onClose, parentMessageId, onOpenProfileMember } =
    usePanel();

  const { confirm, ConfirmDialog } = useConfirm();

  const reactionHandler = (value: string) => {
    reactMessage(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to add reaction");
        },
      }
    );
  };

  const updateHandler = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const deleteHandler = async () => {
    const ok = await confirm({
      title: "Delete message",
      message:
        "Are you sure you want to delete this message? This connot be undone.",
    });
    if (!ok) return;

    deleteMessage(
      { id },
      {
        onSuccess: () => {
          if (id === parentMessageId) onClose();
          toast.success("Message Deleted");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const messageSection = (
    <div className="flex flex-col w-full">
      <Renderer value={body} />
      <Thumbnail url={image} />
      {updatedAt && (
        <span className="text-xs text-muted-foreground">(edited)</span>
      )}
      <Reactions data={reactions} onChange={reactionHandler} />
      <ThreadBar
        threadCount={threadCount}
        threadImage={threadImage}
        threadName={threadName}
        threadTimestamp={threadTimestamp}
        onClick={onOpenMessage.bind(null, id)}
      />
    </div>
  );

  const layout = isCompact ? (
    <div className="flex items-start gap-2">
      <Hint label={formatFullTime(new Date(createdAt))}>
        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
          {format(new Date(createdAt), "hh:mm")}
        </button>
      </Hint>
      {messageSection}
    </div>
  ) : (
    <>
      <button onClick={onOpenProfileMember.bind(null, memberId)}>
        <Avatar className="size-8 rounded-full mr-1">
          <AvatarImage className="rounded-full" src={authorImage} />
          <AvatarFallback className="rounded-full bg-purple-600 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </button>
      <div className="flex flex-col w-full overflow-hidden">
        <div className="text-sm">
          <button
            onClick={onOpenProfileMember.bind(null, memberId)}
            className="font-bold text-primary hover:underline">
            {authorName}
          </button>
          <span>&nbsp;&nbsp;</span>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground hover:underline">
              {format(new Date(createdAt), "hh:mm a")}
            </button>
          </Hint>
        </div>
        {messageSection}
      </div>
    </>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
        deleteloading &&
          "bg-red-500/50 transform transition-all scale-y-0 origin-bottom duration-700"
      )}>
      <div className="flex items-start gap-2">
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={updateHandler}
              disabled={updateloading}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          layout
        )}
      </div>
      <ConfirmDialog />
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={updateloading || deleteloading}
          handleEdit={setEditingId.bind(null, id)}
          handleThread={onOpenMessage.bind(null, id)}
          handleDelete={deleteHandler}
          handleReaction={reactionHandler}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};

export default Message;
