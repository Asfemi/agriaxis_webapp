import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { SelectDropdown, type SelectOption } from "@/components/SelectDropdown";
import { useMemo } from "react";
import { NewFarmSchema, type NewFarmFormData } from "@/models/farm.model";
import { useLocations } from "@/api/locations";
import { useCreateFarm } from "@/api/farms";
import { toast } from "sonner";
import { useUserStore } from "@/stores/useUserStore";

const farm_size_options: SelectOption[] = [
  { label: "Acre", value: "acre", disabled: true },
  { label: "Hectare", value: "hectare" },
];

const crop_type_options: SelectOption[] = [
  { label: "Cocoa", value: "cocoa" },
  { label: "Rice", value: "rice" },
  { label: "Maize", value: "maize" },
  { label: "Beans", value: "beans" },
  { label: "Yam", value: "yam" },
  { label: "Cassava", value: "cassava" },
  { label: "Barley", value: "barley" },
  { label: "Quinoa", value: "quinoa" },
  { label: "Oats", value: "oats" },
  { label: "Millet", value: "millet" },
];

const AddNewFarmSheet: React.FC<{ onClose: () => void; isOpen: boolean }> = ({
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<NewFarmFormData>({
    resolver: zodResolver(NewFarmSchema),
    mode: "onChange",
  });

  const { data: locations } = useLocations();
  const { mutate, isPending } = useCreateFarm();
  // const { data: user } = useMe();
  const user = useUserStore((state) => state.user);

  const selectedStateName = watch("state");

  const state_options = useMemo(() => {
    return (
      locations?.map((loc) => ({
        label: loc.name,
        value: loc.name,
      })) || []
    );
  }, [locations]);

  const lga_options = useMemo(() => {
    if (!selectedStateName || !locations) return [];

    const stateMatch = locations.find((loc) => loc.name === selectedStateName);

    return stateMatch
      ? stateMatch.lgas.map((lga) => ({ label: lga, value: lga }))
      : [];
  }, [selectedStateName, locations]);

  const onSubmit = (data: NewFarmFormData) => {
    data.user_id = Number(user?.id);
    mutate(data, {
      onSuccess: () => {
        toast.success("Farm created successfully!");
        onClose();
      },
      onError: () => toast.error("Failed to create farm. Please try again."),
    });
  };

  return (
    <section
      className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity"
      onClick={onClose}
    >
      <section
        className="z-50 ml-auto h-full w-full overflow-y-auto rounded-[1.25rem] bg-white p-8 lg:w-[calc(100vw-19rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-8 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <h5 className="font-neue text-xl font-bold text-[#130B30]">
            Add new farm details
          </h5>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <section className="space-y-6">
              <header>
                <h6 className="text-lg font-semibold text-[#939397]">
                  Details
                </h6>
              </header>
              <div>
                <label
                  htmlFor="farm_name"
                  className="mb-1.5 text-sm text-[#130B30]"
                >
                  Farm name
                </label>
                <div className="rounded-lg bg-[#F3F6F8] p-3.5">
                  <input
                    {...register("name")}
                    id="farm_name"
                    type="text"
                    className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="Enter farm name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name?.message}
                  </p>
                )}
              </div>
              <div className="mb-1 flex items-center gap-2">
                <div className="grow">
                  <label
                    htmlFor="farm_size"
                    className="mb-1.5 text-sm text-[#130B30]"
                  >
                    Farm size
                  </label>
                  <div className="rounded-lg bg-[#F3F6F8] p-3.5">
                    <input
                      {...register("size_hectares", { valueAsNumber: true })}
                      id="farm_size"
                      type="number"
                      step="0.01"
                      className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                      placeholder="What is your farm size"
                    />
                  </div>
                </div>
                <div className="min-w-27">
                  <Controller
                    name="size_unit"
                    control={control}
                    render={({ field }) => (
                      <SelectDropdown
                        mode="single"
                        label="Farm size unit"
                        options={farm_size_options}
                        value={field.value || null}
                        onChange={(value) => field.onChange(value)}
                        placeholder="Select farm size"
                        headerTitle="Select farm size"
                      />
                    )}
                  />
                </div>
              </div>
              {errors.size_hectares && (
                <p className="inline text-xs text-red-600">
                  {errors.size_hectares?.message}
                </p>
              )}
              <div>
                <Controller
                  name="crop_type"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      mode="single"
                      label="Crop type"
                      options={crop_type_options}
                      placeholder="Select crop you have"
                      headerTitle="Select crops"
                      value={field.value || null}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                {errors.crop_type && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.crop_type?.message}
                  </p>
                )}
              </div>
            </section>
            <section className="space-y-6">
              <header>
                <h6 className="text-lg font-semibold text-[#939397]">
                  Farm address
                </h6>
              </header>
              <div>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      mode="single"
                      label="State"
                      options={state_options}
                      placeholder="Select state"
                      headerTitle="Select state"
                      value={field.value || null}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.state?.message}
                  </p>
                )}
              </div>
              <div>
                <Controller
                  name="lga"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      mode="single"
                      label="Local Government (LGA)"
                      options={lga_options}
                      placeholder="Select LGA"
                      headerTitle="Select LGA"
                      value={field.value || null}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                {errors.lga && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lga?.message}
                  </p>
                )}
              </div>
              <div className="mb-20">
                <label
                  htmlFor="address"
                  className="mb-1.5 text-sm text-[#130B30]"
                >
                  Address
                </label>
                <div className="rounded-lg bg-[#F3F6F8] p-3.5">
                  <input
                    id="address"
                    {...register("physical_address")}
                    type="text"
                    className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="Enter address"
                  />
                </div>
                {errors.physical_address && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.physical_address?.message}
                  </p>
                )}
              </div>
              <Button variant="primary" type="submit" disabled={isPending}>
                {isPending ? (
                  <LoaderCircle className="mx-auto animate-spin" />
                ) : (
                  <span>Add new farm</span>
                )}
              </Button>
            </section>
          </section>
        </form>
      </section>
    </section>
  );
};

export { AddNewFarmSheet };
