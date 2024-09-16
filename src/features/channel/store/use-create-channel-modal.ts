import { atom } from "jotai";
import { useAtom } from "jotai/react";

export const atomCreateWorkspaceModal = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(atomCreateWorkspaceModal);
};
