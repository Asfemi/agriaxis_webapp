import StatCard from "@/components/dashboard/StatCard";
import farmIcon from "/assets/icons/farm.svg";
import testingIcon from "/assets/icons/testing.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import ServiceCard from "@/components/dashboard/ServiceCard";
import weatherIcon from "/assets/icons/weather.svg";
import climateIcon from "/assets/icons/climate.svg";
import treeIcon from "/assets/icons/tree.svg";
import {
  createRoute,
  useNavigate,
  type AnyRoute,
} from "@tanstack/react-router";
import { useGetCropInformationDashboard } from "@/api/crop-information";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES: {
  id: string;
  title: string;
  sub: string;
  icon: string;
  isDisabled?: boolean;
}[] = [
  {
    id: "weather",
    title: "Weather information",
    sub: "Click here to get your weather details",
    icon: weatherIcon,
  },
  {
    id: "climate",
    title: "Climate information",
    sub: "Click here to get your climate details",
    icon: climateIcon,
  },
  {
    id: "calendar",
    title: "Crop calendar",
    sub: "Click here to get your crop planting date",
    icon: treeIcon,
  },
];

function CropInformation() {
  const { data: dashboardData, isLoading } = useGetCropInformationDashboard();
  const navigate = useNavigate();

  const handleServiceClick = (service: {
    id: string;
    title: string;
    sub: string;
    icon: string;
    isDisabled?: boolean;
  }) => {
    if (service.isDisabled) return;
    navigate({ to: `${service.id}` });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <section className="rounded-[1.25rem] bg-white p-6 pb-9">
      <section className="mb-6">
        <header className="mb-3 w-full">
          <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
            Overview
          </h1>
        </header>
        <div className="flex items-center gap-3">
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <img src={farmIcon} width={17.5} height={15.64} />
              </div>
            }
            title="Total tests"
            value={dashboardData?.total_tests ?? 0}
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
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                <img src={testingIconGrey} width={20} height={20} />
              </div>
            }
            title="Completed Tests"
            value={dashboardData?.completed_tests ?? 0}
          />
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-red-500 bg-[#E7E7EA]">
                <X className="text-red-500" />
              </div>
            }
            title="Failed Tests"
            value={dashboardData?.failed_tests ?? 0}
          />
        </div>
      </section>
      <section>
        <header className="mb-4">
          <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
            Crop information services
          </h1>
        </header>
        <div className="flex w-full flex-col gap-2">
          {SERVICES.map((entry) => (
            <ServiceCard
              key={entry.id}
              onClick={() => handleServiceClick(entry)}
              className={cn(
                "transition-all",
                entry.isDisabled
                  ? "cursor-not-allowed opacity-50 grayscale-[0.5]"
                  : "cursor-pointer hover:bg-gray-50",
              )}
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
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "crop-information",
    component: CropInformation,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Crop Information",
    },
    head: () => ({
      meta: [{ title: "Crop Information" }],
    }),
  });
