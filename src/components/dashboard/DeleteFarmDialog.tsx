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
import { useDeleteFarm } from "@/api/farms";

type DeleteFarmDialogProps = {
  farmId: string;
  farmName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteFarmDialog = ({
  farmId,
  farmName,
  open,
  onOpenChange,
}: DeleteFarmDialogProps) => {
  const { mutateAsync: deleteFarm, isPending } = useDeleteFarm();

  const onConfirm = async () => {
    try {
      await deleteFarm(farmId);
      toast.success("Farm deleted successfully");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete farm";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete farm</DialogTitle>
          <DialogDescription>
            This will permanently remove{" "}
            <span className="font-semibold text-[#0F172A]">{farmName}</span>.
            Related test data may also be affected. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

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
            className="w-auto bg-[#E61504] px-5 py-3 hover:bg-[#c41203]"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete farm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
