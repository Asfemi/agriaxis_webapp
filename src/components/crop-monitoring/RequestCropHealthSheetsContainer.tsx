import { FarmMeasurementSelectionCard } from "@/components/dashboard/FarmMeasurementSelectionCard";
import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { Activity, useState } from "react";
import { PreviousLandMeasurementCard } from "@/components/crop-monitoring/PreviousLandMeasurementCard";
import { PaymentMethodsSheet } from "@/components/soil-testing/PaymentMethodsSheet";
import { FarmMeasurementMethodCard } from "@/components/soil-testing/FarmMeasurementMethodCard";
import { MapMeasurementCard } from "@/components/soil-testing/MapMeasurementCard";
import { ManualMeasurementCard } from "@/components/soil-testing/ManualMeasurementCard";
import { CropImageCard } from "@/components/crop-monitoring/CropImageCard";
import { toast } from "sonner";
import { ProcessingResultCard } from "@/components/crop-monitoring/ProcessingResultCard";
import { CropHealthResultSheet } from "./CropHealthResultSheet";

export const RequestCropHealthSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose  }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const handleMeasurementMethodSelection = (selection: "existing" | "new") => {
    if (selection === "existing") {
      setCurrentView("existing_measurement");
    } else {
      setCurrentView("measurement_method");
    }
  };
  const handleProceedToPayment = () => {
    setCurrentView("payment");
  };

  const handleMeasurementMapMethodSelection = (
    selection: "google" | "manual",
  ) => {
    if (selection === "google") {
      setCurrentView("google_measurement");
    } else {
      setCurrentView("manual_measurement");
    }
  };

  const handleConfirm = () => {
    toast.success("Crop scanned successfully!");
    setCurrentView("processing");
    setTimeout(() => {
      setCurrentView("result");
    }, 2e3);
  };

  return (
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
          onConfirm={() => setCurrentView("existing_measurement")}
          requestServiceType={"Crop Health"}
        />
        <ProcessingResultCard isOpen={currentView === "processing"} />
        <CropHealthResultSheet
          isOpen={currentView === "result"}
          onClose={onClose}
        />
      </section>
    </section>
  );
};

