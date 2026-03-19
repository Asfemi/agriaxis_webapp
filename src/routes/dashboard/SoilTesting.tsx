import { Button } from "@/components/Button";
import farmIcon from "/assets/icons/farm.svg";
import StatCard from "@/components/dashboard/StatCard";
import { SoilTestingResultsTable } from "@/components/soil-testing/SoilTestResultsTable";
import soilEmptyIcon from "/assets/icons/soil-empty.png";
import soilIcon from "/assets/icons/soil.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import testingIcon from "/assets/icons/testing.svg";
import { useEffect, useState } from "react";
import { RequestSoilTestSheetsContainer } from "@/components/soil-testing/RequestSoilTestSheetsContainer";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { useSoilTestingDashboard } from "@/api/soil-testing";
import { LoaderCircle } from "lucide-react";
import { useGetCost } from "@/api/payments";

function SoilTesting() {
  const [showRequestTest, setShowRequestTest] = useState(false);
  const [IS_EMPTY, setIsEmpty] = useState(false);
  const { data } = useSoilTestingDashboard();
  const { data: cost, isLoading: isLoadingCost } = useGetCost(
    "soil-testing",
    1,
  );

  useEffect(() => {
    const isEmpty = Object.values(data).every((value) => value === 0);
    setIsEmpty(isEmpty);
  }, [data]);

  return (
    <>
      <section className="rounded-[1.25rem] bg-white p-6 pb-9">
        <section className="mb-6">
          <header className="mb-3 flex w-full items-center justify-between">
            <h1 className="font-neue text-lg font-semibold text-[#939397] sm:text-xl">
              Overview
            </h1>
            <div className="w-fit">
              <Button
                disabled={isLoadingCost}
                variant="primary"
                onClick={() => setShowRequestTest(true)}
              >
                {isLoadingCost ? (
                  <LoaderCircle className="mx-auto animate-spin" />
                ) : (
                  `Request Test ₦${cost?.amount ?? 0}`
                )}
              </Button>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                  <img src={soilIcon} width={20} height={20} />
                </div>
              }
              title="Total Soil Tests"
              value={data.total_soil_tests}
            />
            <StatCard
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                  <img src={testingIcon} width={20} height={20} />
                </div>
              }
              title="Pending Tests"
              value={data.pending_payments}
            />
            <StatCard
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                  <img src={testingIconGrey} width={20} height={20} />
                </div>
              }
              title="Total Expense"
              value={`₦${data.total_revenue.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`}
            />
            <StatCard
              icon={
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#4F3824] bg-[#EDEBE9]">
                  <img src={farmIcon} width={20} height={20} />
                </div>
              }
              title="Total farms"
              value={data.total_farms}
            />
          </div>
        </section>
        <section>
          {IS_EMPTY ? (
            <div className="grid h-92 w-full place-items-center">
              <div className="size-fit text-center">
                <img
                  src={soilEmptyIcon}
                  width={97}
                  height={50}
                  className="mx-auto mb-3"
                />
                <p className="-mb-0.5 text-[#615C74]">
                  You have no soil test result.
                </p>
                <p className="text-[#615C74]">
                  Click the button above to get your farm soil test
                </p>
              </div>
            </div>
          ) : (
            <SoilTestingResultsTable />
          )}
        </section>
      </section>
      <RequestSoilTestSheetsContainer
        isOpen={showRequestTest}
        onClose={() => setShowRequestTest(false)}
      />
    </>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "soil-testing",
    component: SoilTesting,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Soil Health",
    },
  });
