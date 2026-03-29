import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useState } from "react";
import { toast } from "sonner";
import { CropHealthResultSheet } from "./CropHealthResultSheet";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useCropHealth } from "@/api/crop-monitoring";
import type { CropHealthHistory } from "@/models/crop-monitoring.model";
import { LongRunningProcessWarning } from "@/components/crop-monitoring/LongRunningProcessWarning";

export const RequestCropHealthSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const [result, setResult] = useState<CropHealthHistory>();
  const { formData } = useSoilTestingFormStore();
  const { mutate } = useCropHealth();

  const handleConfirm = () => {
    mutate(formData.farm_id ?? "", {
      onSuccess: (data) => {
        toast.success("Crop scanned successfully!");
        setResult(data);
        setCurrentView("result");
      },
    });
  };

  return (
    <>
      <section
        className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity"
        onClick={onClose}
      >
        <section
          className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <FarmDetailsCard
            isOpen={currentView === "details"}
            onClose={onClose}
            onConfirm={() => setCurrentView("warning")}
            requestServiceType={"Crop Health"}
          />
          {currentView === "warning" && (
            <LongRunningProcessWarning
              onClose={onClose}
              onConfirm={() => handleConfirm()}
            />
          )}
        </section>
      </section>
      {currentView === "result" && (
        <CropHealthResultSheet data={result!} onClose={onClose} />
      )}
    </>
  );
};
