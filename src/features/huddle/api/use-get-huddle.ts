import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetHuddle = () => {
  const workspaceId = GetworkspaceId();
  const data = useQuery(api.huddle.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
 