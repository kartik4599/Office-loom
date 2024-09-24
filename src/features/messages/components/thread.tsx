import { CreateMessageValues } from "@/components/chat-input";
import { Button } from "@/components/ui/button";
import { UseGetChannelId } from "@/features/channel/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGenerateUpload } from "@/features/storage/api/use-generate-upload";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateMessage } from "../api/use-create-message";
import { useGetMessage, useGetMessageById } from "../api/use-get-message";
import Message from "./message";
import MessageList, { getGroupedMessage } from "./message-list";
const Editor = dynamic(() => import("@/components/editor"));

interface ThreadProps {
  messageId: Id<"messages">;
}

const Thread = ({ messageId }: ThreadProps) => {
  const { data: message, isLoading } = useGetMessageById({ id: messageId });
  const workspaceId = GetworkspaceId();
  const channelId = UseGetChannelId();
  const { data: member } = useCurrentMember(workspaceId);
  const { mutate: mutateImage } = useGenerateUpload();
  const { mutate: mutateMessage } = useCreateMessage();
  const [editorChange, seteditorChange] = useState(0);
  const { loadMore, results, status } = useGetMessage({
    parentMessageId: messageId,
    channelId,
  });

  const canLoadMore = status === "CanLoadMore";
  const LoadingMore = status === "LoadingMore";

  const [loading, setloading] = useState(false);
  const [editMessageId, seteditMessageId] = useState<Id<"messages"> | null>(
    null
  );

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File[];
  }) => {
    try {
      setloading(true);
      const value: CreateMessageValues = {
        body,
        channelId,
        workspaceId,
        image: undefined,
      };

      if (image && image.length > 0) {
        const url = await mutateImage({}, { throwError: true });
        if (!url) throw new Error("Failed to upload image");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image[0].type },
          body: image[0],
        });
        if (!result.ok) throw new Error("Failed to upload image");

        const data = await result.json();

        value.image = data.storageId;
      }

      await mutateMessage({ ...value, parentMessageId: messageId });
    } catch (e) {
    } finally {
      seteditorChange(editorChange + 1);
      setloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse pb-4 overflow-y-hidden message-scrollbar">
        <MessageList
          canLoadMore={canLoadMore}
          loadMore={loadMore}
          data={results}
          isloading={loading}
          isloadingMore={LoadingMore}
          variant="thread"
        />
        <div className="py-4">
          <Message
            body={message.body}
            id={message._id}
            createdAt={message._creationTime}
            hideThreadButton
            memberId={message.memberId}
            isAuthor={member?._id === message.memberId}
            image={message.image}
            isEditing={editMessageId === message._id}
            setEditingId={seteditMessageId}
            reactions={message.reactions}
            updatedAt={message.updatedAt}
            authorImage={message.user.image}
            authorName={message.user.name}
            isCompact={false}
          />
        </div>
      </div>
      <div className="px-4">
        <Editor
          key={editorChange}
          onSubmit={handleSubmit}
          disabled={loading}
          placeholder="Reply..."
        />
      </div>
    </>
  );
};

export default Thread;
