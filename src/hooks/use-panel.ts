import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";
import { Id } from "../../convex/_generated/dataModel";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const onOpenMessage = (messageId: string) => setParentMessageId(messageId);

  const onClose = () => setParentMessageId(null);

  return {
    parentMessageId: parentMessageId as Id<"messages">,
    onOpenMessage,
    onClose,
  };
};
