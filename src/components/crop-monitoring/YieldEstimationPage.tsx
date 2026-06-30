import { Button } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import { YieldEstimationHistoryTable } from "./YieldEstimationHistoryTable";
import { RequestYieldEstimationSheetsContainer } from "./RequestYieldEstimationSheetsContainer";
import { useState } from "react";

export const YieldEstimationPage: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [showRequestYieldEstimationSheet, setShowRequestYieldEstimationSheet] =
    useState(false);

  const onRequestInformation = () => {
    setShowRequestYieldEstimationSheet(true);
  };

  return (
    <>
      <main className="rounded-[1.25rem] bg-white p-6 pb-9">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
            >
              <ChevronLeft size={20} />
            </button>
            <h5 className="font-neue text-lg font-semibold text-[#434449]">
              Yield Estimation
            </h5>
          </div>
          <div>
            <Button variant="primary" onClick={() => onRequestInformation()}>
              Request Information
            </Button>
          </div>
        </header>
        <section>
          <YieldEstimationHistoryTable />
        </section>
      </main>
      <RequestYieldEstimationSheetsContainer
        isOpen={showRequestYieldEstimationSheet}
        onClose={() => setShowRequestYieldEstimationSheet(false)}
      />
    </>
  );
};
