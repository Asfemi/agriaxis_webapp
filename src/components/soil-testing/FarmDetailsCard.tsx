import { ChevronLeft } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { RadioButton } from "@/components/RadioButton";
import { useEffect, useState } from "react";
import { SelectDropdown, type SelectOption } from "@/components/SelectDropdown";
import { useGetAllFarms } from "@/api/farms";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import {
  SoilTestingSchema,
  type SoilTestingFormData,
} from "@/models/soil-testing.model";

const CROP_TYPE_OPTIONS: { id: number; title: string }[] = [
  {
    id: 1,
    title: "cocoa",
  },
  {
    id: 2,
    title: "rice",
  },
  {
    id: 3,
    title: "maize",
  },
  {
    id: 4,
    title: "beans",
  },
  {
    id: 5,
    title: "yam",
  },
  {
    id: 6,
    title: "cassava",
  },
  {
    id: 7,
    title: "barley",
  },
  {
    id: 8,
    title: "quinoa",
  },
  {
    id: 10,
    title: "oats",
  },
  {
    id: 11,
    title: "millet",
  },
];

const FarmDetailsCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requestServiceType?: string;
}> = ({ isOpen, onClose, onConfirm, requestServiceType }) => {
  if (!isOpen) return null;
  const [farm_options, setFarmOptions] = useState<SelectOption[]>([]);
  const { data: farms, isPending, isError } = useGetAllFarms();
  const {
    formData,
    updateFormData,
    errors: storeErrors,
  } = useSoilTestingFormStore();

  const {
    register,
    control,
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

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (isError) {
      return;
    }

    const farmsData = farms?.list_of_farm;
    const options = farmsData?.map((farm) => ({
      label: farm.farm_name,
      value: farm.id,
    }));
    setFarmOptions(options);
  }, [farms, isPending, isError]);

  const onSubmit = (data: SoilTestingFormData) => {
    updateFormData(data);
    onConfirm();
  };

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
            Farm details
          </h5>
          <h6 className="text-[#423C59]">
            Let's know the farm and crop type you are requesting{" "}
            {requestServiceType ?? "soil test"} for
          </h6>
        </div>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="mx-20 space-y-6 pb-10">
          <header>
            <h6 className="text-lg font-semibold text-[#939397]">Details</h6>
          </header>
          <div>
            <Controller
              name="farm_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  mode="single"
                  label="Farm name"
                  options={farm_options}
                  placeholder="Select your farm"
                  headerTitle="Select farm"
                  value={field.value || null}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            {(errors.farm_id || storeErrors.farm_id) && (
              <p className="mt-1 text-xs text-red-600">
                {errors.farm_id?.message || storeErrors.farm_id}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 text-sm text-[#130B30]">Crop type</label>
            <div className="grid grid-cols-2 gap-2">
              {CROP_TYPE_OPTIONS.map((entry) => (
                <Controller
                  key={entry.id}
                  name="crop"
                  control={control}
                  render={({ field }) => (
                    <RadioButton
                      title={entry.title}
                      isSelected={
                        field.value?.toLowerCase() === entry.title.toLowerCase()
                      }
                      select={() => field.onChange(entry.title)}
                    />
                  )}
                />
              ))}
            </div>
            {(errors.crop || storeErrors.crop) && (
              <p className="mt-1 text-xs text-red-600">
                {errors.crop?.message || storeErrors.crop}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="others" className="mb-1.5 text-sm text-[#130B30]">
              Other crops
            </label>
            <div className="rounded-lg bg-[#F3F6F8] p-3.5">
              <input
                type="text"
                id="others"
                {...register("crop", {
                  onChange: (e) => {
                    e.target.value = e.target.value.toLowerCase();
                  },
                })}
                className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                placeholder="Enter more crop type"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={!formData.farm_id || !formData.crop}
            variant="primary"
          >
            Add new farm
          </Button>
        </section>
      </form>
    </section>
  );
};

export { FarmDetailsCard };
