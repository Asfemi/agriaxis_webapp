import { FarmDetailsCard } from "@/components/soil-testing/FarmDetailsCard";
import { useState } from "react";
import { CropImageCard } from "@/components/crop-monitoring/CropImageCard";
import { toast } from "sonner";
import { ProcessingResultCard } from "@/components/crop-monitoring/ProcessingResultCard";
import { useCropMonitoringDiseaseDetect } from "@/api/crop-monitoring";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { faker } from "@faker-js/faker";
import { MeasurementCostCard } from "@/components/shared/MeasurementCostCard";
import { useUserStore } from "@/stores/useUserStore";
import { usePaymentInitialise, usePaymentVerify } from "@/api/payments";
import type { PaymentInitialiseResponse } from "@/models/payment.model";

export const RequestPestMonitoringSheetsContainer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [currentView, setCurrentView] = useState("details");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { formData } = useSoilTestingFormStore();
  const { mutate } = useCropMonitoringDiseaseDetect();
  const { user } = useUserStore();
  const { mutate: initialisePayment } = usePaymentInitialise();
  const { mutate: confirmPayment } = usePaymentVerify();

  const handleUploadImage = (image: File) => {
    setImageFile(image);
    // setCurrentView("cost");
    setTimeout(() => {
      handleConfirm()
    }, 4e2)
  };

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

  const handleConfirm = () => {
    if (!imageFile) {
      toast.error("Please upload an image first!");
      return;
    }
    mutate(
      {
        name: `F/${faker.string.alphanumeric(5).toUpperCase()}`,
        image: imageFile,
        farmId: formData.farm_id ?? "",
      },
      {
        onSuccess: () => {
          setCurrentView("processing");
          setTimeout(() => {
            toast.success("Crop scanned successfully!");
            onClose();
          }, 2e3);
        },
      },
    );
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

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white lg:w-3/4 lg:max-w-xl">
        <FarmDetailsCard
          isOpen={currentView === "details"}
          onClose={onClose}
          onConfirm={() => setCurrentView("image_upload")}
          requestServiceType={"Crop Health"}
        />
        <CropImageCard
          isOpen={currentView === "image_upload"}
          onClose={() => setCurrentView("details")}
          onConfirm={(imageData) => {
            handleUploadImage(imageData);
          }}
        />
        <MeasurementCostCard
          service="crop-monitoring"
          isOpen={currentView === "cost"}
          onClose={() => setCurrentView("details")}
          onConfirm={() => handleProceedToPayment()}
        />
        <ProcessingResultCard isOpen={currentView === "processing"} />
      </section>
    </section>
  );
};
