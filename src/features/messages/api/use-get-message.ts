import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

const BATCH_SIZE = 20;

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)["page"];

export const useGetMessage = (args: UseGetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    args,
    {
      initialNumItems: BATCH_SIZE,
    }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
