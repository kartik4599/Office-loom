import { UseGetChannelId } from "@/features/channel/api/use-get-channels";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUpload } from "@/features/storage/api/use-generate-upload";
import { GetworkspaceId } from "@/features/workspace/api/use-get-workspaces";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}
export interface CreateMessageValues {
  body: string;
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  image?: Id<"_storage">;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const { mutate: mutateMessage } = useCreateMessage();
  const { mutate: mutateImage } = useGenerateUpload();
  const workspaceId = GetworkspaceId();
  const channelId = UseGetChannelId();
  const [editorChange, seteditorChange] = useState(0);
  const [loading, setloading] = useState(false);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File[];
  }) => {
    try {
      setloading(true);
      const value: CreateMessageValues = {
        body,
        channelId,
        workspaceId,
        image: undefined,
      };

      if (image && image.length > 0) {
        const url = await mutateImage({}, { throwError: true });
        if (!url) throw new Error("Failed to upload image");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image[0].type },
          body: image[0],
        });
        if (!result.ok) throw new Error("Failed to upload image");

        const data = await result.json();

        value.image = data.storageId;
      }

      await mutateMessage(value);
    } catch (e) {
    } finally {
      seteditorChange(editorChange + 1);
      setloading(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorChange}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={loading}
      />
    </div>
  );
};

export default ChatInput;
