import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useState } from "react";
import { toast } from "sonner";
import { CropHealthResultSheet } from "./CropHealthResultSheet";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useCropHealth } from "@/api/crop-monitoring";
import type { CropHealthHistory } from "@/models/crop-monitoring.model";
import { useUserStore } from "@/stores/useUserStore";
import { usePaymentInitialise, usePaymentVerify } from "@/api/payments";
import type { PaymentInitialiseResponse } from "@/models/payment.model";

export const RequestCropHealthSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const [result, setResult] = useState<CropHealthHistory>();
  const { formData } = useSoilTestingFormStore();
  const { mutate } = useCropHealth();
  const { user } = useUserStore();
  const { mutate: initialisePayment } = usePaymentInitialise();
  const { mutate: confirmPayment } = usePaymentVerify();

  const handleConfirm = () => {
    mutate(formData.farm_id ?? "", {
      onSuccess: (data) => {
        toast.success("Crop scanned successfully!");
        setResult(data);
        setCurrentView("result");
      },
    });
  };

  const handleSubmit = () => {
    const request = {
      farmId: formData.farm_id ?? "",
      amount: 15000,
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
        "https://web.agriaxis.org",
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
              toast.success("Initiating crop health check...");
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

  return (
    <>
      <section
        className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity"
        onClick={onClose}
      >
        <section
          className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <FarmDetailsCard
            isOpen={currentView === "details"}
            onClose={onClose}
            onConfirm={() => handleSubmit()}
            requestServiceType={"Crop Health"}
          />
        </section>
      </section>
      {currentView === "result" && (
        <CropHealthResultSheet data={result!} onClose={onClose} />
      )}
    </>
  );
};
