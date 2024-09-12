"use client";
import Toolbar from "@/components/Toolbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
};

export default layout;
