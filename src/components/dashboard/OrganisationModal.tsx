import OrganisationAddressForm from "@/components/auth/OrganisationAddressForm";
import { LoaderCircle } from "lucide-react";
import OrganisationProfileForm from "@/components/auth/OrganisationProfileForm";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useOrganisationStore } from "@/stores/useOrganisationStore";
import {
  useCreateOrganisationMutation,
  useEditOrganisationMutation,
} from "@/api/organisation";
import { toast } from "sonner";

export function OrganisationModal({
  onClose,
  requestType,
}: {
  onClose: () => void;
  requestType: "add" | "edit";
}) {
  const [step, setStep] = useState<"profile" | "address">("profile");
  const { formData, validateStep } = useOrganisationStore();
  const createOrganisation = useCreateOrganisationMutation();
  const editOrganisation = useEditOrganisationMutation();

  const handleContinue = async () => {
    if (step === "profile") {
      const isValid = validateStep([
        "organisation_name",
        "organisation_type",
        "registration_number",
        "number_of_farms_to_be_monitored",
      ]);

      if (isValid) {
        setStep("address");
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    } else {
      const isValid = validateStep([
        "state",
        "city",
        "local_government_area",
        "address",
      ]);

      if (isValid) {
        if (requestType === "add") {
          try {
            await createOrganisation.mutateAsync(formData);
            toast.success("Organisation created successfully!");
          } catch (error) {
            toast.error("Failed to create organisation. Please try again.");
          }
        } else {
          try {
            await editOrganisation.mutateAsync({
              id: formData.id ?? '',
              data: formData,
            });
            toast.success("Organisation updated successfully!");
          } catch (error) {
            toast.error("Failed to update organisation. Please try again.");
          }
        }
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    }
  };

  return (
    <section
      className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="z-50 flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="space-y-2">
          <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
            Organisation Profile
          </h5>
          <h6 className="text-[#423C59]">
            Fill in details to set up your organisation details
          </h6>
        </header>
        <section>
          {step === "profile" && <OrganisationProfileForm />}
          {step === "address" && <OrganisationAddressForm />}
        </section>
        <div className="flex gap-4">
          {step === "address" && (
            <Button
              variant="tertiary"
              onClick={() => setStep("profile")}
              disabled={createOrganisation.isPending}
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={createOrganisation.isPending}
            className="flex-1"
          >
            {createOrganisation.isPending ? (
              <LoaderCircle className="mx-auto animate-spin" />
            ) : step === "profile" ? (
              "Continue"
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
