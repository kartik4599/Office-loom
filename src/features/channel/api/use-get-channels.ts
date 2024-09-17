import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannels = (workspaceId: Id<"workspaces">) => {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useGetChannel = () => {
  const params = useParams();
  const channelId = params.channelId as Id<"channels">;
  
  // let data = null;
  // if (workspaceId) data = useQuery(api.channels., { id: workspaceId });
  // const isLoading = data === undefined;

  return { channelId };
};
