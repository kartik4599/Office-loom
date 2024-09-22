import EmojiPopover from "@/components/emoji-popover";
import { Button } from "@/components/ui/button";
import Hint from "@/components/ui/hint";
import { MessageSquare, Pencil, Smile, Trash } from "lucide-react";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

const Toolbar = ({
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  isAuthor,
  isPending,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5 -mt-3">
      <div className="group-hover:opacity-100 opacity-0 border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={({ native }) => handleReaction(native)}>
          <Button variant={"ghost"} size={"iconSmall"} disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              onClick={handleThread}
              variant={"ghost"}
              size={"iconSmall"}
              disabled={isPending}>
              <MessageSquare className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                onClick={handleEdit}
                variant={"ghost"}
                size={"iconSmall"}
                disabled={isPending}>
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button
                onClick={handleDelete}
                variant={"ghost"}
                size={"iconSmall"}
                disabled={isPending}>
                <Trash className="size-4 text-rose-600" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
