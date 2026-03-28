import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useState } from "react";
import { toast } from "sonner";
import { WeatherForecastSheet } from "./WeatherForecastSheet";
import type { WeatherAnalysisData } from "@/models/crop-information.model";
import { useFetchWeatherAnalysis } from "@/api/crop-information";

export const RequestWeatherInformationSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { formData } = useSoilTestingFormStore();

  const [currentView, setCurrentView] = useState("details");
  const [analysisData, setAnalysisData] = useState<WeatherAnalysisData>();

  const { mutate: fetchWeatherAnalysis } = useFetchWeatherAnalysis();

  const handleSelectFarm = () => {
    fetchWeatherAnalysis(formData.farm_id ?? "", {
      onSuccess: (data) => {
        toast.success("Weather analysis data fetched successfully!");
        setAnalysisData(data);
        setCurrentView("result");
      }
    });
  }

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
        <FarmDetailsCard
          isOpen={currentView === "details"}
          onClose={onClose}
          onConfirm={handleSelectFarm}
        />
        {currentView === "result" && <WeatherForecastSheet onClose={onClose} analysisData={analysisData} />}
      </section>
    </section>
  );
};
