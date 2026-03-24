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
import type {
  DiseaseDetectionHistory,
} from "@/models/crop-monitoring.model";
import StatusBadge from "@/components/StatusBadge";
import {
  useDeleteDiseaseDetectionResult,
  useGetDiseaseDetectionHistory,
  useRenameDiseaseDetectionResult,
} from "@/api/crop-monitoring";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { RenameResultModal } from "@/components/dashboard/RenameResultModal";
import { DiseaseDetectResultSheet } from "@/components/crop-monitoring/DiseaseDetectResultSheet";

export const DiseaseDetectionHistoryTable = () => {
  const columnDefinition: Array<ColumnDef<DiseaseDetectionHistory>> = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "farm_name",
      header: "Farm name",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge<DiseaseDetectionHistory["status"]>
          status={row.original.status ?? "-"}
          variant={row.original.status === "processing" ? "warning" : "success"}
        />
      ),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => (
        <span>
          ₦{row.original.payment ? row.original.payment.toLocaleString() : 0}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="capitalize">{formatDate(row.original.datetime)}</span>
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
    useState<DiseaseDetectionHistory>();
  const { data } = useGetDiseaseDetectionHistory();
  const history = data ?? [];
  const [showResultSheet, setShowResultSheet] = useState(false);

  const { mutate: deleteResult } = useDeleteDiseaseDetectionResult();
  const { mutate: renameResult } = useRenameDiseaseDetectionResult();

  const handleRenameResult = (result: DiseaseDetectionHistory) => {
    setShowRenameResultModal(true);
    setSelectedResult(result);
  };

  const handleViewResult = (result: DiseaseDetectionHistory) => {
    setSelectedResult(result);
    setShowResultSheet(true);
  };

  const handleConfirmRenameResult = (
    newName: string,
    result: DiseaseDetectionHistory,
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
        value={selectedResult?.name ?? ""}
        onSave={(newName) =>
          handleConfirmRenameResult(newName, selectedResult!)
        }
        onClose={() => setShowRenameResultModal(false)}
      />
      {showResultSheet && (
        <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
          <section
            className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DiseaseDetectResultSheet
              isOpen={true}
              result={selectedResult!}
              onClose={() => setShowResultSheet(false)}
            />
          </section>
        </section>
      )}
    </div>
  );
};
