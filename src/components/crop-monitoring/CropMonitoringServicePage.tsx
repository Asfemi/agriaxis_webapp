import { Button } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import testingIcon from "/assets/icons/testing.svg";
import testingIconGreen from "/assets/icons/soil.svg";
import testingIconGrey from "/assets/icons/testing-grey.svg";
import type { CropMonitoringDashboardResponse } from "@/models/crop-monitoring.model";
import { useGetPaymentSubscriptions, usePaymentSubscribe } from "@/api/payments";
import { DiseaseDetectionHistoryTable } from "./DiseaseDetectionHistoryTable";
import { useEffect, useState } from "react";
import type { PaymentSubscription, PaymentSubscriptionRes } from "@/models/payment.model";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";

export const CropMonitoringServicePage: React.FC<{
  onClose: () => void;
  title: string;
  onRequestInformation: () => void;
  data: CropMonitoringDashboardResponse | undefined;
}> = ({ onClose, title, onRequestInformation, data }) => {
  const [diseaseSub, setDiseaseSub] = useState<PaymentSubscription>();
  const { data: subscriptions, isLoading: isLoadingSubscriptions } =
    useGetPaymentSubscriptions();
  const { user } = useUserStore()
  const { mutate: initialiseSubscription } = usePaymentSubscribe()

  useEffect(() => {
    if (isLoadingSubscriptions) return;
    const diseaseSub = subscriptions?.find(
      (sub) => sub.plan_key === "pest_disease",
    );
    if (!diseaseSub) return;
    setDiseaseSub(diseaseSub);
  }, [subscriptions]);

  const onSubscribeToDisease = () => {
    if (!diseaseSub) return;

    const request = {
      plan_key: "pest_disease",
      redirect_url: "https://agriaxis-webapp.vercel.app",
      currency: "NGN",
      country: "NG",
      customer: {
        email: user?.email ?? "",
        name: user?.name ?? "",
        phonenumber: "",
      },
    };

    initialiseSubscription(request, {
      onSuccess: (data) => {
        toast.success("Payment initiated successfully!");

        openPaymentModal(data);
      },
      onError: (error) =>
        toast.error(
          error.message ?? "Failed to initiate payment. Please try again.",
        ),
          
    })
  };

  const openPaymentModal = (paymentData: PaymentSubscriptionRes) => {
    const { payment_link } = paymentData;

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
    }, 1e3);

    const cleanup = () => {
      clearInterval(checkClosed);
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  const displayData = (() => {
    if (!data) {
      return { total: 0, pending: 0, completed: 0, history: [] };
    }

    // 2. Use the title to pick the correct branch and extract values
    if (title === "Crop health") {
      const ch = data.crop_health;
      return {
        total: ch.total_no_of_crop_tests,
        pending: ch.pending_crop_tests,
        completed: ch.completed_crop_tests,
        history: ch.analytics_history,
      };
    } else {
      const pm = data.pest_disease_monitoring;
      return {
        total: pm.total_no_of_farms_monitored,
        pending: pm.pending_farms_to_be_monitored,
        completed: pm.completed_farm_monitoring,
        history: pm.analytics_history,
      };
    }
  })();

  return (
    <main className="rounded-[1.25rem] bg-white p-6 pb-9">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <h5 className="font-neue text-lg font-semibold text-[#434449]">
            {title}
          </h5>
        </div>
        <div>
          {(!diseaseSub || diseaseSub.status !== 'active') ? (
            <Button variant="primary" onClick={() => onSubscribeToDisease()}>
              Subscribe to Pest Disease Monitoring ₦5,000
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onRequestInformation()}>
              Request Information
            </Button>
          )}
        </div>
      </header>
      <section>
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <img src={testingIconGreen} width={17.5} height={15.64} />
              </div>
            }
            title="Total Tests"
            value={displayData.total}
          />
          <StatCard
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#EEB72C] bg-[#FDF8EA]">
                <img src={testingIcon} width={20} height={20} />
              </div>
            }
            title="Pending Farms"
            value={displayData.pending}
          />
          <StatCard
            className="col-span-2 lg:col-auto"
            icon={
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#423C59] bg-[#E7E7EA]">
                <img src={testingIconGrey} width={20} height={20} />
              </div>
            }
            title="Completed Farms monitored"
            value={displayData.completed}
          />
        </div>
        <div>{title !== "Crop health" && <DiseaseDetectionHistoryTable />}</div>
      </section>
    </main>
  );
};
