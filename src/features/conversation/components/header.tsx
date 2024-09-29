import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import { FaChevronDown } from "react-icons/fa";
import { FaHeadphonesAlt } from "react-icons/fa";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateHuddle } from "@/features/huddle/api/use-create-huddle";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
  memberId: Id<"members">;
}

const Header = ({
  memberImage,
  memberName,
  onClick,
  memberId,
}: HeaderProps) => {
  const { mutate } = useCreateHuddle();
  const workspaceId = GetworkspaceId();
  const { data: member } = useCurrentMember(workspaceId);

  const huddleHandler = () => {
    mutate(
      { membersId: memberId, workspaceId },
      {
        onSuccess: (data) => {
          console.log(data);
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex justify-between items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto gap-1"
        size={"sm"}
        onClick={onClick}>
        <Avatar className="size-8 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback className="bg-[#C5E4EA] font-bold">
            {memberName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5" />
      </Button>
      {member?._id !== memberId && (
        <Hint label={`Huddle with ${memberName}`}>
          <Button
            onClick={huddleHandler}
            variant={"outline"}
            className="text-lg shadow-xl font-semibold px-2 overflow-hidden w-auto gap-1"
            size={"iconSmall"}>
            <FaHeadphonesAlt />
          </Button>
        </Hint>
      )}
    </div>
  );
};

export default Header;
