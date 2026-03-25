import StatCard from "@/components/dashboard/StatCard";
import farmIcon from "/assets/icons/farm.svg";
import testingIcon from "/assets/icons/testing.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import processingIcon from "/assets/icons/processing.svg";
import ServiceCard from "@/components/dashboard/ServiceCard";
import weatherIcon from "/assets/icons/weather.svg";
import climateIcon from "/assets/icons/climate.svg";
import treeIcon from "/assets/icons/tree.svg";
import { createRoute, type AnyRoute } from "@tanstack/react-router";

function CropInformation() {
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
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#4F3824] bg-[#EDEBE9]">
                <img src={processingIcon} width={20} height={20} />
              </div>
            }
            title="Average turnaround time"
            value="0"
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
          <ServiceCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <img src={weatherIcon} width={20} height={20} />
              </div>
            }
            title="Weather information"
            value="Click here to get your weather details"
          />
          <ServiceCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <img src={climateIcon} width={20} height={20} />
              </div>
            }
            title="Climate information"
            value="Click here to get your climate details"
          />
          <ServiceCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <img src={treeIcon} width={20} height={20} />
              </div>
            }
            title="Crop calendar"
            value="Click here to get your crop planting date"
          />
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
      meta: [
        { title: "Crop Information" }
      ]
    })
  });
