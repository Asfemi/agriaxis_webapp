import { ChevronLeft } from "lucide-react";
import healthIcon from "/assets/icons/health.svg";

export const CropHealthResultSheet: React.FC<{
  onClose?: () => void;
  isOpen: boolean;
}> = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="relative z-50 ml-auto h-full w-3/4 overflow-y-auto rounded-[1.25rem] bg-white p-8">
        <header className="absolute top-12 left-10 z-2 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
        </header>
        <section className="relative flex size-full flex-col justify-between rounded-xl bg-[url('/assets/images/crop_health_result.png')] bg-cover bg-center pb-3">
          <div></div>
          <div className="mx-auto w-[95%] rounded-xl bg-white px-4 py-6">
            <div className="flex flex-col">
              <div className="mb-5 flex size-10 items-center justify-center">
                <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                  <img src={healthIcon} width={20} height={20} />
                </div>
              </div>

              <div>
                <h6 className="font-neue mb-4 font-semibold text-[#130B30]">
                  Analysis Report
                </h6>
                <section className="grid grid-cols-5">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-neue text-sm font-semibold text-[#423C59]">
                      Insight
                    </p>
                    <div className="mb-3 size-2 rounded-full bg-[#7BDCFF]"></div>
                    <div className="mb-3 size-2 rounded-full bg-[#0A814A]"></div>
                    <div className="mb-3 size-2 rounded-full bg-[#EEB72C]"></div>
                    <div className="mb-3 size-2 rounded-full bg-[#E52B67]"></div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-neue text-sm font-semibold text-[#423C59]">
                      Value
                    </p>
                    <p className="font-neue text-sm text-[#423C59]">0.1</p>
                    <p className="font-neue text-sm text-[#423C59]">0.4</p>
                    <p className="font-neue text-sm text-[#423C59]">0.2</p>
                    <p className="font-neue text-sm text-[#423C59]">-1</p>
                  </div>
                  <div className="col-span-3 flex flex-col gap-1.5">
                    <p className="font-neue text-sm font-semibold text-[#423C59]">
                      Description
                    </p>
                    <p className="font-neue text-sm text-[#423C59]">
                      Health, dense vegetation
                    </p>
                    <p className="font-neue text-sm text-[#423C59]">
                      Sparse or stressed vegetation
                    </p>
                    <p className="font-neue text-sm text-[#423C59]">
                      Non-vegetated surfaces
                    </p>
                    <p className="font-neue text-sm text-[#423C59]">
                      Over log of water
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};
