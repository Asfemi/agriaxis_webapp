import ServiceCard from "@/components/dashboard/ServiceCard";
import StatCard from "@/components/dashboard/StatCard";
import farmIcon from "/assets/icons/farm.svg";
import healthIcon from "/assets/icons/health.svg";
import monitoringIcon from "/assets/icons/monitoring.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import testingIcon from "/assets/icons/testing.svg";
import { useState } from "react";
import { CropMonitoringServicePage } from "@/components/crop-monitoring/CropMonitoringServicePage";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { RequestPestMonitoringSheetsContainer } from "@/components/crop-monitoring/RequestPestMonitoringSheetsContainer";
import { RequestCropHealthSheetsContainer } from "@/components/crop-monitoring/RequestCropHealthSheetsContainer";

const SERVICES = [
  {
    title: "Crop health",
    sub: "Click here to get your crop health result",
    icon: healthIcon,
  },
  {
    title: "Pest/Disease monitoring",
    sub: "Click here to get your pest management result",
    icon: monitoringIcon,
  },
];

type DASHBOARD_VIEW = "overview" | "service";

function CropMonitoring() {
  const [currentView, setCurrentView] = useState<DASHBOARD_VIEW>("overview");
  const [selectedServiceTitle, setSelectedServiceTitle] = useState("");
  const [showRequestHealthSheet, setShowRequestHealthSheet] = useState(false);
  const [showRequestPestSheet, setShowRequestPestSheet] = useState(false);

  const handleServiceClick = (title: string) => {
    setCurrentView("service");
    setSelectedServiceTitle(title);
  };

  const handleRequestInformationClick = (type: string) => {
    if (type === "Crop health") {
      setShowRequestHealthSheet(true);
    } else {
      setShowRequestPestSheet(true);
    }
  };

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
                value="0"
              />
              <StatCard
                icon={
                  <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                    <img src={testingIcon} width={20} height={20} />
                  </div>
                }
                title="Pending Tests"
                value="0"
              />
              <StatCard
                icon={
                  <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                    <img src={testingIconGrey} width={20} height={20} />
                  </div>
                }
                title="Completed Tests"
                value="0"
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
                  key={entry.title}
                  className="cursor-pointer"
                  onClick={() => handleServiceClick(entry.title)}
                  icon={
                    <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                      <img src={entry.icon} width={20} height={20} />
                    </div>
                  }
                  title={entry.title}
                  value={entry.sub}
                />
              ))}
            </div>
          </section>
        </section>
      )}
      {currentView === "service" && (
        <>
          <CropMonitoringServicePage
            title={selectedServiceTitle}
            onClose={() => setCurrentView("overview")}
            onRequestInformation={() =>
              handleRequestInformationClick(selectedServiceTitle)
            }
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
          <RequestCropHealthSheetsContainer
            isOpen={showRequestHealthSheet}
            onClose={() => setShowRequestHealthSheet(false)}
          />
          <RequestPestMonitoringSheetsContainer
            isOpen={showRequestPestSheet}
            onClose={() => setShowRequestPestSheet(false)}
          />
        </>
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
  });
