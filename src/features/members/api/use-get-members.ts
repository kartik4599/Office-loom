import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetMembers = (workspaceId: Id<"workspaces">) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const useGetMember = (memberId: Id<"members">) => {
  const data = useQuery(api.members.getById, { memberId });
  const isLoading = data === undefined;
  return { data, isLoading };
};

export const GetMemberId = () => {
  const params = useParams();
  const memberId = params.memberId as Id<"members">;

  return memberId;
};
