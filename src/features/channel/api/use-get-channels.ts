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
  const channelId = UseGetChannelId();

  const data = useQuery(api.channels.getById, { id: channelId });
  const isLoading = data === undefined;

  return { channelId, data, isLoading };
};

export const UseGetChannelId = () => {
  const params = useParams();
  const channelId = params.channelId as Id<"channels">;

  return channelId;
};
