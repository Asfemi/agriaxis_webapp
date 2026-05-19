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
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { RenameResultModal } from "@/components/dashboard/RenameResultModal";
import type { CropInformationAnalytics } from "@/models/crop-information.model";
import { WeatherForecastSheet } from "./WeatherForecastSheet";
import { useDeleteCropInformationAnalysis, useRenameCropInformationAnalysis } from "@/api/crop-information";

export const WeatherAnalysisHistoryTable: React.FC<{ data: CropInformationAnalytics[] }> = ({ data }) => {
  const columnDefinition: Array<ColumnDef<CropInformationAnalytics>> = [
    {
      id: "name",
      header: "Name",
      accessorKey: "test_id"
    },
    {
      accessorKey: "farm_name",
      header: "Farm name",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge<CropInformationAnalytics["status"]>
          status={row.original.status ?? "-"}
          variant={row.original.status === "completed" ? "success" : "warning"}
        />
      ),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => (
        <span>
          {row.original.amount_paid ? row.original.amount_paid.toLocaleString() : 0}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
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
              <DropdownMenuItem onClick={() => handleViewResult(row.original)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleRenameResult(row.original)}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteResult(row.original.id)}
              >
                <span className="text-[#E61504CC]">Delete analysis</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => columnDefinition, []);
  const [showRenameResultModal, setShowRenameResultModal] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<CropInformationAnalytics>();
  const history = data;
  const [showResultSheet, setShowResultSheet] = useState(false);

  const { mutate: deleteResult } = useDeleteCropInformationAnalysis();
  const { mutate: renameResult } = useRenameCropInformationAnalysis();

  const handleRenameResult = (result: CropInformationAnalytics) => {
    setShowRenameResultModal(true);
    setSelectedResult(result);
  };

  const handleViewResult = (result: CropInformationAnalytics) => {
    setSelectedResult(result);
    setShowResultSheet(true);
  };

  const handleConfirmRenameResult = (
    newName: string,
    result: CropInformationAnalytics,
  ) => {
    renameResult(
      { id: result.id, name: newName },
      {
        onSuccess: () => {
          toast.success("Result renamed successfully!");
          setShowRenameResultModal(false);
        },
      },
    );
  };

  const handleDeleteResult = (id: string) => {
    deleteResult(id);
  };

  return (
    <div>
      <DataTable title="Analysis history" columns={columns} data={history} />
      <RenameResultModal
        isOpen={showRenameResultModal}
        value={selectedResult?.test_id ?? ""}
        onSave={(newName) =>
          handleConfirmRenameResult(newName, selectedResult!)
        }
        onClose={() => setShowRenameResultModal(false)}
      />
      {showResultSheet && (
        <WeatherForecastSheet id={selectedResult?.id} onClose={() => setShowResultSheet(false)} />
      )}
    </div>
  );
};

