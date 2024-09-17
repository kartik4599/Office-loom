import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const ChatInput = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="px-5 w-full">
      <Editor onSubmit={() => {}} placeholder={placeholder} />
    </div>
  );
};

export default ChatInput;
