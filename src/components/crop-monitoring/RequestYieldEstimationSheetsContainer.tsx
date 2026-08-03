import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useState } from "react";
import { toast } from "sonner";
import type { YieldEstimation } from "@/models/crop-monitoring.model";
import { useEstimateCropYield } from "@/api/crop-monitoring";
import { YieldEstimationSheet } from "./YieldEstimationSheet";
import { LongRunningProcessWarning } from "@/components/crop-monitoring/LongRunningProcessWarning";

export const RequestYieldEstimationSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { formData } = useSoilTestingFormStore();

  const [currentView, setCurrentView] = useState("details");
  const [resultData, setResultData] = useState<YieldEstimation>();

  const { mutate: fetchEstimation } = useEstimateCropYield();

  const handleConfirm = () => {
    fetchEstimation(formData.farm_id ?? "", {
      onSuccess: (data) => {
        toast.success("Yield estimation data fetched successfully!");
        setResultData(data);
        setCurrentView("result");
      },
    });
  };

  return (
    <>
      <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
        <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
          <FarmDetailsCard
            isOpen={currentView === "details"}
            onClose={onClose}
            onConfirm={() => setCurrentView("warning")}
            requestServiceType="yield estimation"
          />
          {currentView === "warning" && (
            <LongRunningProcessWarning
              onClose={onClose}
              onConfirm={() => handleConfirm()}
            />
          )}
          {currentView === "result" && (
            <YieldEstimationSheet
              onClose={onClose}
              estimationData={resultData}
            />
          )}
        </section>
      </section>
    </>
  );
};
