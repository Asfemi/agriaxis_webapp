import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateFarm } from "@/api/farms";

type RenameFarmDialogProps = {
  farmId: string;
  currentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const RenameFarmDialog = ({
  farmId,
  currentName,
  open,
  onOpenChange,
}: RenameFarmDialogProps) => {
  const [name, setName] = useState(currentName);
  const { mutateAsync: updateFarm, isPending } = useUpdateFarm();

  useEffect(() => {
    if (open) {
      setName(currentName);
    }
  }, [open, currentName]);

  const onSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Farm name is required");
      return;
    }

    if (trimmed === currentName.trim()) {
      onOpenChange(false);
      return;
    }

    try {
      await updateFarm({ id: farmId, name: trimmed });
      toast.success("Farm renamed successfully");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to rename farm";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rename farm</DialogTitle>
          <DialogDescription>
            Update the farm name so you can tell similar farms apart.
          </DialogDescription>
        </DialogHeader>

        <label className="flex flex-col gap-2">
          <span className="font-neue text-sm font-medium text-[#434449]">
            Farm name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-xl border border-[#E8E8E8] px-4 py-3 font-neue text-[#0F172A] outline-none focus:border-[#0A814A]"
            placeholder="Enter farm name"
            autoFocus
          />
        </label>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="tertiary"
            className="w-auto px-5 py-3"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-auto px-5 py-3"
            onClick={onSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save name"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
