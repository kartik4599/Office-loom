"use client";

import { useGetChannel } from "@/features/channel/api/use-get-channels";
import Header from "@/features/channel/components/Header";
import { Loader, TriangleAlert } from "lucide-react";

const page = () => {
  const { data, isLoading } = useGetChannel();

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-muted-foreground text-sm">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header channel={data} />
      {data?.name}
    </div>
  );
};

export default page;
