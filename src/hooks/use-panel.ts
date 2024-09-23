import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";
import { Id } from "../../convex/_generated/dataModel";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onOpenProfileMember = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId: parentMessageId as Id<"messages">,
    profileMemberId: profileMemberId as Id<"members">,
    onOpenMessage,
    onOpenProfileMember,
    onClose,
  };
};
