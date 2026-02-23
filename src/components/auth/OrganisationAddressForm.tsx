import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganisationSchema,
  type OrganisationFormData,
} from "@/models/organisation.model";
import { useEffect } from "react";
import { useOrganisationStore } from "@/stores/useOrganisationStore";
import { SelectDropdown, type SelectOption } from "@/components/SelectDropdown";

const state_options: SelectOption[] = [
  { label: "Abuja", value: "abuja" },
  { label: "Lagos", value: "lagos" },
  { label: "Kaduna", value: "kaduna" },
  { label: "Sokoto", value: "sokoto" },
];

const city_options: SelectOption[] = [
  { label: "Aba", value: "aba" },
  { label: "Abeokuta", value: "abeokuta" },
  { label: "Ado-Ekiti", value: "ado-ekiti" },
  { label: "Akoko", value: "akoko" },
  { label: "Akure", value: "akure" },
  { label: "Amuwo-Odofin", value: "amuwo-odofin" },
  { label: "Enugu", value: "enugu" },
];

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
