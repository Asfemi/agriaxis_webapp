import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useState } from "react";
import { toast } from "sonner";
import { CropHealthResultSheet } from "@/components/crop-monitoring/CropHealthResultSheet";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useCropHealth } from "@/api/crop-monitoring";
import type { CropHealthHistory } from "@/models/crop-monitoring.model";
import { useUserStore } from "@/stores/useUserStore";
import { useMpesaPaymentInitialise, usePaymentInitialise, usePaymentVerify } from "@/api/payments";
import type { MpesaPaymentInitialiseResponse, PaymentInitialiseResponse } from "@/models/payment.model";
import { MeasurementCostCard } from "@/components/shared/MeasurementCostCard";
import { LongRunningProcessWarning } from "@/components/crop-monitoring/LongRunningProcessWarning";

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
  const { mutate: initialiseMpesaPayment } = useMpesaPaymentInitialise();
  const { mutate: confirmPayment } = usePaymentVerify();
  const [measurementCost, setMeasurementCost] = useState<{
    amount: number;
    currency: string;
  }>();

  const handleConfirm = () => {
    mutate(formData.farm_id ?? "", {
      onSuccess: (data) => {
        toast.success("Crop scanned successfully!");
        setResult(data);
        setCurrentView("result");
      },
    });
  };

  const handleProceedFromCost = (cost: {
    amount: number;
    currency: string;
  }) => {
    setMeasurementCost(cost);
    setCurrentView("warning");
  };

  const handleSubmit = () => {
    const request = {
      farmId: formData.farm_id ?? "",
      amount: measurementCost?.amount ?? 0,
      currency: measurementCost?.currency ?? "",
      customer: {
        email: user?.email ?? "",
        name: user?.name ?? "",
        phonenumber: user?.phone ?? "",
      },
    };

    if (request.currency !== "KES") {
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
    } else {
      initialiseMpesaPayment(request, {
        onSuccess: (data) => {
          toast.success("Initiation successful. Please check your phone!");
          pollValidation(data)
        },
        onError: (error) => {
          toast.error(
            error.message ??
              "Faild to initiate Mpesa payment. Please try again.",
          );
        },
      });
    }
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

  const pollValidation = (paymentData: MpesaPaymentInitialiseResponse) => {
    const { tx_ref, amount, currency, farm_id, transaction_id } = paymentData;
    const validate = setInterval(() => {
        confirmPayment(
          {
            farmId: farm_id,
            amount,
            currency,
            txRef: tx_ref,
            transactionId: String(transaction_id) ?? "",
            status: status ?? "",
            success: status === "successful" || status === "completed",
          },
          {
            onSuccess: () => {
              toast.success("Payment confirmed successfully!");
              toast.success("Initiating crop health check...");
              clearInterval(validate)
              handleConfirm();
            },
            onError: (error) => {
              toast.error(error.message);
              toast.error("Failed to confirm payment. Please try again!");
            },
          },
        );
    }, 5e3);
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
            onConfirm={() => setCurrentView("cost")}
            requestServiceType={"Crop Health"}
          />
          <MeasurementCostCard
            service="crop-health"
            isOpen={currentView === "cost"}
            onClose={() => setCurrentView("details")}
            onConfirm={(cost) => handleProceedFromCost(cost)}
          />
          {currentView === "warning" && (
            <LongRunningProcessWarning
              onClose={onClose}
              onConfirm={() => handleSubmit()}
            />
          )}
        </section>
      </section>
      {currentView === "result" && (
        <CropHealthResultSheet data={result!} onClose={onClose} />
      )}
    </>
  );
};
