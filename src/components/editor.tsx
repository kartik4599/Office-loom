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
import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import Hint from "./ui/hint";
import { cn } from "@/lib/utils";
import { useToggle } from "react-use";
import EmojiPopover from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
  image: File[];
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
  const [images, setImages] = useState<File[]>([]);

  const [isToolbarVisiable, setIsToolbarVisiable] = useToggle(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const innerRefRef = useRef(innerRef);
  const onCancelRef = useRef(onCancel);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);

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
                const text = quill.getText();
                const image = imageElementRef.current?.files
                  ? Array.from(imageElementRef.current?.files)
                  : [];

                const isEmpty =
                  text.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
                  image.length === 0;
                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                submitRef.current({ body, image });
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

  const onEmojiSelect = (emoji: any) => {
    quillRef.current?.insertText(
      quillRef.current.getSelection()?.index || 0,
      emoji.native
    );
  };

  const onImageCancle = (index: number) => {
    setImages(
      (pre: any) => [...Array.from(pre).filter((_, i) => i !== index)] as any
    );
    imageElementRef.current!.value = "";
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type={"file"}
        accept="image/*"
        multiple
        ref={imageElementRef}
        onChange={(event) => {
          if (event.target.files) setImages(Array.from(event.target.files));
        }}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          disabled && "opacity-40"
        )}>
        <div ref={containerRef} className="h-full ql-custom" />
        {images.length > 0 && (
          <div className="flex">
            {Array.from(images).map((item, index) => (
              <div className="p-2">
                <div className="relative size-[62px] flex items-center justify-center group/image">
                  <button
                    onClick={onImageCancle.bind(null, index)}
                    className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center">
                    <XIcon className="size-3.5" />
                  </button>
                  <Image
                    src={URL.createObjectURL(item)}
                    alt="upload Image"
                    fill
                    className="rounded-xl overflow-hidden border object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button
              disabled={disabled}
              size="iconSmall"
              variant={"ghost"}
              onClick={() => {}}>
              <SmileIcon className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={onCancel}
                disabled={disabled}>
                Cancel
              </Button>
              <Button
                size={"sm"}
                onClick={() =>
                  onSubmit({
                    image: images,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  })
                }
                disabled={disabled}>
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
                  onClick={() => imageElementRef.current?.click()}>
                  <ImageIcon className="size-4" />
                </Button>
              </Hint>
              <Button
                disabled={disabled || isEmpty}
                size="iconSmall"
                variant={"ghost"}
                onClick={() =>
                  onSubmit({
                    image: images,
                    body: JSON.stringify(quillRef.current?.getContents()),
                  })
                }
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
      <div
        className={cn(
          "p-1 text-[10px] text-muted-foreground flex justify-end opacity-0",
          !isEmpty && "opacity-100"
        )}>
        <p>
          <strong>Shift + Return</strong> tot add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
