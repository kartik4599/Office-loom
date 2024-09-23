import { useGetChannels } from "@/features/channel/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspaces";
import { Info, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

const Toolbar = () => {
  const { data, workspaceId } = useGetWorkspace();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: members } = useGetMembers(workspaceId);
  const { data: channels } = useGetChannels(workspaceId);

  const onMemberSelect = (id: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${id}`);
  };
  const onChannelSelect = (id: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${id}`);
  };

  return (
    <>
      <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
        <div className="flex-1" />
        <div className="min-w-[280px] max-[642px] grow-[2] shrink">
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
            <Search className="size-4 text-white mr-2" />
            <span className="text-white text-xs">Search {data?.name}</span>
          </Button>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end">
          <Button variant={"transparent"} size={"iconSmall"}>
            <Info className="size-5" />
          </Button>
        </div>
      </nav>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Channels">
            {channels?.map((channel) => (
              <CommandItem
                value={channel.name}
                onSelect={onChannelSelect.bind(null, channel._id)}
                key={channel._id}>
                # {channel.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Members">
            {members?.map(({ member, user }) => (
              <CommandItem
                value={user.name}
                onSelect={onMemberSelect.bind(null, member._id)}
                key={member._id}>
                <div className="flex items-center gap-1">
                  <Avatar className="size-6 rounded-md mr-1">
                    <AvatarImage className="rounded-full" src={user.image} />
                    <AvatarFallback className="bg-violet-500 text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{user.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Toolbar;
