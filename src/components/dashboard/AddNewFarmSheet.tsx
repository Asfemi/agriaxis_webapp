import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { type NewFarmFormData } from "@/models/farm.model";
import { useCreateFarm } from "@/api/farms";
import { toast } from "sonner";
import { LeafletMapMeasurementCard } from "@/components/shared/LeafletMapMeasurementCard";
import { ManualMapMeasurementCard } from "@/components/shared/ManualMapMeasurementCard";
import { NewFarmForm } from "@/components/dashboard/NewFarmForm";

type MapType = "leaflet" | "manual";

const MapTypeSection = ({
  onConfirm,
}: {
  onConfirm: (selection: MapType) => void;
}) => {
  const handleClose = () => {};
  const handleSelection = (selection: MapType) => {
    onConfirm(selection);
  };

  return (
    <div className="ml-auto flex h-full w-full flex-col justify-between overflow-y-auto rounded-[1.25rem] bg-white pb-10 lg:max-w-xl">
      <div>
        <header className="mb-10 flex items-start gap-3.5 pt-7 pl-6">
          <button
            onClick={handleClose}
            className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
          >
            <ChevronLeft size={24} className="text-[#434449]" />
          </button>
          <div>
            <h5 className="font-neue text-xl font-bold text-[#130B30]">
              Farm measurement
            </h5>
            <h6 className="text-[#423C59]">
              Select how you will like to measure your farm land
            </h6>
          </div>
        </header>
        <section className="mx-20 space-y-6 pb-10">
          <div className="space-y-6 lg:max-w-md">
            <button
              onClick={() => handleSelection("leaflet")}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              Leaflet map
            </button>

            <div className="flex items-center justify-center">
              <span className="text-[#939397]">Or use</span>
            </div>

            <button
              onClick={() => handleSelection("manual")}
              type="button"
              className="w-full rounded-xl bg-[#E7F2ED] py-4 text-center font-medium text-[#0A814A]"
            >
              Manual measurement
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const AddNewFarmSheet: React.FC<{ onClose: () => void; isOpen: boolean }> = ({
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  type IView = "form" | "selection" | "leaflet" | "manual";
  const { mutate } = useCreateFarm();
  const [currentView, setCurrentView] = useState<IView>("form");
  const [formData, setFormData] = useState<NewFarmFormData | null>(null);

  const onSubmit = (data: NewFarmFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Farm created successfully!");
        onClose();
      },
      onError: () => toast.error("Failed to create farm. Please try again."),
    });
  };

  const handleSubmitForm = (data: NewFarmFormData) => {
    setCurrentView("selection");
    setFormData(data);
  };
  const handleMapSelection = (selection: MapType) => {
    setCurrentView(selection);
  };
  const handleMapClose = () => {
    setCurrentView("form");
  };
  const handleLeafletMapConfirm = (coordinates: string) => {
    const updatedData = { ...formData, coordinatesCsv: coordinates };
    setFormData(updatedData);
    onSubmit(updatedData);
  };
  const handleManualMapConfirm = (coordinates: string) => {
    const updatedData = { ...formData, coordinatesCsv: coordinates };
    setFormData(updatedData);
    onSubmit(updatedData);
  };

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      {currentView === "form" && (
        <NewFarmForm onClose={onClose} onConfirm={handleSubmitForm} />
      )}
      {currentView === "selection" && (
        <MapTypeSection onConfirm={handleMapSelection} />
      )}
      {currentView === "leaflet" && (
        <LeafletMapMeasurementCard
          onClose={handleMapClose}
          onConfirm={handleLeafletMapConfirm}
        />
      )}
      {currentView === "manual" && (
        <ManualMapMeasurementCard
          onClose={handleMapClose}
          onConfirm={handleManualMapConfirm}
        />
      )}
    </section>
  );
};

export { AddNewFarmSheet };
