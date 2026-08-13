import {
  useMpesaPaymentInitialise,
  usePaymentInitialise,
  usePaymentVerify,
} from "@/api/payments";
import { useSoilTestingRun, useSoilTestingUpload } from "@/api/soil-testing";
import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { FarmSizeForMeasurementCard } from "@/components/soil-testing/FarmSizeForMeasurementCard";
import { SoilTestResultsCard } from "@/components/soil-testing/SoilTestResultsCard";
import type {
  MpesaPaymentInitialiseResponse,
  PaymentInitialiseResponse,
} from "@/models/payment.model";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useSoilTestingResultStore } from "@/stores/useSoilTestingResultStore";
import { useUserStore } from "@/stores/useUserStore";
import { useState } from "react";
import { toast } from "sonner";
import { EnterMpesaPhoneNumberModal } from "@/components/shared/EnterMpesaPhoneNumberModal.tsx";

const RequestSoilTestSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { formData } = useSoilTestingFormStore();
  const { user } = useUserStore();
  const { mutate: initialisePayment } = usePaymentInitialise();
  const { mutate: initialiseMpesaPayment } = useMpesaPaymentInitialise();
  const { mutate: confirmPayment } = usePaymentVerify();
  const { mutate: uploadSoilTest } = useSoilTestingUpload();
  const { mutate: runSoilTest } = useSoilTestingRun();
  const { setResult } = useSoilTestingResultStore();

  const [currentView, setCurrentView] = useState("details");
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");

  const handleSubmit = () => {
    const request = {
      farmId: formData.farm_id ?? "",
      amount: formData.cost ?? 0,
      currency: formData.currency ?? "NGN",
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
      initMpesaPreValidation();
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
            clearInterval(validate);
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
    }, 5e3);
  };

  const executeMpesaPayment = (phoneNumber: string) => {
    const request = {
      farmId: formData.farm_id ?? "",
      amount: formData.cost ?? 0,
      currency: formData.currency ?? "KES",
      customer: {
        email: user?.email ?? "",
        name: user?.name ?? "",
        phonenumber: phoneNumber,
      },
    };

    initialiseMpesaPayment(request, {
      onSuccess: (data) => {
        toast.success("Initiation successful. Please check your phone!");
        pollValidation(data);
      },
      onError: (error) => {
        toast.error(
          error.message ??
            "Failed to initiate Mpesa payment. Please try again.",
        );
      },
    });
  };

  const initMpesaPreValidation = () => {
    const activePhone = user?.phone || userPhoneNumber

    if (!activePhone) {
      setShowPhoneNumberModal(true)
      return;
    }

    executeMpesaPayment(activePhone)
  };

  const confirmPhoneNumber = (data: { phone: string }) => {
    setUserPhoneNumber(data.phone);
    setShowPhoneNumberModal(false);
    executeMpesaPayment(data.phone)
  };

  return (
    <>
      <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
        <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
          <FarmDetailsCard
            isOpen={currentView === "details"}
            onClose={onClose}
            onConfirm={() => setCurrentView("size")}
            requestServiceType="soil test"
          />
          <FarmSizeForMeasurementCard
            isOpen={currentView === "size"}
            onClose={() => setCurrentView("details")}
            onConfirm={() => handleSubmit()}
          />
          {currentView === "result" && (
            <SoilTestResultsCard
              onClose={() => setCurrentView("measurement_method")}
            />
          )}
        </section>
      </section>
      <EnterMpesaPhoneNumberModal
        isOpen={showPhoneNumberModal}
        onClose={() => setShowPhoneNumberModal(false)}
        onConfirm={confirmPhoneNumber}
      />
    </>
  );
};

export { RequestSoilTestSheetsContainer };
