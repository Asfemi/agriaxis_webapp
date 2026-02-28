import { FarmMeasurementSelectionCard } from "@/components/dashboard/FarmMeasurementSelectionCard";
import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { Activity, useEffect, useState } from "react";
import { PreviousLandMeasurementCard } from "@/components/crop-monitoring/PreviousLandMeasurementCard";
import { PaymentMethodsSheet } from "@/components/soil-testing/PaymentMethodsSheet";
import { FarmMeasurementMethodCard } from "@/components/soil-testing/FarmMeasurementMethodCard";
import { MapMeasurementCard } from "@/components/soil-testing/MapMeasurementCard";
import { ManualMeasurementCard } from "@/components/soil-testing/ManualMeasurementCard";
import { CropImageCard } from "@/components/crop-monitoring/CropImageCard";
import { toast } from "sonner";
import { ProcessingResultCard } from "@/components/crop-monitoring/ProcessingResultCard";
import { ViewSoilTestResultSheet } from "@/components/dashboard/ViewSoilTestResultSheet";
import type { FarmTest } from "@/models/farm.model";
import { generateFarmTest } from "@/data/farm.data";

export const RequestCropInformationSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}> = ({ isOpen, onClose, serviceType }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const [result, setResult] = useState<FarmTest | null>(null);
  useEffect(() => {
    setResult(generateFarmTest());
  }, []);
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
  const handleProceedToScan = () => {
    setCurrentView("image_upload");
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
          requestServiceType={serviceType}
        />
        <Activity mode={currentView === "measurement" ? "visible" : "hidden"}>
          <FarmMeasurementSelectionCard
            onClose={() => setCurrentView("details")}
            onConfirm={(selection) =>
              handleMeasurementMethodSelection(selection)
            }
            serviceType={serviceType}
          />
        </Activity>
        {currentView === "existing_measurement" && (
          <PreviousLandMeasurementCard
            onClose={() => setCurrentView("details")}
            onConfirm={handleProceedToScan}
          />
        )}
        <FarmMeasurementMethodCard
          isOpen={currentView === "measurement_method"}
          onClose={() => setCurrentView("measurement")}
          onConfirm={handleMeasurementMapMethodSelection}
        />
        <CropImageCard
          isOpen={currentView === "image_upload"}
          onClose={() => setCurrentView("existing_measurement")}
          onConfirm={(imageData) => {
            console.log("Image ready for processing:", imageData);
            handleProceedToPayment();
            // Move to next step, e.g., setCurrentView("analyzing")
          }}
        />
        <MapMeasurementCard
          isOpen={currentView === "google_measurement"}
          onClose={() => setCurrentView("measurement_method")}
          onConfirm={() => setCurrentView("image_upload")}
        />
        <ManualMeasurementCard
          isOpen={currentView === "manual_measurement"}
          onClose={() => setCurrentView("measurement_method")}
          onConfirm={() => setCurrentView("image_upload")}
        />
        <Activity mode={currentView === "payment" ? "visible" : "hidden"}>
          <PaymentMethodsSheet
            isOpen={true}
            onClose={() => setCurrentView("measurement_method")}
            onConfirm={handleConfirm}
          />
        </Activity>
        <ProcessingResultCard isOpen={currentView === "processing"} />
        <ViewSoilTestResultSheet
          isOpen={currentView === "result"}
          test={result!}
          onClose={onClose}
        />
      </section>
    </section>
  );
};
