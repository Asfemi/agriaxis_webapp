import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
// import { useState } from "react";

export const FarmSizeForMeasurementCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
//   if (!isOpen) return null;

  // const [farmSize, setFarmSize] = useState(0);
  // const [farmSizeUnit, setFarmSizeUnit] = useState("");
  // const [totalPrice, setTotalPrice] = useState(0);
  // const [hectares, setHectares] = useState(0);

  return (
    <section className="size-full">
      <div className="flex h-full flex-col justify-between pb-10 overflow-y-auto">
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
                Farm details
              </h5>
              <h6 className="text-[#423C59]">
                Let's know your farm size for measurement
              </h6>
            </div>
          </header>
          <section className="mx-20 space-y-6 pb-10">
            <header>
              <h6 className="text-lg font-semibold text-[#939397]">
                Payment sumary
              </h6>
            </header>
            <div className="rounded-xl bg-[#0A814A14] p-4">
              <h3 className="mb-4 text-sm font-medium text-[#130B30]">
                Soil Testing fee
              </h3>

              <div className="grid grid-cols-3 justify-between text-sm">
                <div>
                  <p className="text-[#615C74]">Size</p>
                  <p className="font-medium text-[#100A37]">1</p>
                </div>

                <div>
                  <p className="text-[#615C74]">Unit</p>
                  <p className="font-medium text-[#100A37]">Hectare</p>
                </div>

                <div>
                  <p className="text-[#615C74]">Price</p>
                  <p className="font-medium text-[#100A37]">₦25,000</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="grow">
                <label
                  htmlFor="farm_size"
                  className="mb-1.5 text-sm text-[#130B30]"
                >
                  Farm size
                </label>
                <div className="rounded-lg bg-[#F3F6F8] p-3.5">
                  <input
                    id="farm_size"
                    type="text"
                    className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="What is your farm size"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="farm_size_unit"
                  className="mb-1.5 text-sm text-[#130B30]"
                >
                  Farm size unit
                </label>
                <div className="rounded-lg bg-[#F3F6F8] p-3.5">
                  <input
                    id="farm_size_unit"
                    type="text"
                    className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="Acres"
                  />
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#F3F6F8] px-4 py-6">
              <div className="mb-4 flex w-full items-center justify-between">
                <p className="text-sm text-[#615C74]">Total price</p>
                <p className="font-medium text-[#615C74]">₦0.0</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-[#615C74]">Hectare/s</p>
                <p className="font-medium text-[#615C74]">0</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mx-20">
          <Button onClick={onConfirm} variant="primary">
            Proceed to measure
          </Button>
        </div>
      </div>
    </section>
  );
};
