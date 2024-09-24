import EmojiPopover from "@/components/emoji-popover";
import Hint from "@/components/ui/hint";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import { cn } from "@/lib/utils";
import { SmilePlus } from "lucide-react";

interface ReactionsProps {
  data: {
    value: string;
    count: number;
    isSelected: boolean;
  }[];
  onChange: (value: string) => void;
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = GetworkspaceId();
  const { data: member } = useCurrentMember(workspaceId);
  if (data.length === 0 || !member) return null;

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map(({ value, count, isSelected }) => (
        <Hint
          key={value}
          label={`${count} ${count === 1 ? "perons" : "people"} reacted with ${value}`}>
          <button
            onClick={onChange.bind(null, value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border-transparent text-slate-800 flex items-center gap-x-1",
              isSelected && "bg-blue-200/70 border-blue-600 text-white"
            )}>
            {value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                isSelected && "text-blue-600"
              )}>
              {count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={({ native }) => onChange(native)}>
        <button className="h-6 px-3 rounded-full bg-slate-200/70 border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
          <SmilePlus className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
