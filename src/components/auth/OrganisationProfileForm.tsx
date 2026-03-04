import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganisationSchema,
  type OrganisationFormData,
} from "@/models/organisation.model";
import { useEffect } from "react";
import { useOrganisationStore } from "@/stores/useOrganisationStore";
import { SelectDropdown } from "@/components/SelectDropdown";

export default function OrganisationProfileForm() {
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
        <label className="mb-0.5 text-sm text-[#130B30]">
          Organisation Name
        </label>
        <div className="rounded-lg bg-[#F3F6F8] p-4">
          <input
            type="text"
            {...register("organisation_name")}
            className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
            placeholder="Enter Organisation name"
          />
        </div>
        {(errors.organisation_name || storeErrors.organisation_name) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.organisation_name?.message || storeErrors.organisation_name}
          </p>
        )}
      </div>
      <div>
          <Controller
            name="organisation_type"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                mode="single"
                label="Organisation Type"
                options={[
                  { label: "Cooperative", value: "cooperative" },
                  { label: "Agric Business", value: "agribusiness" },
                  { label: "Financial Institution", value: "bank" },
                  { label: "Non Governmental Organisation", value: "ngo" },
                  { label: "Governmental Organisation", value: "go" },
                  { label: "others", value: "extension_service" }
                ]}
                placeholder="Select Organisation type"
                headerTitle="Select Organisation Type"
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
          {(errors.organisation_type || storeErrors.organisation_type) && (
            <p className="mt-1 text-xs text-red-600">
              {errors.organisation_type?.message ||
                storeErrors.organisation_type}
            </p>
          )}
      </div>
      <div>
        <label className="mb-0.5 text-sm text-[#130B30]">
          Registration number (CAC/RC number)
        </label>
        <div className="rounded-lg bg-[#F3F6F8] p-4">
          <input
            type="text"
            {...register("registration_number")}
            className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
            placeholder="Enter RC number"
          />
        </div>
        {(errors.registration_number || storeErrors.registration_number) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.registration_number?.message ||
              storeErrors.registration_number}
          </p>
        )}
      </div>
      <div>
        <label className="mb-0.5 text-sm text-[#130B30]">
          Number of farms to be monitored
        </label>
        <div className="rounded-lg bg-[#F3F6F8] p-4">
          <input
            type="number"
            {...register("number_of_farms_to_be_monitored", {
              valueAsNumber: true,
            })}
            className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
            placeholder="Enter number of farms"
          />
        </div>
        {(errors.number_of_farms_to_be_monitored ||
          storeErrors.number_of_farms_to_be_monitored) && (
          <p className="mt-1 text-xs text-red-600">
            {errors.number_of_farms_to_be_monitored?.message ||
              storeErrors.number_of_farms_to_be_monitored}
          </p>
        )}
      </div>
    </div>
  );
}
