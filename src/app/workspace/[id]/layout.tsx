"use client";
import SideBar from "@/components/SideBar";
import Toolbar from "@/components/Toolbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        {children}
      </div>
    </div>
  );
};

export default layout;
