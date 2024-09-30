import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { useGetHuddle } from "../api/use-get-huddle";
import { useDeleteHuddle } from "../api/use-delete-huddle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxCross1 } from "react-icons/rx";
import { FaHeadphonesAlt } from "react-icons/fa";
import { useAcceptHuddle } from "../api/use-accept-huddle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CallModel = () => {
  const [open, setOpen] = useState(false);
  const { data: huddle } = useGetHuddle();
  const { mutate: cancleHuddle } = useDeleteHuddle();
  const { mutate: accpetHuddle } = useAcceptHuddle();
  const router = useRouter();

  const onOpenChange = (value: boolean) => {
    setOpen(value);
    if (!huddle?.hiddleId) return;
    cancleHuddle({ id: huddle.hiddleId });
  };

  const acceptHandler = () => {
    if (!huddle?.hiddleId) return;
    accpetHuddle({ id: huddle.hiddleId });
  };

  useEffect(() => {
    const value = Boolean(huddle);
    setOpen(value);
    if (huddle?.status === "accepted") {
      router.push("/meet/" + huddle.hiddleId);
      toast.success("Joined Meet");
    }

    // return () => {
    //   if (huddle) {
    //     cancleHuddle({ id: huddle.hiddleId });
    //   }
    // };
  }, [huddle, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-96 w-96 bg-[#2D5D62] border-0 text-white">
        <DialogHeader>
          <DialogTitle>Huddle</DialogTitle>
        </DialogHeader>
        <div className="bg-[#50767a] rounded-2xl gap-2 h-72 w-full flex flex-col justify-start p-5 items-center">
          <Avatar className="size-24 mr-2">
            <AvatarImage src={huddle?.data.user.image} />
            <AvatarFallback className="bg-[#C5E4EA] font-bold">
              {huddle?.data.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xl font-semibold">
            {huddle?.data.user.name}
          </span>
          <span className="text-xl font-semibold">
            {huddle?.isCalling ? "Calling . . ." : "Calling you . . ."}
          </span>
          <div className="flex justify-between items-center mt-5 gap-5">
            <DialogClose>
              <Button
                className="rounded-full h-14 w-14"
                variant={"destructive"}>
                <RxCross1 className="" />
              </Button>
            </DialogClose>
            {!huddle?.isCalling && (
              <Button
                onClick={acceptHandler}
                className="bg-green-500 rounded-full h-14 w-14"
                variant={"secondary"}>
                <FaHeadphonesAlt />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallModel;
