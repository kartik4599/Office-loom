import UserButton from "@/features/auth/components/user-button";
import WorkspaceSwitcher from "@/features/workspace/components/workspace-switcher";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import SidebarButton from "./sidebar-button";
import { useCurrentSection } from "@/features/conversation/store/use-currect-section";

const SideBar = () => {
  const [currentSection, setCurrentSection] = useCurrentSection();

  return (
    <aside className="w-[70px] h-full bg-[#2D5D62] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={currentSection === "home"}
        onClick={setCurrentSection.bind(null, "home")}
      />
      <SidebarButton
        icon={MessagesSquare}
        label="DMs"
        isActive={currentSection === "dms"}
        onClick={setCurrentSection.bind(null, "dms")}
      />
      <SidebarButton icon={Bell} label="Activity" onClick={() => {}} />
      <SidebarButton icon={MoreHorizontal} label="More" onClick={() => {}} />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default SideBar;
