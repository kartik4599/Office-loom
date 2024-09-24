"use client";

import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspace/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { data } = useGetWorkspaces();
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const workSpaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (data === undefined) return;

    if (workSpaceId) {
      setOpen(false);
      router.replace("/workspace/" + workSpaceId);
    } else if (!open) setOpen(true);
  }, [workSpaceId, open, data, router, setOpen]);

  return data === undefined ? "Loading..." : <></>;
}
