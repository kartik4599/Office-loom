"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCreateWorkspaces } from "../api/use-create-workspaces";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { toast } from "sonner";

const CreateWorkspaceModal = () => {
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate } = useCreateWorkspaces();
  const router = useRouter();

  const afterSubmit = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess: (id) => {
          afterSubmit();
          toast.success("Workspace created succesfully");
          router.push("/workspace/" + id);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={false}
            onChange={({ target: { value } }) => setName(value)}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={false}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
