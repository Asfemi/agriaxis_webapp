import OrganisationAddressForm from "@/components/auth/OrganisationAddressForm";
import { LoaderCircle } from "lucide-react";
import OrganisationProfileForm from "@/components/auth/OrganisationProfileForm";
import { Button } from "@/components/Button";
import { createRoute, redirect, type AnyRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useOrganisationStore } from "@/stores/useOrganisationStore";
import { useCreateOrganisationMutation } from "@/api/organisation";
import { toast } from "sonner";
import fullLogo from "/assets/icons/full-logo.svg";
import { getOrgId } from "@/lib/utils";

function Organisation() {
  const [step, setStep] = useState<"profile" | "address">("profile");
  const { formData, validateStep } = useOrganisationStore();
  const { mutate: createOrganisation, isPending } = useCreateOrganisationMutation();

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
        createOrganisation(formData, {
          onSuccess: () => {
            toast.success("Organisation created successfully!");
            window.location.href = "/dashboard";
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
          }
        })
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    }
  };

  return (
    <div className="flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-16">
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
            disabled={isPending}
          >
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? (
            <LoaderCircle className="mx-auto animate-spin" />
          ) : step === "profile" ? (
            "Continue"
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}

function OrganisationLayout() {
  return (
    <main className="relative grid h-screen w-screen place-items-center bg-[#E7F2ED]">
      <img src={fullLogo} width={183} height={49} className="absolute top-20 left-20" />
      <div className="z-5">
        <Organisation />
      </div>
    </main>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "organisation",
    component: OrganisationLayout,
    getParentRoute: () => parentRoute,
    beforeLoad: () => {
      const orgId = getOrgId();
      if (orgId) {
        throw redirect({ to: "/signin" });
      }
    }
  });
