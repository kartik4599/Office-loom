"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { useCreateChannel } from "../api/use-create-channel";
import { useCreateChannelModal } from "../store/use-create-channel-modal";

const CreateChannelModal = () => {
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateChannelModal();
  const { mutate, isPending } = useCreateChannel();
  const { id } = useParams();

  const afterSubmit = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { name, workspaceId: id as Id<"workspaces"> },
      {
        onSuccess: (id) => {
          afterSubmit();
          toast.success("Channel created succesfully");
          // router.push("/workspace/" + id);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={({ target: { value } }) => setName(value)}
            required
            autoFocus
            minLength={3}
            placeholder="Channel name e.g 'General', 'Meeting', 'Developers', etc"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
