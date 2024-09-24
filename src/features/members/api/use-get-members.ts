import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetMembers = (workspaceId: Id<"workspaces">) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useGetMember = (id?: Id<"members">) => {
  const args = { memberId: id || useGetMemberId() };
  const data = useQuery(api.members.getById, args);
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useGetMemberId = () => {
  const params = useParams();
  const memberId = params.memberId as Id<"members">;

  return memberId;
};
