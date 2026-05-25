import { ChevronLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { type SoilTestingFormData } from "@/models/soil-testing.model";
import { Suspense, useEffect } from "react";
import { useGetFarm } from "@/api/farms";
import { useGetCost } from "@/api/payments";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

export const FarmSizeForMeasurementCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const { formData, updateFormData } = useSoilTestingFormStore();

  const { data: farmData } = useGetFarm(formData.farm_id ?? "");
  const { data: initialCost } = useGetCost("soil-testing", 1);
  const { data: cost, isLoading: isLoadingCost } = useGetCost(
    "soil-testing",
    Number(farmData.size.split(" hectares")[0]),
  );

  const onSubmit = (data: SoilTestingFormData) => {
    updateFormData({ ...data, cost: cost?.amount ?? 0, currency: cost?.currency });
    onConfirm();
  };

  useEffect(() => {
    if (cost?.amount) {
      updateFormData({ cost: cost.amount });
    }
  }, [cost, updateFormData]);

  return (
    <ErrorBoundary
      fallbackRender={(fallbackProps) => (
        <FarmErrorFallback {...fallbackProps} onClose={onClose} />
      )}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <section className="size-full overflow-y-auto">
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
                    Farm details
                  </h5>
                  <h6 className="text-[#423C59]">
                    Calculating the cost based on your farm size
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
                      <p className="font-medium text-[#100A37]">
                        {initialCost?.amount ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-[#F3F6F8] px-4 py-6">
                  <div className="mb-4 flex w-full items-center justify-between">
                    <p className="text-sm text-[#615C74]">Total price</p>
                    <p className="font-medium text-[#615C74]">
                      {isLoadingCost ? (
                        <span>
                          <LoaderCircle className="animate-spin" />
                        </span>
                      ) : (
                        <>{cost?.amount ?? 0}</>
                      )}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm text-[#615C74]">Hectare/s</p>
                    <p className="font-medium text-[#615C74]">
                      {farmData.size.split(" hectares")[0]}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mx-20">
              <Button
                type="button"
                variant="primary"
                onClick={() => onSubmit(formData)}
              >
                Proceed
              </Button>
            </div>
          </div>
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};

interface FarmErrorFallbackProps extends FallbackProps {
  onClose: () => void;
}

function FarmErrorFallback({ error, onClose }: FarmErrorFallbackProps) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 bg-white">
      <h1 className="text-xl font-semibold text-red-500">
        Something went wrong. Failed to fetch farm
      </h1>
      <p className="text-sm text-gray-500">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
      <button
        className="bg-primary rounded px-4 py-2 text-white"
        onClick={onClose}
      >
        Go back
      </button>
    </div>
  );
}
