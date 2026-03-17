import { Button } from "@/components/Button";
import { ChevronLeft, MoreVertical } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import testingIcon from "/assets/icons/testing.svg";
import testingIconGreen from "/assets/icons/soil.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import processingIcon from "/assets/icons/processing.svg";
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
import type { CropMonitoringAnalysis } from "@/models/crop-monitoring.model";
import StatusBadge from "@/components/StatusBadge";
import { generateCropMonitoringAnalysis } from "@/data/crop-monitoring.data";

export const CropMonitoringServicePage: React.FC<{
  onClose: () => void;
  title: string;
  onRequestInformation: () => void;
}> = ({ onClose, title, onRequestInformation }) => {
  const columnDefinition: ColumnDef<CropMonitoringAnalysis>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "farm_name",
      header: "Farm name",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge<CropMonitoringAnalysis["status"]>
          status={row.original.status}
          variant={row.original.status === "processing" ? "warning" : "success"}
        />
      ),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => <span>₦{row.original.payment.toLocaleString()}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuItem>
                <span className="text-[#E61504CC]">Delete analysis</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => columnDefinition, []);
  const [data] = useState(() => generateCropMonitoringAnalysis());

  return (
    <main className="rounded-[1.25rem] bg-white p-6 pb-9">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <h5 className="font-neue text-lg font-semibold text-[#434449]">
            {title}
          </h5>
        </div>
        <div>
          <Button variant="primary" onClick={() => onRequestInformation()}>
            Request Information ₦25,000
          </Button>
        </div>
      </header>
      <section>
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <img src={testingIconGreen} width={17.5} height={15.64} />
              </div>
            }
            title="Total Tests"
            value="15"
          />
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                <img src={testingIcon} width={20} height={20} />
              </div>
            }
            title="Pending Farms"
            value="2"
          />
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                <img src={testingIconGrey} width={20} height={20} />
              </div>
            }
            title="Completed Farms monitored"
            value="10"
          />
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#4F3824] bg-[#EDEBE9]">
                <img src={processingIcon} width={20} height={20} />
              </div>
            }
            title="Average turnaround time"
            value="1.5 mins"
          />
        </div>
        <div>
          <DataTable title="Analysis history" columns={columns} data={data} />
        </div>
      </section>
    </main>
  );
};
