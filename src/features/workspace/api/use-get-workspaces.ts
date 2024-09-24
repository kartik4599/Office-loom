import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;

  return { data, isLoading };
};

export const useGetWorkspace = () => {
  const workspaceId = GetworkspaceId();

  let data = null;
  if (workspaceId) data = useQuery(api.workspaces.getById, { id: workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading, workspaceId };
};

export const useGetWorkspaceInfo = () => {
  const workspaceId = GetworkspaceId();

  let data = null;
  if (workspaceId)
    data = useQuery(api.workspaces.getInfoById, { id: workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading, workspaceId };
};

export const GetworkspaceId = () => {
  const params = useParams();
  const workspaceId = params.id as Id<"workspaces">;
  return workspaceId;
};
