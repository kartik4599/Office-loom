"use client";

import CreateChannelModal from "@/features/channel/components/create-channel-modal";
import CreateWorkspaceModal from "@/features/workspace/components/create-workspace-modal";

const Modals = () => {
  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};

export default Modals;
