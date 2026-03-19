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
import { useCropMonitoringDiseaseDetect } from "@/api/crop-monitoring";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { faker } from "@faker-js/faker";

export const RequestPestMonitoringSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose  }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const [result, setResult] = useState<FarmTest | null>(null);
  const { formData } = useSoilTestingFormStore();
  const { mutate } = useCropMonitoringDiseaseDetect()
  useEffect(() => {
    setResult(generateFarmTest());
  }, []);

  const handleProceedToPayment = () => {
    setCurrentView("payment");
  };

  const handleConfirm = (image: File) => {
    // toast.success("Crop scanned successfully!");
    mutate({ name: `F/${faker.string.alphanumeric(5).toUpperCase()}`, image: image, farmId: formData.farm_id ?? ''})
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
          onConfirm={() => setCurrentView("image_upload")}
          requestServiceType={"Crop Health"}
        />
        <CropImageCard
          isOpen={currentView === "image_upload"}
          onClose={() => setCurrentView("details")}
          onConfirm={(imageData) => {
            console.log("Image ready for processing:", imageData);
            handleConfirm(imageData);
          }}
        />
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

