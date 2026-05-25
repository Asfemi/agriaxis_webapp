import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganisationSchema,
  type OrganisationFormData,
} from "@/models/organisation.model";
import { useEffect, useMemo, useState } from "react";
import { useOrganisationStore } from "@/stores/useOrganisationStore";
import { SelectDropdown } from "@/components/SelectDropdown";
import { useLocations } from "@/api/locations";

export default function OrganisationAddressForm() {
  const {
    formData,
    updateFormData,
    errors: storeErrors,
  } = useOrganisationStore();

  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useForm<OrganisationFormData>({
    resolver: zodResolver(OrganisationSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  const selectedStateName = watch("state");
  const selectedCountry = watch("country");
  const [countryValue, setCountryValue] = useState("nigeria");

  const { data: locations } = useLocations(countryValue);

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

  useEffect(() => {
    if (selectedCountry) setCountryValue(selectedCountry);
  }, [selectedCountry]);

  const state_options = useMemo(() => {
    return (
      locations?.map((loc) => ({
        label: loc.name,
        value: loc.name,
      })) || []
    );
  }, [locations]);

  const city_options = useMemo(() => {
    if (!selectedStateName || !locations) return [];

    const stateMatch = locations.find((loc) => loc.name === selectedStateName);

    return stateMatch
      ? stateMatch.cities.map((city) => ({ label: city, value: city }))
      : [];
  }, [selectedStateName, locations]);


  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value as Partial<OrganisationFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  return (
    <div className="w-full space-y-6">
      <div>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <SelectDropdown
              mode="single"
              label="Country"
              options={country_options}
              placeholder="Select Organisation Country"
              headerTitle="Select Organisation Country"
              value={field.value || null}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {(errors.country || storeErrors.country) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.country?.message || storeErrors.country}
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
              label="State"
              options={state_options}
              placeholder="Select Organisation State"
              headerTitle="Select Organisation State"
              value={field.value || null}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {(errors.state || storeErrors.state) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.state?.message || storeErrors.state}
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
              placeholder="Select Organisation City"
              headerTitle="Select Organisation City"
              value={field.value || null}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {(errors.city || storeErrors.city) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.city?.message || storeErrors.city}
          </p>
        )}
      </div>
      <div>
        <label className="mb-0.5 text-sm text-[#130B30]">
          Local Government Area (LGA)
        </label>
        <div className="rounded-lg bg-[#F3F6F8] p-4">
          <input
            type="text"
            {...register("local_government_area")}
            className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
            placeholder="Enter Organisation LGA"
          />
        </div>
      </div>
      <div>
        <label className="mb-0.5 text-sm text-[#130B30]">Address</label>
        <div className="rounded-lg bg-[#F3F6F8] p-4">
          <input
            type="text"
            {...register("address")}
            className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
            placeholder="Enter Organisation address"
          />
        </div>
      </div>
    </div>
  );
}

// TODO: Update to use real location data from locations endpoint
