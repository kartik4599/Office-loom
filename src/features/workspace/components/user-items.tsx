import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface UserItemsProps {
  id: Id<"users">;
  workspaceId: string;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

const UserItems = ({
  id,
  image,
  label = "Member",
  variant,
  workspaceId,
}: UserItemsProps) => {
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant={"transparent"}
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild>
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-full" src={image} />
          <AvatarFallback className="bg-violet-500 text-xs font-bold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default UserItems;
