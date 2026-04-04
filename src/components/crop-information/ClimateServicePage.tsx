import { Button } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import testingIcon from "/assets/icons/testing.svg";
import testingIconGreen from "/assets/icons/soil.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import { ClimateAnalysisHistoryTable } from "@/components/crop-information/ClimateAnalysisHistoryTable";
import { useState } from "react";
import { useGetClimateDashboard } from "@/api/crop-information";
import { RequestClimateInformationSheetsContainer } from "./RequestClimateInformationSheetsContainer";
import { createRoute, useRouter, type AnyRoute } from "@tanstack/react-router";

const ClimateServicePage = () => {
  const [showRequestSheet, setShowRequestSheet] = useState(false);
  const { data: dashboardData } = useGetClimateDashboard();
  const router = useRouter()

  const onRequestInformation = () => {
    setShowRequestSheet(true)
  };

  return (
    <>
      <main className="rounded-[1.25rem] bg-white p-6 pb-9">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => router.history.back()}
              className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
            >
              <ChevronLeft size={20} />
            </button>
            <h5 className="font-neue text-lg font-semibold text-[#434449]">
              Climate Information
            </h5>
          </div>
          <div>
            <Button variant="primary" onClick={() => onRequestInformation()}>
              Request Information
            </Button>
          </div>
        </header>
        <section>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                  <img src={testingIconGreen} width={17.5} height={15.64} />
                </div>
              }
              title="Total no. of test"
              value={dashboardData?.number_of_tests ?? 0}
            />
            <StatCard
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                  <img src={testingIcon} width={20} height={20} />
                </div>
              }
              title="Pending Tests"
              value={dashboardData?.pending_tests ?? 0}
            />
            <StatCard
              className="col-span-2 lg:col-auto"
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                  <img src={testingIconGrey} width={20} height={20} />
                </div>
              }
              title="Completed Tests"
              value={dashboardData?.completed_tests ?? 0}
            />
          </div>
          <div>
            <ClimateAnalysisHistoryTable data={dashboardData?.analytics_history ?? []} />
          </div>
        </section>
      </main>
      <RequestClimateInformationSheetsContainer
        isOpen={showRequestSheet}
        onClose={() => setShowRequestSheet(false)}
      />
    </>
  );
};

export default (parentRoute: AnyRoute) => 
  createRoute({
    path: 'crop-information/climate',
    component: ClimateServicePage,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Crop Information",
    },
    head: () => ({
      meta: [{ title: "Crop Information | Climate" }],
    }),
  })
