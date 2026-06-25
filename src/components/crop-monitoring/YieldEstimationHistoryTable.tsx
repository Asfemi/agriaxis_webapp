import { MoreVertical } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { YieldEstimation } from "@/models/crop-monitoring.model";
import StatusBadge from "@/components/StatusBadge";
import {
  useDeleteYieldEstimationResult,
  useGetYieldEstimationHistory,
  useRenameYieldEstimationResult,
} from "@/api/crop-monitoring";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { RenameResultModal } from "@/components/dashboard/RenameResultModal";
import { YieldEstimationSheet } from "./YieldEstimationSheet";

export const YieldEstimationHistoryTable = () => {
  const columnDefinition: Array<ColumnDef<YieldEstimation>> = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "farm_size",
      header: "Farm size",
      cell: ({ row }) => (
        <span>
          {row.original.land_size} {row.original.land_unit}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge<YieldEstimation["status"]>
          status={row.original.status ?? "-"}
          variant={row.original.status === "completed" ? "success" : "warning"}
        />
      ),
    },
    {
      accessorKey: "date_time",
      header: "Time stamp",
      cell: ({ row }) => (
        <span className="capitalize">
          {formatDateTime(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(row.original)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRename(row.original)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                <span className="text-[#E61504CC]">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => columnDefinition, []);
  const [showRenameDataModal, setShowRenameDataModal] = useState(false);
  const [selectedData, setSelectedData] = useState<YieldEstimation>();
  const { data } = useGetYieldEstimationHistory();
  const history = data ?? [];
  const [showDataSheet, setShowDataSheet] = useState(false);

  const { mutate: deleteData } = useDeleteYieldEstimationResult();
  const { mutate: renameData } = useRenameYieldEstimationResult();

  const handleRename = (result: YieldEstimation) => {
    setShowRenameDataModal(true);
    setSelectedData(result);
  };

  const handleView = (result: YieldEstimation) => {
    setSelectedData(result);
    setShowDataSheet(true);
  };

  const handleConfirmRenameResult = (
    newName: string,
    result: YieldEstimation,
  ) => {
    renameData(
      { id: result.id, name: newName },
      {
        onSuccess: () => {
          toast.success("Estimation renamed successfully!");
          setShowRenameDataModal(false);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteData(id);
  };

  return (
    <div>
      <DataTable title="Analysis history" columns={columns} data={history} />
      <RenameResultModal
        isOpen={showRenameDataModal}
        value={selectedData?.name ?? ""}
        onSave={(newName) => handleConfirmRenameResult(newName, selectedData!)}
        onClose={() => setShowRenameDataModal(false)}
      />
      {showDataSheet && (
        <YieldEstimationSheet
          estimationData={selectedData!}
          onClose={() => setShowDataSheet(false)}
        />
      )}
    </div>
  );
};
