"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspace/api/use-get-workspaces";
import { useJoinWorkspace } from "@/features/workspace/api/use-join-workspaces";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";

const JoinWorkspacePage = () => {
  const { data, isLoading, workspaceId } = useGetWorkspaceInfo();
  const { mutate, isPending } = useJoinWorkspace();
  const route = useRouter();

  const isMember = useMemo(() => data?.isMember, [data]);

  const handleComplete = (value: string) => {
    mutate(
      { workspacesId: workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          route.replace(`/workspace/${id}`);
          toast.success("Workspace joined");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  useEffect(() => {
    if (isMember) route.replace(`/workspace/${workspaceId}`);
  }, [isMember, workspaceId, route]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/next.svg"} alt="logo" width={100} height={100} />
      <div className="flex flex-col gap-y-2 items-center justify-center">
        <h1 className="text-2xl font-bold">Join {data?.name}</h1>
        <p className="text-muted-foreground">
          Enter the workspace code to join
        </p>
      </div>
      <VerificationInput
        length={6}
        autoFocus
        onComplete={handleComplete}
        classNames={{
          container: cn(
            "flex gap-x-2",
            isPending && "opacity-50 pointer-events-none"
          ),
          character:
            "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center",
          characterInactive: "bg-muted",
          characterSelected: "bg-white text-black",
          characterFilled: "bg-white text-black",
        }}
      />
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinWorkspacePage;
