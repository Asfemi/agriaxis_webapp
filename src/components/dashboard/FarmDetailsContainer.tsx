import type { Farm, FarmTest } from "@/models/farm.model";
import { ChevronLeft, MoreVertical } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";
import { ViewSoilTestResultSheet } from "@/components/dashboard/ViewSoilTestResultSheet";
import { RenameResultModal } from "@/components/dashboard/RenameResultModal";
import { Link, useParams } from "@tanstack/react-router";
import { useGetFarm } from "@/api/farms";

export const FarmDetailsContainer = ({
  farmListPath = "/dashboard/dashboard/farms",
}) => {
  const { id } = useParams({ from: "/dashboard/dashboard/farms/details/$id" });

  const { data: farmData } = useGetFarm(Number(id));
  const testColumns: ColumnDef<FarmTest>[] = [
    {
      accessorKey: "testID",
      header: "Test ID",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge<FarmTest["status"]>
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
      header: "More",
      cell: () => (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setViewSoilTestResult(true)}>
                View result
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowRenameResultModal(true)}>
                Rename result
              </DropdownMenuItem>
              <DropdownMenuItem>Download result</DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-[#E61504CC]">Delete result</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => testColumns, []);
  const [data] = useState(() => []);
  const [viewSoilTestResult, setViewSoilTestResult] = useState(false);
  const [showRenameResultModal, setShowRenameResultModal] = useState(false);

  return (
    <>
      <main className="rounded-[1.25rem] bg-white p-6 pb-9">
        <header className="mb-3">
          <Link to={farmListPath}>
            <button className="mb-5 grid size-7 place-items-center rounded-full bg-[#E8E8E8]">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-6">
              <h6 className="font-neue text-2xl font-bold text-[#0F172A]">
                {`${farmData.name}, ${farmData.location.state}`}
              </h6>
              <StatusBadge<Farm["status"]>
                status={farmData.health_status}
                variant={
                  farmData.health_status === "healthy" ? "success" : "warning"
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6898 17.2211C10.598 17.3591 10.4552 17.4549 10.2927 17.4876C10.1302 17.5203 9.96144 17.4871 9.82344 17.3953C7.46888 15.8289 4.70297 14.9954 1.875 15C1.70924 15 1.55027 14.9342 1.43306 14.8169C1.31585 14.6997 1.25 14.5408 1.25 14.375C1.25 14.2092 1.31585 14.0503 1.43306 13.9331C1.55027 13.8158 1.70924 13.75 1.875 13.75C4.94932 13.7453 7.95609 14.6517 10.5156 16.3547C10.6536 16.4465 10.7495 16.5893 10.7821 16.7518C10.8148 16.9143 10.7816 17.0831 10.6898 17.2211ZM1.875 11.25C1.70924 11.25 1.55027 11.3158 1.43306 11.4331C1.31585 11.5503 1.25 11.7092 1.25 11.875C1.25 12.0408 1.31585 12.1997 1.43306 12.3169C1.55027 12.4342 1.70924 12.5 1.875 12.5C6.29283 12.4899 10.5365 14.2222 13.6852 17.3211C13.7432 17.3808 13.8127 17.4283 13.8894 17.4608C13.9661 17.4934 14.0486 17.5102 14.1319 17.5104C14.2152 17.5105 14.2977 17.4941 14.3746 17.4619C14.4515 17.4297 14.5211 17.3825 14.5794 17.323C14.6378 17.2635 14.6836 17.1929 14.7143 17.1155C14.745 17.038 14.7599 16.9552 14.7581 16.8719C14.7563 16.7886 14.7378 16.7065 14.7039 16.6304C14.6699 16.5543 14.621 16.4858 14.5602 16.4289C11.1785 13.0999 6.62029 11.239 1.875 11.25ZM18.125 12.5C16.8475 12.4992 15.574 12.643 14.3289 12.9289C14.7581 13.2544 15.1747 13.5971 15.5789 13.957C16.4206 13.8192 17.2721 13.7499 18.125 13.75C18.2908 13.75 18.4497 13.8158 18.5669 13.9331C18.6842 14.0503 18.75 14.2092 18.75 14.375C18.75 14.5408 18.6842 14.6997 18.5669 14.8169C18.4497 14.9342 18.2908 15 18.125 15C17.6562 15 17.193 15.0227 16.7305 15.0672C17.1638 15.5188 17.5789 15.9911 17.9758 16.4844C18.0301 16.548 18.0712 16.622 18.0964 16.7018C18.1216 16.7816 18.1306 16.8657 18.1227 16.9491C18.1148 17.0324 18.0903 17.1133 18.0505 17.187C18.0108 17.2607 17.9566 17.3256 17.8913 17.378C17.826 17.4303 17.7508 17.469 17.6702 17.4917C17.5896 17.5145 17.5053 17.5208 17.4223 17.5103C17.3392 17.4998 17.2591 17.4728 17.1867 17.4307C17.1143 17.3887 17.0511 17.3326 17.0008 17.2656C15.1892 14.9939 12.8881 13.1607 10.269 11.9026C7.64991 10.6446 4.78055 9.99417 1.875 10C1.70924 10 1.55027 9.93415 1.43306 9.81694C1.31585 9.69973 1.25 9.54076 1.25 9.375C1.25 9.20924 1.31585 9.05027 1.43306 8.93306C1.55027 8.81585 1.70924 8.75 1.875 8.75C3.13275 8.75023 4.38789 8.8645 5.625 9.09141V6.25C5.625 6.15297 5.64759 6.05728 5.69098 5.97049C5.73438 5.88371 5.79738 5.80822 5.875 5.75L10.875 2C10.9832 1.91886 11.1148 1.875 11.25 1.875C11.3852 1.875 11.5168 1.91886 11.625 2L16.625 5.75C16.7026 5.80822 16.7656 5.88371 16.809 5.97049C16.8524 6.05728 16.875 6.15297 16.875 6.25V8.78828C17.2898 8.76406 17.7062 8.75 18.125 8.75C18.2908 8.75 18.4497 8.81585 18.5669 8.93306C18.6842 9.05027 18.75 9.20924 18.75 9.375C18.75 9.54076 18.6842 9.69973 18.5669 9.81694C18.4497 9.93415 18.2908 10 18.125 10C15.8806 9.99571 13.6527 10.3841 11.5422 11.1477C12.0339 11.4081 12.5146 11.6888 12.9844 11.9898C14.6536 11.4979 16.3848 11.2488 18.125 11.25C18.2908 11.25 18.4497 11.3158 18.5669 11.4331C18.6842 11.5503 18.75 11.7092 18.75 11.875C18.75 12.0408 18.6842 12.1997 18.5669 12.3169C18.4497 12.4342 18.2908 12.5 18.125 12.5ZM9.375 6.875H13.125C13.2908 6.875 13.4497 6.94085 13.5669 7.05806C13.6842 7.17527 13.75 7.33424 13.75 7.5V9.21406C14.3687 9.08073 14.9937 8.97656 15.625 8.90156V6.5625L11.25 3.28125L6.875 6.5625V9.36016C7.5099 9.51641 8.1349 9.70339 8.75 9.92109V7.5C8.75 7.33424 8.81585 7.17527 8.93306 7.05806C9.05027 6.94085 9.20924 6.875 9.375 6.875ZM10.0055 10.4117C10.817 10.0633 11.6503 9.76759 12.5 9.52656V8.125H10V10.4094L10.0055 10.4117Z"
                  fill="#939397"
                />
              </svg>
              <span className="font-neue text-lg font-semibold text-[#434449]">{`${farmData.size_hectares} Hectares`}</span>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex w-full flex-col gap-2 rounded-xl bg-[#F3F6F8] p-4">
              <span className="font-medium text-[#626267]">
                Soil PH <span className="text-[#64748B]">(from last test)</span>
              </span>
              <span className="font-neue text-3xl font-bold text-[#0A814A]">
                {0}
              </span>
            </div>
            <div className="flex w-full flex-col gap-2 rounded-xl bg-[#F3F6F8] p-4">
              <span className="font-medium text-[#626267]">
                Moisture{" "}
                <span className="text-[#64748B]">(from last test)</span>
              </span>
              <span className="font-neue text-3xl font-bold text-[#D9A728]">
                {0}%
              </span>
            </div>
            <div className="flex w-full flex-col gap-2 rounded-xl bg-[#F3F6F8] p-4">
              <span className="font-medium text-[#626267]">
                Nutrient{" "}
                <span className="text-[#64748B]">(from last test)</span>
              </span>
              <span className="font-neue text-3xl font-bold text-[#0A814A] capitalize">
                {0}
              </span>
            </div>
            <div className="flex w-full flex-col gap-2 rounded-xl bg-[#F3F6F8] p-4">
              <span className="font-medium text-[#626267]">
                Total no. of test
              </span>
              <span className="font-neue text-3xl font-bold text-[#130B30]">
                {0}
              </span>
            </div>
          </div>
          <DataTable title="Test performed" columns={columns} data={data} />
        </header>
      </main>
      <ViewSoilTestResultSheet
        onClose={() => setViewSoilTestResult(false)}
        isOpen={viewSoilTestResult}
        test={data[0]}
      />
      <RenameResultModal
        isOpen={showRenameResultModal}
        // value={data[0].testID}
        value={"1"}
        onSave={() => setShowRenameResultModal(false)}
        onClose={() => setShowRenameResultModal(false)}
      />
    </>
  );
};
