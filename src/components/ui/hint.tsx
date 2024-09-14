import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";

interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

const Hint = ({ children, side, label, align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className="bg-black text-white border border-white/5">
          <p className="text-xs font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
