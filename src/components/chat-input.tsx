import { useGetChannelId } from "@/features/channel/api/use-get-channels";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { getworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import dynamic from "next/dynamic";
import { useState } from "react";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const ChatInput = ({ placeholder }: { placeholder: string }) => {
  const { mutate, isPending } = useCreateMessage();
  const workspaceId = getworkspaceId();
  const channelId = useGetChannelId();
  const [editorChange, seteditorChange] = useState(0);

  const handleSubmit = ({ body, image }: { body: string; image: File[] }) => {
    try {
      mutate({ body, workspaceId, channelId });
    } catch (e) {
    } finally {
      seteditorChange(editorChange + 1);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorChange}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={isPending}
      />
    </div>
  );
};

export default ChatInput;
