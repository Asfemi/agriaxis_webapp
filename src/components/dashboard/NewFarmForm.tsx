import { Controller, useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { SelectDropdown } from "@/components/SelectDropdown";
import { useEffect, useMemo, useState } from "react";
import { useLocations } from "@/api/locations";
import { NewFarmSchema, type NewFarmFormData } from "@/models/farm.model";
import { type SelectOption } from "@/components/SelectDropdown";

const farm_size_options: SelectOption[] = [
  { label: "Acres", value: "acres" },
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
  { label: "Others", value: "others" },
];

export const NewFarmForm: React.FC<{
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
      crop_type: [],
    },
  });

  const selectedStateName = watch("state");
  const selectedCropType = watch("crop_type");
  const selectedCountry = watch("country");
  const [countryValue, setCountryValue] = useState("nigeria");

  const { data: locations } = useLocations(countryValue);

  useEffect(() => {
    if (selectedCountry) setCountryValue(selectedCountry);
  }, [selectedCountry]);

  const country_options = [
    { label: "Nigeria", value: "nigeria" },
    { label: "Ghana", value: "ghana" },
    { label: "Kenya", value: "kenya" },
    { label: "Ethiopia", value: "ethiopia" },
    { label: "Tanzania", value: "tanzania" },
    { label: "Uganda", value: "uganda" },
    { label: "Rwanda", value: "rwanda" },
    { label: "South Africa", value: "south_africa" },
    { label: "Cote D'Ivoire", value: "cote_d_ivoire" },
  ];

  const state_options = useMemo(() => {
    return (
      locations?.map((loc) => ({
        label: loc.name,
        value: loc.name,
      })) || []
    );
  }, [locations]);

  // const lga_options = useMemo(() => {
  //   if (!selectedStateName || !locations) return [];
  //
  //   const stateMatch = locations.find((loc) => loc.name === selectedStateName);
  //
  //   return stateMatch
  //     ? stateMatch.lgas.map((lga) => ({ label: lga, value: lga }))
  //     : [];
  // }, [selectedStateName, locations]);

  const city_options = useMemo(() => {
    if (!selectedStateName || !locations) return [];

    const stateMatch = locations.find((loc) => loc.name === selectedStateName);
    return stateMatch
      ? stateMatch.cities.map((city) => ({ label: city, value: city }))
      : [];
  }, [selectedStateName, locations]);

  const showOthers = selectedCropType?.includes("others");
  const otherCropType = showOthers ? watch("other_crop_type") : undefined;

  const onSubmit = (data: NewFarmFormData) => {
    const formattedData = {
      ...data,
      farm_size:
        data.size_number && data.size_unit
          ? `${data.size_number} ${data.size_unit}`
          : undefined,
      crop_type: [
        ...(data.crop_type || []),
        ...(showOthers ? [otherCropType as string] : []),
      ],
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
            <div>
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
                      {...register("size_number", {
                        setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
                      })}
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
              {errors.size_number && (
                <p className="inline text-xs text-red-600">
                  {errors.size_number?.message}
                </p>
              )}
            </div>
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
            {showOthers && (
              <div>
                <label
                  htmlFor="farm_size"
                  className="mb-1.5 text-sm text-[#130B30]"
                >
                  Other crop type
                </label>
                <div className="rounded-lg bg-[#F3F6F8] p-3.5">
                  <input
                    {...register("other_crop_type")}
                    id="other_crop_type"
                    type="text"
                    className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="What is your crop type"
                  />
                </div>
              </div>
            )}
          </section>
          <section className="space-y-6">
            <header>
              <h6 className="text-lg font-semibold text-[#939397]">
                Farm address
              </h6>
            </header>
            <div>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    mode="single"
                    label="Country"
                    options={country_options}
                    placeholder="Select country"
                    headerTitle="Select country"
                    value={field.value || null}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.country && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.country?.message}
                </p>
              )}
            </div>
            <div>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <SelectDropdown
                    mode="single"
                    label="State/Province"
                    options={state_options}
                    placeholder="Select state/province"
                    headerTitle="Select state/province"
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
            {/**
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
             */}
            {countryValue === "nigeria" && (
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
            )}
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
