import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";

export const useGetConversations = () => {
  const workspaceId = GetworkspaceId();
  const data = useQuery(api.conversation.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
