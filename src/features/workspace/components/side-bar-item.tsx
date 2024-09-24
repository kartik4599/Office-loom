import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#6786B7] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface SidebarItemsProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  workspaceId: string;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

const SidebarItem = ({
  id,
  workspaceId,
  icon: Icon,
  label,
  variant,
}: SidebarItemsProps) => {
  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      asChild
      className={cn(sidebarItemVariants({ variant }))}>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
