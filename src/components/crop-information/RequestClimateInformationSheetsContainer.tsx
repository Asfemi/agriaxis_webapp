import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useState } from "react";
import { toast } from "sonner";
import type { ClimateAnalysisData } from "@/models/crop-information.model";
import { useFetchClimateAnalysis } from "@/api/crop-information";
import { ClimateInformationSheet } from "@/components/crop-information/ClimateInformationSheet";
import { usePaymentInitialise, usePaymentVerify } from "@/api/payments";
import { useUserStore } from "@/stores/useUserStore";
import type { PaymentInitialiseResponse } from "@/models/payment.model";

export const RequestClimateInformationSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { formData } = useSoilTestingFormStore();
  const { user } = useUserStore();

  const [currentView, setCurrentView] = useState("details");
  const [analysisData, setAnalysisData] = useState<ClimateAnalysisData>();

  const { mutate: fetchClimateAnalysis } = useFetchClimateAnalysis();
  const { mutate: initialisePayment } = usePaymentInitialise();
  const { mutate: confirmPayment } = usePaymentVerify();

  const handleProceedToPayment = () => {
    const request = {
      farmId: formData.farm_id ?? "",
      amount: formData.cost ?? 0,
      currency: "NGN",
      customer: {
        email: user?.email ?? "",
        name: user?.name ?? "",
        phonenumber: user?.phone ?? "",
      },
    };

    initialisePayment(request, {
      onSuccess: (data) => {
        toast.success("Payment initiated successfully!");

        openPaymentModal(data);
      },
      onError: (error) =>
        toast.error(
          error.message ?? "Failed to initiate payment. Please try again.",
        ),
    });
  };

  const openPaymentModal = (paymentData: PaymentInitialiseResponse) => {
    const { payment_link, tx_ref, amount, currency, farm_id } = paymentData;

    const popup = window.open(
      payment_link,
      "flutterwave_payment",
      "width=800,height=600,scrollbars=yes,resizable=yes,left=200,top=100",
    );

    if (!popup) {
      toast.error("Popup blocked! Please allow popups and try again.");
      return;
    }

    let messageReceived = false;

    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        window.location.origin,
        "https://agriaxis-webapp.vercel.app",
      ];

      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data?.type === "PAYMENT_COMPLETE") {
        messageReceived = true;

        const { status, transactionId } = event.data;
        confirmPayment(
          {
            farmId: farm_id,
            amount,
            currency,
            txRef: tx_ref,
            transactionId: String(transactionId) ?? "",
            status: status ?? "",
            success: status === "successful" || status === "completed",
          },
          {
            onSuccess: () => {
              toast.success("Payment confirmed successfully!");
              handleConfirm();
            },
            onError: (error) => {
              toast.error(error.message);
              toast.error("Failed to confirm payment. Please try again!");
            },
          },
        );

        cleanup();
      }
    };

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        if (!messageReceived) {
          setTimeout(() => {
            if (!messageReceived) cleanup();
          }, 500);
        } else {
          cleanup();
        }
      }
    }, 1000);

    const cleanup = () => {
      clearInterval(checkClosed);
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  const handleConfirm = () => {
    if (!formData.farm_id) {
      toast.error("Please select a farm first!");
      return;
    }
    fetchClimateAnalysis(formData.farm_id, {
      onSuccess: (data) => {
        toast.success("Climate analysis data fetched successfully!");
        setAnalysisData(data);
        setCurrentView("result");
      },
    });
  };

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
        <FarmDetailsCard
          isOpen={currentView === "details"}
          onClose={onClose}
          onConfirm={handleProceedToPayment}
        />
        {currentView === "result" && (
          <ClimateInformationSheet
            onClose={onClose}
            analysisData={analysisData}
          />
        )}
      </section>
    </section>
  );
};
