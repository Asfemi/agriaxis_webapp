import { Button } from "@/components/Button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import testingIcon from "/assets/icons/testing.svg";
import testingIconGreen from "/assets/icons/soil.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import type {
  CropMonitoringDashboardResponse,
} from "@/models/crop-monitoring.model";
import { useGetCost } from "@/api/payments";
import { DiseaseDetectionHistoryTable } from "./DiseaseDetectionHistoryTable";

export const CropMonitoringServicePage: React.FC<{
  onClose: () => void;
  title: string;
  onRequestInformation: () => void;
  data: CropMonitoringDashboardResponse | undefined;
}> = ({ onClose, title, onRequestInformation, data }) => {
  const { data: cost, isLoading: isLoadingCost } = useGetCost(
    "crop-monitoring",
    1,
  );

  const displayData = (() => {
    if (!data) {
      return { total: 0, pending: 0, completed: 0, history: [] };
    }

    // 2. Use the title to pick the correct branch and extract values
    if (title === "Crop health") {
      const ch = data.crop_health;
      return {
        total: ch.total_no_of_crop_tests,
        pending: ch.pending_crop_tests,
        completed: ch.completed_crop_tests,
        history: ch.analytics_history,
      };
    } else {
      const pm = data.pest_disease_monitoring;
      return {
        total: pm.total_no_of_farms_monitored,
        pending: pm.pending_farms_to_be_monitored,
        completed: pm.completed_farm_monitoring,
        history: pm.analytics_history,
      };
    }
  })();

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
            {isLoadingCost ? (
              <LoaderCircle className="mx-auto animate-spin" />
            ) : (
              `Request Information ₦${cost?.amount ?? 0}`
            )}
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
            title="Total Tests"
            value={displayData.total}
          />
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                <img src={testingIcon} width={20} height={20} />
              </div>
            }
            title="Pending Farms"
            value={displayData.pending}
          />
          <StatCard
            className="col-span-2 lg:col-auto"
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                <img src={testingIconGrey} width={20} height={20} />
              </div>
            }
            title="Completed Farms monitored"
            value={displayData.completed}
          />
        </div>
        <div>{title !== "Crop health" && <DiseaseDetectionHistoryTable />}</div>
      </section>
    </main>
  );
};
