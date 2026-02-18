import { ChevronLeft } from "lucide-react";

export const FarmMeasurementMethodCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: (selection: "google" | "manual") => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <section className="size-full">
      <div className="flex h-full flex-col justify-between overflow-y-auto pb-10">
        <div>
          <header className="mb-10 flex items-start gap-3.5 pt-7 pl-6">
            <button
              onClick={onClose}
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
                onClick={() => onConfirm("google")}
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Leaflet map
              </button>

              <div className="flex items-center justify-center">
                <span className="text-[#939397]">Or use</span>
              </div>

              <button
                onClick={() => onConfirm("manual")}
                type="button"
                className="w-full rounded-xl bg-[#E7F2ED] py-4 text-center font-medium text-[#0A814A]"
              >
                Manual measurement
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
