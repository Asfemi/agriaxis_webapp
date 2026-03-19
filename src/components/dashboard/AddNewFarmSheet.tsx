import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { SelectDropdown, type SelectOption } from "@/components/SelectDropdown";
import { useMemo, useState } from "react";
import { NewFarmSchema, type NewFarmFormData } from "@/models/farm.model";
import { useLocations } from "@/api/locations";
import { useCreateFarm } from "@/api/farms";
import { toast } from "sonner";
import { LeafletMapMeasurementCard } from "@/components/shared/LeafletMapMeasurementCard";
import { ManualMapMeasurementCard } from "@/components/shared/ManualMapMeasurementCard";

const farm_size_options: SelectOption[] = [
  { label: "Acres", value: "acres", disabled: true },
  { label: "Hectares", value: "hectares" },
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

const NewFarmForm: React.FC<{
  onClose: () => void;
  onConfirm: (data: NewFarmFormData) => void;
}> = ({ onClose, onConfirm }) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<NewFarmFormData>({
    resolver: zodResolver(NewFarmSchema),
    mode: "onChange",
    defaultValues: {
      crop_type: []
    }
  });

  const { data: locations } = useLocations();

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

  const city_options = useMemo(() => {
    if (!selectedStateName || !locations) return [];

    const stateMatch = locations.find((loc) => loc.name === selectedStateName);
    return stateMatch
      ? stateMatch.cities.map((city) => ({ label: city, value: city }))
      : [];
  }, [selectedStateName, locations]);

  const onSubmit = (data: NewFarmFormData) => {
    const formattedData = {
      ...data,
      farm_size:
        data.size_hectares && data.size_unit
          ? `${data.size_hectares} ${data.size_unit}`
          : undefined,
    };
    onConfirm(formattedData);
  };

  return (
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
              <h6 className="text-lg font-semibold text-[#939397]">Details</h6>
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
                  {...register("farm_name")}
                  id="farm_name"
                  type="text"
                  className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Enter farm name"
                />
              </div>
              {errors.farm_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.farm_name?.message}
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
                      placeholder="Select unit"
                      headerTitle="Select unit"
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
                    mode="multiple"
                    label="Crop type"
                    options={crop_type_options}
                    placeholder="Select crop you have"
                    headerTitle="Select crops"
                    value={field.value ?? []}
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
            <div>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    mode="single"
                    label="City"
                    options={city_options}
                    placeholder="Select city"
                    headerTitle="Select city"
                    value={field.value || null}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.city?.message}
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
                  {...register("address")}
                  type="text"
                  className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Enter address"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.address?.message}
                </p>
              )}
            </div>
            <Button variant="primary" type="submit">
              Add coordinates
            </Button>
          </section>
        </section>
      </form>
    </section>
  );
};

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
