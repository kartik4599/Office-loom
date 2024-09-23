import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

const Header = ({ memberImage, memberName, onClick }: HeaderProps) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto gap-1"
        size={"sm"}
        onClick={onClick}>
        <Avatar className="size-8 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback className="bg-violet-500 font-bold">
            {memberName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5" />
      </Button>
    </div>
  );
};

export default Header;
