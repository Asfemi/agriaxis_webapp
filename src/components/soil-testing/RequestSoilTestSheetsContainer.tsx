import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { Activity, useState } from "react";
import { FarmSizeForMeasurementCard } from "@/components/soil-testing/FarmSizeForMeasurementCard";
import { FarmMeasurementMethodCard } from "@/components/soil-testing/FarmMeasurementMethodCard";
import { GoogleMeasurementCard } from "@/components/soil-testing/GoogleMeasurementCard";
import { ManualMeasurementCard } from "@/components/soil-testing/ManualMeasurementCard";
import { MapMeasurementCard } from "./MapMeasurementCard";

const RequestSoilTestSheetsContainer: React.FC<{
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
        <Activity mode={currentView === "details" ? "visible" : "hidden"}>
          <FarmDetailsCard
            onClose={onClose}
            onConfirm={() => setCurrentView("size")}
          />
        </Activity>
        <Activity mode={currentView === "size" ? "visible" : "hidden"}>
          <FarmSizeForMeasurementCard
            onClose={() => setCurrentView("details")}
            onConfirm={() => setCurrentView("measurement_method")}
          />
        </Activity>
        <Activity
          mode={currentView === "measurement_method" ? "visible" : "hidden"}
        >
          <FarmMeasurementMethodCard
            onClose={() => setCurrentView("size")}
            onConfirm={handleMeasurementMethodSelection}
          />
        </Activity>
        <Activity
          mode={currentView === "google_measurement" ? "visible" : "hidden"}
        >
          <GoogleMeasurementCard
            onClose={() => setCurrentView("measurement_method")}
            onConfirm={() => setCurrentView("leaflet_map")}
          />
        </Activity>
        <Activity mode={currentView === "leaflet_map" ? "visible" : "hidden"}>
          <MapMeasurementCard
            onClose={() => setCurrentView("google_measurement")}
            onConfirm={onClose}
          />
        </Activity>
        <Activity
          mode={currentView === "manual_measurement" ? "visible" : "hidden"}
        >
          <ManualMeasurementCard
            onClose={() => setCurrentView("measurement_method")}
            onConfirm={onClose}
          />
        </Activity>
      </section>
    </section>
  );
};

export { RequestSoilTestSheetsContainer };
