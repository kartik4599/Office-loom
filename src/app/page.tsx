"use client";

import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();

  const workSpaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (workSpaceId) {
      return console.log("Redirect to workspace");
    }
    return console.log("Open creation modal");
  }, [isLoading, data]);

  return <></>;
}
