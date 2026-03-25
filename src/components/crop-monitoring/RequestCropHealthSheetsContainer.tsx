import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useState } from "react";
import { toast } from "sonner";
import { ProcessingResultCard } from "@/components/crop-monitoring/ProcessingResultCard";
import { CropHealthResultSheet } from "./CropHealthResultSheet";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useCropHealth } from "@/api/crop-monitoring";

export const RequestCropHealthSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const { formData } = useSoilTestingFormStore();
  const { mutate } = useCropHealth();

  const handleConfirm = () => {
    mutate(formData.farm_id ?? "");
    toast.success("Crop scanned successfully!");
    setCurrentView("processing");
    setTimeout(() => {
      setCurrentView("result");
    }, 2e3);
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
            onConfirm={() => handleConfirm()}
            requestServiceType={"Crop Health"}
          />
          <ProcessingResultCard isOpen={currentView === "processing"} />
        </section>
      </section>
      <CropHealthResultSheet
        isOpen={currentView === "result"}
        onClose={onClose}
      />
    </>
  );
};
