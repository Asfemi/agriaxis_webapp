import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { useSoilTestingCost } from "@/api/soil-testing";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useForm } from "react-hook-form";
import {
  SoilTestingSchema,
  type SoilTestingFormData,
} from "@/models/soil-testing.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export const FarmSizeForMeasurementCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const {
    formData,
    updateFormData,
    errors: storeErrors,
  } = useSoilTestingFormStore();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<SoilTestingFormData>({
    resolver: zodResolver(SoilTestingSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value as Partial<SoilTestingFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  const { data: cost } = useSoilTestingCost(Number(formData.depth));

  const onSubmit = (data: SoilTestingFormData) => {
    updateFormData({ ...data, cost: cost?.amount ?? 0 });
    onConfirm();
  };

  return (
    <section className="size-full overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                    <p className="font-medium text-[#100A37]">
                      {formData.depth!.length > 0 ? formData.depth : 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#615C74]">Unit</p>
                    <p className="font-medium text-[#100A37]">Hectare</p>
                  </div>

                  <div>
                    <p className="text-[#615C74]">Price</p>
                    <p className="font-medium text-[#100A37]">
                      ₦{cost?.amount ?? 0}
                    </p>
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
                      {...register("depth")}
                      type="number"
                      className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                      placeholder="What is your farm size in hectares"
                    />
                  </div>
                  {(errors.depth || storeErrors.depth) && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.depth?.message || storeErrors.depth}
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-[#F3F6F8] px-4 py-6">
                <div className="mb-4 flex w-full items-center justify-between">
                  <p className="text-sm text-[#615C74]">Total price</p>
                  {formData.depth && cost?.amount}
                  <p className="font-medium text-[#615C74]">
                    ₦{cost?.amount ?? 0}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm text-[#615C74]">Hectare/s</p>
                  <p className="font-medium text-[#615C74]">0</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mx-20">
            <Button type="submit" disabled={!formData.depth} variant="primary">
              Proceed to measure
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};
