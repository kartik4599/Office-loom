"use client";

import useGetWorkspace from "@/features/workspace/api/use-get-workspaces";
import { Loader } from "lucide-react";

const page = () => {
  const { data, isLoading } = useGetWorkspace();

  return <div>{isLoading ? <Loader /> : data?.name}</div>;
};

export default page;
