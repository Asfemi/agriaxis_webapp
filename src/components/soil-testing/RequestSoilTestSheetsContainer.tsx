import { usePaymentInitialise, usePaymentVerify } from "@/api/payments";
import { useSoilTestingRun, useSoilTestingUpload } from "@/api/soil-testing";
import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { FarmSizeForMeasurementCard } from "@/components/soil-testing/FarmSizeForMeasurementCard";
import { SoilTestResultsCard } from "@/components/soil-testing/SoilTestResultsCard";
import type { PaymentInitialiseResponse } from "@/models/payment.model";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useSoilTestingResultStore } from "@/stores/useSoilTestingResultStore";
import { useUserStore } from "@/stores/useUserStore";
import { useState } from "react";
import { toast } from "sonner";

const RequestSoilTestSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { formData } = useSoilTestingFormStore();
  const { user } = useUserStore();
  const { mutate: initialisePayment } = usePaymentInitialise();
  const { mutate: confirmPayment } = usePaymentVerify();
  const { mutate: uploadSoilTest } = useSoilTestingUpload();
  const { mutate: runSoilTest } = useSoilTestingRun();
  const { setResult } = useSoilTestingResultStore();

  const [currentView, setCurrentView] = useState("details");

  const handleSubmit = () => {
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
        toast.error(error.message ?? "Failed to initiate payment. Please try again."),
    });
  };

  const openPaymentModal = (
    paymentData: PaymentInitialiseResponse,
  ) => {
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
              uploadSoilTest(
                { farmId: farm_id },
                {
                  onSuccess: () => {
                    toast.success("Soil test uploaded successfully!");
                    runSoilTest(
                      {
                        farmId: farm_id,
                        crop: formData.crop ?? "",
                        depth: "0-20",
                      },
                      {
                        onSuccess: (data) => {
                          setResult(data);
                          toast.success("Soil test run successfully!");
                          setCurrentView("result");
                        },
                        onError: (error) => {
                          toast.error(error.message);
                          toast.error(
                            "Failed to run soil test. Please try again!",
                          );
                        },
                      },
                    );
                  },
                  onError: (error) => {
                    toast.error(error.message);
                    toast.error("Failed to run soil test. Please try again!");
                  },
                },
              );
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
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
        <FarmDetailsCard
          isOpen={currentView === "details"}
          onClose={onClose}
          onConfirm={() => setCurrentView("size")}
        />
        <FarmSizeForMeasurementCard
          isOpen={currentView === "size"}
          onClose={() => setCurrentView("details")}
          onConfirm={() => handleSubmit()}
        />
        <SoilTestResultsCard
          isOpen={currentView === "result"}
          onClose={() => setCurrentView("measurement_method")}
        />
      </section>
    </section>
  );
};

export { RequestSoilTestSheetsContainer };
