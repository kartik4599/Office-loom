import { Button } from "@/components/ui/button";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { getworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMessageById } from "../api/use-get-message";
import Message from "./message";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const { data: message, isLoading } = useGetMessageById({ id: messageId });
  const [editMessageId, seteditMessageId] = useState<Id<"messages"> | null>(
    null
  );
  const workspaceId = getworkspaceId();
  const { data: member } = useCurrentMember(workspaceId);

  let component;
  if (isLoading) {
    component = (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  } else if (!message) {
    component = (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    );
  } else {
    component = (
      <div>
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
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSmall" variant={"ghost"}>
          <XIcon />
        </Button>
      </div>
      {component}
    </div>
  );
};

export default Thread;
