import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";

export const LongRunningProcessWarning: React.FC<{
  onClose: () => void;
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
  return (
    <section className="size-full overflow-y-auto">
      <header className="mb-10 flex items-start gap-3.5 pt-7 pr-20 pl-6">
        <button
          onClick={onClose}
          className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
        >
          <ChevronLeft size={24} className="text-[#434449]" />
        </button>
        <div>
          <h5 className="font-neue text-xl font-bold text-[#130B30]">
            Warning
          </h5>
        </div>
      </header>
      <div className="flex h-auto flex-col items-center justify-center pb-10 px-6">
        <div className="space-y-20">
          <p className="rounded-xl bg-[#D10000] px-2 py-1.5 text-white">
            Be warned, this is a long running process, and could take several
            minutes to complete.
            <br />
            Please note that for the duration of the process, you will not be
            able to use the application.
            <br />
            Please note that the process may be terminated if you close the
            browser.
            <br />
            Please be patient and do not close the browser.
            <br />
            Are you sure you want to proceed?
          </p>
          <Button variant="primary" onClick={() => onConfirm()}>
            Proceed
          </Button>
        </div>
      </div>
    </section>
  );
};
