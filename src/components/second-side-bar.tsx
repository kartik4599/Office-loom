import ConversationSidebar from "@/features/conversation/components/conversation-sidebar";
import { useCurrentSection } from "@/features/conversation/store/use-currect-section";
import WorkspaceSidebar from "@/features/workspace/components/work-space-sidebar";
import { usePathname } from "next/navigation";

const SecondSidebar = () => {
  const [currentSection] = useCurrentSection();

  return currentSection==="dms" ? <ConversationSidebar /> : <WorkspaceSidebar />;
};

export default SecondSidebar;
