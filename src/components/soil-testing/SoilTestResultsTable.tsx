import {
  useDeleteSoilTestingResult,
  useSoilTestingResults,
} from "@/api/soil-testing";
import { DataTable } from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import type {
  SoilTestingResult,
  Transaction,
} from "@/models/soil-testing.model";
import { type ColumnDef } from "@tanstack/react-table";
import { LoaderCircle, MoreVertical } from "lucide-react";
import { useMemo } from "react";

const StatusBadge: React.FC<{ status: Transaction["status"] }> = ({
  status,
}) => {
  const isCompleted = status === "completed";
  const bgColor = isCompleted ? "bg-[#E7F2ED]" : "bg-[#FFEEBE]";
  const textColor = isCompleted ? "text-[#0A814A]" : "text-[#674A00]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};

const SoilTestingResultsTable = () => {
  const { data: results, isLoading } = useSoilTestingResults();
  const { mutate: deleteResult } = useDeleteSoilTestingResult();

  const handleDeleteResult = (id: number) => {
    deleteResult(id);
  };

  const soilColumns: ColumnDef<SoilTestingResult>[] = [
    {
      accessorKey: "id",
      header: "Test ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "completed_at",
      header: "Date",
      cell: ({ row }) => <div>{formatDate(row.original.completed_at)}</div>,
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
              <DropdownMenuItem>View result</DropdownMenuItem>
              <DropdownMenuItem>Rename result</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteResult(row.original.id)}
              >
                <span className="text-[#E61504CC]">Delete Result</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => soilColumns, []);
  const data = useMemo(() => results ?? [], [results]);

  if (isLoading) return <LoaderCircle className="mx-auto animate-spin" />;

  return (
    <>
      <DataTable title="Test Result" columns={columns} data={data} />
    </>
  );
};
export { SoilTestingResultsTable };
