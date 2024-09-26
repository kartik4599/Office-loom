import { atom } from "jotai";
import { useAtom } from "jotai/react";

type CurrentSection = "home" | "dms";

export const atomCurrentSection = atom<CurrentSection>("home");

export const useCurrentSection = () => {
  return useAtom(atomCurrentSection);
};
