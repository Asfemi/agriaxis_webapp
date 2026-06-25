import ServiceCard from "@/components/dashboard/ServiceCard";
import StatCard from "@/components/dashboard/StatCard";
import farmIcon from "/assets/icons/farm.svg";
import healthIcon from "/assets/icons/health.svg";
import monitoringIcon from "/assets/icons/monitoring.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import testingIcon from "/assets/icons/testing.svg";
import { useState } from "react";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { useGetCropMonitoringDashboard } from "@/api/crop-monitoring";
import { cn } from "@/lib/utils";
import { CropHealthServicePage } from "@/components/crop-monitoring/CropHealthServicePage";
import { DiseaseServicePage } from "@/components/crop-monitoring/DiseaseServicePage";
import { YieldEstimationPage } from "@/components/crop-monitoring/YieldEstimationPage";

const SERVICES: {
  id: string;
  title: string;
  sub: string;
  icon: string;
  isDisabled?: boolean;
}[] = [
  {
    id: "health",
    title: "Crop health",
    sub: "Click here to get your crop health result",
    icon: healthIcon,
  },
  {
    id: "disease",
    title: "Pest/Disease monitoring",
    sub: "Click here to get your pest management result",
    icon: monitoringIcon,
  },
  {
    id: "yield",
    title: "Yield estimation",
    sub: "Click here to estimate crop yield using AI",
    icon: monitoringIcon,
  },
];

type DASHBOARD_VIEW = "overview" | "health" | "disease" | "yield";

function CropMonitoring() {
  const [currentView, setCurrentView] = useState<DASHBOARD_VIEW>("overview");

  const { data: dashboardData, isLoading } = useGetCropMonitoringDashboard();

  const handleServiceClick = (id: string) => {
    setCurrentView(id as DASHBOARD_VIEW);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {currentView === "overview" && (
        <section className="h-full rounded-[1.25rem] bg-white p-6 pb-9">
          <section className="mb-6">
            <header className="mb-3 w-full">
              <h1 className="font-neue text-lg font-semibold text-[#434449]">
                Crop monitoring
              </h1>
              <h2 className="font-medium text-[#615C74]">
                Monitor your crop health and also check out pests and diseases
                early before they damage your crops health.
              </h2>
            </header>
            <div className="grid gap-3 lg:grid-cols-3">
              <StatCard
                icon={
                  <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                    <img src={farmIcon} width={17.5} height={15.64} />
                  </div>
                }
                title="Total farms monitored"
                value={dashboardData?.total_farms_monitored ?? 0}
              />
              <StatCard
                icon={
                  <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                    <img src={testingIcon} width={20} height={20} />
                  </div>
                }
                title="Pending Farms"
                value={dashboardData?.pending_farms ?? 0}
              />
              <StatCard
                icon={
                  <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                    <img src={testingIconGrey} width={20} height={20} />
                  </div>
                }
                title="Completed Farms"
                value={dashboardData?.completed_farms ?? 0}
              />
            </div>
          </section>
          <section className="pb-9">
            <header className="mb-4">
              <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
                Services
              </h1>
            </header>
            <div className="flex w-full flex-col gap-2">
              {SERVICES.map((entry) => (
                <ServiceCard
                  key={entry.id}
                  className={cn(
                    "transition-all",
                    entry.isDisabled
                      ? "cursor-not-allowed opacity-50 grayscale-[0.5]"
                      : "cursor-pointer hover:bg-gray-50",
                  )}
                  onClick={() => {
                    if (!entry.isDisabled) {
                      handleServiceClick(entry.id);
                    }
                  }}
                  icon={
                    <div
                      className={cn(
                        "grid size-9.5 place-items-center rounded-[0.375rem] border",
                        entry.isDisabled
                          ? "border-gray-300 bg-gray-100"
                          : "border-[#0A814A] bg-[#E7F2ED]",
                      )}
                    >
                      <img
                        src={entry.icon}
                        width={20}
                        height={20}
                        alt={entry.title}
                      />
                    </div>
                  }
                  title={entry.title}
                  value={entry.isDisabled ? "Coming Soon" : entry.sub}
                />
              ))}
            </div>
          </section>
        </section>
      )}
      {currentView === "health" && (
        <>
          <CropHealthServicePage
            onClose={() => setCurrentView("overview")}
            data={dashboardData}
          />
          {/**
             <>
             <RequestCropInformationSheetsContainer
             serviceType={
             selectedServiceTitle.toLowerCase() === "crop health"
               ? "crop health"
               : "pest & disease monitoring"
               }
               isOpen={showRequestPestSheet}
               onClose={() => setShowRequestPestSheet(false)}
               />
               </>
            */}
        </>
      )}
      {currentView === "disease" && (
        <DiseaseServicePage
          onClose={() => setCurrentView("overview")}
          data={dashboardData}
        />
      )}
      {currentView === "yield" && (
        <YieldEstimationPage onClose={() => setCurrentView("overview")} />
      )}
    </>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "crop-monitoring",
    component: CropMonitoring,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Crop Monitoring",
    },
    head: () => ({
      meta: [{ title: "Crop Monitoring" }],
    }),
  });
