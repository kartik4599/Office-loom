import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Hint from "@/components/ui/hint";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import React, { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import PreferencesModal from "./preferences-modal";

const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}) => {
  const [preferenceOpen, setPreferenceOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"transparent"}
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size={"sm"}>
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {}}>
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={setPreferenceOpen.bind(null, true)}>
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter" side="bottom">
            <Button variant={"transparent"} size={"iconSmall"}>
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button variant={"transparent"} size={"iconSmall"}>
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
      <PreferencesModal
        workspace={workspace}
        open={preferenceOpen}
        setOpen={setPreferenceOpen}
      />
    </>
  );
};

export default WorkspaceHeader;
