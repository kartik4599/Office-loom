import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { FaChevronDown } from "react-icons/fa";
import { Doc } from "../../../../convex/_generated/dataModel";
import DeletechannelComponent from "./delete-channel-component";
import UpdatechannelComponent from "./update-channel-component";

const Header = ({ channel }: { channel: Doc<"channels"> }) => {
  const { data } = useCurrentMember(channel.workspaceId);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
          <Button
            variant={"ghost"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size={"sm"}>
            <span> # {channel.name}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </div>
      </DialogTrigger>
      {data?.role === "admin" && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle># {channel.name}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <UpdatechannelComponent id={channel._id} value={channel.name} />
            <DeletechannelComponent id={channel._id} />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Header;
