import { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

export const useConfirm = (title: string, message?: string) => {
  const [promise, setpromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => new Promise((resolve) => setpromise({ resolve }));
  const cancel = () => setpromise(null);

  const handleCancel = () => {
    promise?.resolve(false);
    cancel();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    cancel();
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null} onOpenChange={cancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, ConfirmDialog };
};
