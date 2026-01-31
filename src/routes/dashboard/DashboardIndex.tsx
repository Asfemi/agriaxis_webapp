import { Button } from "@/components/Button";
import StatCard from "@/components/dashboard/StatCard";
import farmIcon from "/assets/icons/farm.svg";
import FarmHealthCardWrapper from "@/components/dashboard/FarmHealthCard";
import { FarmStatusCard } from "@/components/dashboard/FarmStatusCard";
import { generateFarmStatus } from "@/data/farm_status.data";
import { AddNewFarmSheet } from "@/components/dashboard/AddNewFarmSheet";
import { useState } from "react";
import { FarmDetailsContainer } from "@/components/dashboard/FarmDetailsContainer";
import type { Farm } from "@/models/farm.model";
import { createRoute, Link, type AnyRoute } from "@tanstack/react-router";
import { useGetDashboard } from "@/api/farms";

const farmStatus = generateFarmStatus();

type DASHBOARD_VIEW = "overview" | "farms" | "farm-details";

function DashboardIndex({farmListPath = "farms"}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState<DASHBOARD_VIEW>("overview");
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const { data } = useGetDashboard();

  return (
    <>
      {currentView === "overview" && (
        <div className="pb-4">
          <main className="rounded-[1.25rem] bg-white p-6 pb-9">
            <section className="mb-6">
              <header className="mb-3 flex w-full items-center justify-between">
                <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
                  Overview
                </h1>
                <div className="w-41.5">
                  <Button onClick={() => setIsFormOpen(true)} variant="primary">
                    Add a new farm
                  </Button>
                </div>
              </header>
              <div className="flex items-center gap-3">
                <StatCard
                  icon={
                    <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                      <img src={farmIcon} width={17.5} height={15.64} />
                    </div>
                  }
                  title="No. of farms"
                  value={data.no_of_farm}
                />
                <StatCard
                  icon={
                    <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                      <img src={farmIcon} width={17.5} height={15.64} />
                    </div>
                  }
                  title="No. of users"
                  value={data.no_of_users}
                />
                <StatCard
                  icon={
                    <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                      <img src={farmIcon} width={17.5} height={15.64} />
                    </div>
                  }
                  title="Crop monitoring"
                  value={data.overall_no_of_tests}
                />
              </div>
            </section>
            <section className="mb-6">
              <header className="mb-4 flex items-center justify-between">
                <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
                  Farm overview
                </h1>
                <Link to={farmListPath}>
                  <button
                    // onClick={() => setCurrentView("farms")}
                    className="font-medium text-[#0A814A] underline hover:opacity-80"
                  >
                    See all farms
                  </button>
                </Link>
              </header>
              <div className="w-full">
                <FarmHealthCardWrapper data={data} />
              </div>
            </section>
            <section>
              <header className="mb-4">
                <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
                  Individual farm status
                </h1>
              </header>
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                {farmStatus.map((entry) => (
                  <FarmStatusCard
                    key={entry.id}
                    title={entry.title}
                    status={entry.status}
                    stats={entry.stats}
                  />
                ))}
              </div>
            </section>
          </main>
        </div>
      )}
      {currentView === "farm-details" && selectedFarm && (
        <FarmDetailsContainer
          farm={selectedFarm}
          onClose={() => setCurrentView("farms")}
        />
      )}
      {isFormOpen && (
        <AddNewFarmSheet
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "dashboard",
    component: DashboardIndex,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Dashboard",
    },
  });
