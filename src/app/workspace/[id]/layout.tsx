"use client";
import SideBar from "@/components/SideBar";
import Toolbar from "@/components/Toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Thread from "@/features/messages/components/thread";
import WorkspaceSidebar from "@/features/workspace/components/work-space-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { parentMessageId, onClose } = usePanel();
  const showPanel = !!parentMessageId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"ca-workspace-layout"}>
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            className="bg-[#5E2C5F]">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={20}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20}>
                {parentMessageId ? (
                  <Thread messageId={parentMessageId} onClose={onClose} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default layout;
