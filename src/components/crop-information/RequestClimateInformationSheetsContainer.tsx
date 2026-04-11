import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useState } from "react";
import { toast } from "sonner";
import type { UpdatedClimateAnalysisData } from "@/models/crop-information.model";
import { useFetchClimateAnalysis } from "@/api/crop-information";
import { ClimateInformationSheet } from "@/components/crop-information/ClimateInformationSheet";

export const RequestClimateInformationSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { formData } = useSoilTestingFormStore();

  const [currentView, setCurrentView] = useState("details");
  const [analysisData, setAnalysisData] = useState<UpdatedClimateAnalysisData>();

  const { mutate: fetchClimateAnalysis } = useFetchClimateAnalysis();

  const handleConfirm = () => {
    if (!formData.farm_id) {
      toast.error("Please select a farm first!");
      return;
    }
    fetchClimateAnalysis(formData.farm_id, {
      onSuccess: (data) => {
        toast.success("Climate analysis data fetched successfully!");
        setAnalysisData(data);
        setCurrentView("result");
      },
    });
  };

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
        <FarmDetailsCard
          isOpen={currentView === "details"}
          onClose={onClose}
          onConfirm={handleConfirm}
        />
        {currentView === "result" && (
          <ClimateInformationSheet
            onClose={onClose}
            analysisData={analysisData}
          />
        )}
      </section>
    </section>
  );
};
