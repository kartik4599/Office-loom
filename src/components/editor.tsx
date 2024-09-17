import Quill from "quill";
import { Delta, Op, QuillOptions } from "quill/core";
import "quill/dist/quill.snow.css";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, SmileIcon } from "lucide-react";
import Hint from "./ui/hint";
import { cn } from "@/lib/utils";
import { useToggle } from "react-use";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: (args: EditorValue) => void;
  variant?: "create" | "update";
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
  variant = "create",
  onSubmit,
  defaultValue = [],
  disabled = false,
  innerRef,
  onCancel,
  placeholder = "Write something...",
}: EditorProps) => {
  const [text, settext] = useState("");
  const [isToolbarVisiable, setIsToolbarVisiable] = useToggle(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const innerRefRef = useRef(innerRef);
  const onCancelRef = useRef(onCancel);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
    innerRefRef.current = innerRef;
    onCancelRef.current = onCancel;
    placeholderRef.current = placeholder;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                // submitRef.current();
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
                // submitRef.current();
                return;
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    settext(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      settext(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, []);

  const toggleToolbar = () => {
    setIsToolbarVisiable();
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) toolbarElement.classList.toggle("hidden");
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisiable ? "Hide formatting" : "Show formatting"}>
            <Button
              disabled={disabled}
              size="iconSmall"
              variant={"ghost"}
              onClick={toggleToolbar}>
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              size="iconSmall"
              variant={"ghost"}
              onClick={() => {}}>
              <SmileIcon className="size-4" />
            </Button>
          </Hint>
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {}}
                disabled={disabled}>
                Cancel
              </Button>
              <Button size={"sm"} onClick={() => {}} disabled={disabled}>
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <>
              <Hint label="Image">
                <Button
                  disabled={disabled}
                  size="iconSmall"
                  variant={"ghost"}
                  onClick={() => {}}>
                  <ImageIcon className="size-4" />
                </Button>
              </Hint>
              <Button
                disabled={disabledRef.current || isEmpty}
                size="iconSmall"
                variant={"ghost"}
                onClick={() => {}}
                className={cn(
                  "ml-auto",
                  isEmpty
                    ? "bg-white hover:bg-white text-muted-foreground"
                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white hover:text-white"
                )}>
                <MdSend className="size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="p-1 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> tot add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
