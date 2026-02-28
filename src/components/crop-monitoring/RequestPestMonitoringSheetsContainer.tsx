import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useState } from "react";
import { FarmSizeForMeasurementCard } from "@/components/soil-testing/FarmSizeForMeasurementCard";
import { FarmMeasurementMethodCard } from "@/components/soil-testing/FarmMeasurementMethodCard";
import { GoogleMeasurementCard } from "@/components/soil-testing/GoogleMeasurementCard";
import { ManualMeasurementCard } from "@/components/soil-testing/ManualMeasurementCard";
import { MapMeasurementCard } from "@/components/soil-testing/MapMeasurementCard";
import { SoilTestResultsCard } from "@/components/soil-testing/SoilTestResultsCard";

const RequestPestMonitoringSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const handleMeasurementMethodSelection = (selection: "google" | "manual") => {
    if (selection === "google") {
      setCurrentView("google_measurement");
    } else {
      setCurrentView("manual_measurement");
    }
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
          onConfirm={() => setCurrentView("size")}
        />
        <FarmSizeForMeasurementCard
          isOpen={currentView === "size"}
          onClose={() => setCurrentView("details")}
          onConfirm={() => setCurrentView("measurement_method")}
        />
        <FarmMeasurementMethodCard
          isOpen={currentView === "measurement_method"}
          onClose={() => setCurrentView("size")}
          onConfirm={handleMeasurementMethodSelection}
        />
        <GoogleMeasurementCard
          isOpen={currentView === "google_measurement"}
          onClose={() => setCurrentView("measurement_method")}
          onConfirm={() => setCurrentView("leaflet_map")}
        />
        <MapMeasurementCard
          isOpen={currentView === "leaflet_map"}
          onClose={() => setCurrentView("google_measurement")}
          onConfirm={() => setCurrentView("result")}
        />
        <ManualMeasurementCard
          isOpen={currentView === "manual_measurement"}
          onClose={() => setCurrentView("measurement_method")}
          onConfirm={() => setCurrentView("result")}
        />
        <SoilTestResultsCard
          isOpen={currentView === "result"}
          onClose={() => setCurrentView("measurement_method")}
        />
      </section>
    </section>
  );
};

export { RequestPestMonitoringSheetsContainer };

