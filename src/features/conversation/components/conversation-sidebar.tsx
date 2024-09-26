import { Loader } from "lucide-react";
import { useGetConversations } from "../api/use-get-conversation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Renderer from "@/features/messages/components/renderer";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import Link from "next/link";

const ConversationSidebar = () => {
  const { data, isLoading } = useGetConversations();
  const workspaceId = GetworkspaceId();
  const { data: currentMember } = useCurrentMember(workspaceId);

  if (isLoading) {
    return (
      <div className="flex flex-col bg-[#50767a] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-[#50767a] h-full p-2">
      <div className="text-white font-semibold truncate">Direct messages</div>
      {data?.map(({ member, message, user }) => (
        <Link key={member._id} href={`/workspace/${workspaceId}/member/${member._id}`}>
          <div className="gap-2 flex flex-col">
            <div className="cursor-pointer hover:bg-accent/20 rounded py-3 px-1 flex items-start" key={member._id}>
              <Avatar className="size-10 rounded-md mr-1">
                <AvatarImage className="rounded-full" src={user.image} />
                <AvatarFallback className="bg-[#C5E4EA] text-[#2D5D62] text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 items-start text-muted justify-between">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs bg-white text-black rounded-full px-2 truncate flex items-center">
                  {message.memberId === currentMember?._id ? "You" : "Message"}:
                  <Renderer value={message?.body} />
                </span>
              </div>
              <div className="ml-auto text-xs text-muted">
                {formatDistanceToNow(message._creationTime, {
                  addSuffix: true,
                })}
              </div>
            </div>
            <Separator className="px-[0.5px]" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ConversationSidebar;
