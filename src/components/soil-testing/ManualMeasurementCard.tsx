import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/Button";
import React, { useState } from "react";
import { ManualMeasurementCoordinateEntryCard } from "@/components/soil-testing/ManualMeasurementCoordinateEntryCard";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  useSoilTestingPayment,
  useSoilTestingPaymentInitialise,
  useSoilTestingRun,
  useSoilTestingUpload,
} from "@/api/soil-testing";
import { toast } from "sonner";
import type { SoilTestingPaymentInitialiseResponse } from "@/models/soil-testing.model";
import { useCoordinatesStore } from "@/stores/useCoordinatesStore";
import { useSoilTestingResultStore } from "@/stores/useSoilTestingResultStore";

const MEASUREMENT_STEPS = [
  "Stand at each corner of your land",
  "Enter GPS coordinates for each corner",
  "Record 4 points for your farm land",
];

/**
 * @deprecated
 * @param param0 
 * @returns 
 */
export const ManualMeasurementCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const [openCoordinatesSelection, setOpenCoordinatesSelection] =
    useState(false);
  const { formData, updateFormData } = useCoordinatesStore();
  const { formData: soilTestingFormData } = useSoilTestingFormStore();
  const user = useUserStore((state) => state.user);
  const { mutate: initialisePayment } = useSoilTestingPaymentInitialise();
  const { mutate: confirmPayment } = useSoilTestingPayment();
  const { mutate: uploadSoilTest } = useSoilTestingUpload();
  const { mutate: runSoilTest } = useSoilTestingRun();
  const { setResult } = useSoilTestingResultStore();

  const handleSelectCoordinate = (index: number) => {
    const currentPoint = index + 1;
    updateFormData({ currentPoint: currentPoint.toString() });
    setOpenCoordinatesSelection(true);
  };

  const handleRemoveCoordinate = (index: number) => {
    const pointKey = `point_${index + 1}` as keyof typeof formData;
    updateFormData({ [pointKey]: "" });
  };

  const formatCoordinate = (coord: string) => {
    if (!coord) return "";
    const [lat, lng] = coord.split(",").map(Number);

    /**
     * @description Convert to degrees, minutes, seconds format
     * @param value - The value to be converted
     * @param isLat - Whether the value is latitude or longitude
     * @returns The formatted coordinate string in degrees, minutes, seconds format
     */
    const formatDMS = (value: number, isLat: boolean) => {
      const absolute = Math.abs(value);
      const degrees = Math.floor(absolute);
      const minutesFloat = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesFloat);
      const seconds = ((minutesFloat - minutes) * 60).toFixed(1);
      const direction = isLat
        ? value >= 0
          ? "N"
          : "S"
        : value >= 0
          ? "E"
          : "W";

      return `${degrees}°${minutes}'${seconds}"${direction}`;
    };

    return `${formatDMS(lat, true)}, ${formatDMS(lng, false)}`;
  };

  const points = [
    { title: "Point 1", coordinate: formData.point_1 },
    { title: "Point 2", coordinate: formData.point_2 },
    { title: "Point 3", coordinate: formData.point_3 },
    { title: "Point 4", coordinate: formData.point_4 },
  ];

  /**
   * @description Handles the confirmation of the soil testing form
   */
  const handleConfirm = () => {
    const result = points.map((coord) => coord.coordinate).join(",");

    const request = {
      farmId: soilTestingFormData.farm_id ?? "",
      amount: soilTestingFormData.cost ?? 0,
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

        openPaymentModal(data, result);
      },
      onError: () =>
        toast.error("Failed to initiate payment. Please try again."),
    });
  };

  const openPaymentModal = (
    paymentData: SoilTestingPaymentInitialiseResponse,
    coordinates: string,
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
                { farmId: farm_id, coordinatesCsv: coordinates },
                {
                  onSuccess: () => {
                    toast.success("Soil test uploaded successfully!");
                    runSoilTest(
                      {
                        farmId: farm_id,
                        crop: soilTestingFormData.crop ?? "",
                        depth: "0-20",
                      },
                      {
                        onSuccess: (data) => {
                          setResult(data);
                          toast.success("Soil test run successfully!");
                          onConfirm();
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
            }
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
      {!openCoordinatesSelection ? (
        <section className="size-full">
          <div className="flex h-full flex-col justify-between overflow-y-auto pb-10">
            <div>
              <header className="mb-10 flex items-start gap-3.5 pt-7 pl-6">
                <button
                  onClick={onClose}
                  className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
                >
                  <ChevronLeft size={24} className="text-[#434449]" />
                </button>
                <div>
                  <h5 className="font-neue text-xl font-bold text-[#130B30]">
                    Manual measurement
                  </h5>
                  <h6 className="w-4/5 text-[#423C59]">
                    You can view any of the points on the next map to get
                    accurate farm measurement
                  </h6>
                </div>
              </header>
              <section className="mx-20 space-y-10 pb-10">
                <div className="grid grid-cols-3 gap-3">
                  {points.map((point, index) => (
                    <div
                      key={index}
                      className={`rounded-xl border p-3 pb-7 transition-all ${
                        point.coordinate
                          ? "border-[#0A814A] bg-[#181B11] text-white"
                          : "cursor-pointer border-[#0A814A] bg-[#E7F2ED]"
                      }`}
                      onClick={() =>
                        !point.coordinate && handleSelectCoordinate(index)
                      }
                    >
                      <div className="mb-3 flex items-start justify-between">
                        {point.coordinate ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCoordinate(index);
                            }}
                            className="grid size-5 cursor-pointer place-items-center rounded-full bg-white/80 hover:bg-white/70"
                          >
                            <X size={14} className="text-red-400" />
                          </button>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM10 16.875C8.64026 16.875 7.31105 16.4718 6.18046 15.7164C5.04987 14.9609 4.16868 13.8872 3.64833 12.6309C3.12798 11.3747 2.99183 9.99237 3.2571 8.65875C3.52238 7.32513 4.17716 6.10013 5.13864 5.13864C6.10013 4.17716 7.32514 3.52237 8.65876 3.2571C9.99238 2.99183 11.3747 3.12798 12.631 3.64833C13.8872 4.16868 14.9609 5.04987 15.7164 6.18045C16.4718 7.31104 16.875 8.64025 16.875 10C16.8729 11.8227 16.1479 13.5702 14.8591 14.8591C13.5702 16.1479 11.8227 16.8729 10 16.875ZM13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10Z"
                              fill="#0A814A"
                            />
                          </svg>
                        )}
                      </div>
                      <p
                        className={`font-neue mb-1 font-semibold ${
                          point.coordinate ? "text-white" : "text-[#130B30]"
                        }`}
                      >
                        {point.title}
                      </p>
                      <p
                        className={`text-xs ${
                          point.coordinate ? "text-white/90" : "text-[#615C74]"
                        }`}
                      >
                        {point.coordinate
                          ? formatCoordinate(point.coordinate)
                          : "Add Coordinate"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-[#F3F6F8] px-4 py-6">
                  <div className="mb-10">
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="37"
                        height="37"
                        rx="5.5"
                        fill="#E7F2ED"
                      />
                      <rect
                        x="0.5"
                        y="0.5"
                        width="37"
                        height="37"
                        rx="5.5"
                        stroke="#0A814A"
                      />
                      <g clipPath="url(#clip0_1751_8918)">
                        <path
                          d="M27.75 18.375H25.8461C25.698 16.7751 24.995 15.2774 23.8588 14.1412C22.7226 13.0051 21.2249 12.302 19.625 12.1539V10.25C19.625 10.0842 19.5592 9.92527 19.4419 9.80806C19.3247 9.69085 19.1658 9.625 19 9.625C18.8342 9.625 18.6753 9.69085 18.5581 9.80806C18.4408 9.92527 18.375 10.0842 18.375 10.25V12.1539C16.7751 12.302 15.2774 13.0051 14.1412 14.1412C13.0051 15.2774 12.302 16.7751 12.1539 18.375H10.25C10.0842 18.375 9.92527 18.4408 9.80806 18.5581C9.69085 18.6753 9.625 18.8342 9.625 19C9.625 19.1658 9.69085 19.3247 9.80806 19.4419C9.92527 19.5592 10.0842 19.625 10.25 19.625H12.1539C12.302 21.2249 13.0051 22.7226 14.1412 23.8588C15.2774 24.995 16.7751 25.698 18.375 25.8461V27.75C18.375 27.9158 18.4408 28.0747 18.5581 28.1919C18.6753 28.3092 18.8342 28.375 19 28.375C19.1658 28.375 19.3247 28.3092 19.4419 28.1919C19.5592 28.0747 19.625 27.9158 19.625 27.75V25.8461C21.2249 25.698 22.7226 24.995 23.8588 23.8588C24.995 22.7226 25.698 21.2249 25.8461 19.625H27.75C27.9158 19.625 28.0747 19.5592 28.1919 19.4419C28.3092 19.3247 28.375 19.1658 28.375 19C28.375 18.8342 28.3092 18.6753 28.1919 18.5581C28.0747 18.4408 27.9158 18.375 27.75 18.375ZM19 24.625C17.8875 24.625 16.7999 24.2951 15.8749 23.677C14.9499 23.0589 14.2289 22.1804 13.8032 21.1526C13.3774 20.1248 13.266 18.9938 13.4831 17.9026C13.7001 16.8115 14.2359 15.8092 15.0225 15.0225C15.8092 14.2359 16.8115 13.7001 17.9026 13.4831C18.9938 13.266 20.1248 13.3774 21.1526 13.8032C22.1804 14.2289 23.0589 14.9499 23.677 15.8749C24.2951 16.7999 24.625 17.8875 24.625 19C24.6233 20.4913 24.0302 21.9211 22.9756 22.9756C21.9211 24.0302 20.4913 24.6233 19 24.625ZM22.125 19C22.125 19.6181 21.9417 20.2223 21.5983 20.7362C21.255 21.2501 20.7669 21.6506 20.1959 21.8871C19.6249 22.1236 18.9965 22.1855 18.3903 22.065C17.7842 21.9444 17.2273 21.6467 16.7903 21.2097C16.3533 20.7727 16.0556 20.2158 15.935 19.6097C15.8145 19.0035 15.8764 18.3751 16.1129 17.8041C16.3494 17.2331 16.7499 16.745 17.2638 16.4017C17.7777 16.0583 18.3819 15.875 19 15.875C19.8288 15.875 20.6237 16.2042 21.2097 16.7903C21.7958 17.3763 22.125 18.1712 22.125 19Z"
                          fill="#0A814A"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1751_8918">
                          <rect
                            width="20"
                            height="20"
                            fill="white"
                            transform="translate(9 9)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h6 className="font-neue mb-6 text-lg font-semibold text-[#130B30]">
                      How to measure your farm
                    </h6>
                    <div className="space-y-4">
                      {MEASUREMENT_STEPS.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5963 3.40377C11.3773 2.18477 9.72401 1.49994 8.00008 1.49994C6.27615 1.49994 4.62283 2.18477 3.40383 3.40377C2.18483 4.62277 1.5 6.27609 1.5 8.00002C1.5 9.72395 2.18483 11.3773 3.40383 12.5963C4.62283 13.8153 6.27615 14.5001 8.00008 14.5001C9.72401 14.5001 11.3773 13.8153 12.5963 12.5963C13.8153 11.3773 14.5002 9.72395 14.5002 8.00002C14.5002 6.27609 13.8153 4.62277 12.5963 3.40377ZM11.8895 11.8894C11.1202 12.6585 10.1402 13.1822 9.07335 13.3944C8.00648 13.6065 6.90065 13.4976 5.89571 13.0813C4.89076 12.665 4.03183 11.96 3.42752 11.0556C2.8232 10.1511 2.50065 9.08778 2.50065 8.00002C2.50065 6.91226 2.8232 5.84892 3.42752 4.94447C4.03183 4.04001 4.89076 3.33506 5.89571 2.91876C6.90065 2.50245 8.00648 2.39349 9.07335 2.60564C10.1402 2.81779 11.1202 3.34154 11.8895 4.11064C12.9194 5.14301 13.4978 6.54174 13.4978 8.00002C13.4978 9.45829 12.9194 10.857 11.8895 11.8894ZM10.3538 5.14627C10.4003 5.1927 10.4372 5.24785 10.4624 5.30855C10.4875 5.36925 10.5005 5.43431 10.5005 5.50002C10.5005 5.56573 10.4875 5.63079 10.4624 5.69149C10.4372 5.75219 10.4003 5.80733 10.3538 5.85377L8.35383 7.85377C8.30739 7.90026 8.25225 7.93714 8.19155 7.9623C8.13085 7.98746 8.06579 8.00041 8.00008 8.00041C7.93437 8.00041 7.86931 7.98746 7.80861 7.9623C7.74791 7.93714 7.69277 7.90026 7.64633 7.85377L5.64633 5.85377C5.55251 5.75995 5.4998 5.6327 5.4998 5.50002C5.4998 5.36734 5.55251 5.24009 5.64633 5.14627C5.74015 5.05245 5.8674 4.99974 6.00008 4.99974C6.13276 4.99974 6.26001 5.05245 6.35383 5.14627L8.00008 6.79314L9.64633 5.14627C9.69277 5.09978 9.74791 5.0629 9.80861 5.03774C9.86931 5.01258 9.93437 4.99962 10.0001 4.99962C10.0658 4.99962 10.1308 5.01258 10.1915 5.03774C10.2522 5.0629 10.3074 5.09978 10.3538 5.14627ZM10.3538 8.64627C10.4003 8.6927 10.4372 8.74785 10.4624 8.80855C10.4875 8.86925 10.5005 8.93431 10.5005 9.00002C10.5005 9.06573 10.4875 9.13079 10.4624 9.19149C10.4372 9.25219 10.4003 9.30733 10.3538 9.35377L8.35383 11.3538C8.30739 11.4003 8.25225 11.4371 8.19155 11.4623C8.13085 11.4875 8.06579 11.5004 8.00008 11.5004C7.93437 11.5004 7.86931 11.4875 7.80861 11.4623C7.74791 11.4371 7.69277 11.4003 7.64633 11.3538L5.64633 9.35377C5.55251 9.25995 5.4998 9.1327 5.4998 9.00002C5.4998 8.86734 5.55251 8.74009 5.64633 8.64627C5.74015 8.55245 5.8674 8.49974 6.00008 8.49974C6.13276 8.49974 6.26001 8.55245 6.35383 8.64627L8.00008 10.2931L9.64633 8.64627C9.69277 8.59978 9.74791 8.5629 9.80861 8.53774C9.86931 8.51258 9.93437 8.49963 10.0001 8.49963C10.0658 8.49963 10.1308 8.51258 10.1915 8.53774C10.2522 8.5629 10.3074 8.59978 10.3538 8.64627Z"
                              fill="#0A814A"
                            />
                          </svg>

                          <span className="text-[#423C59]">{entry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="mx-20">
              <Button
                onClick={handleConfirm}
                variant="primary"
                disabled={
                  !formData.point_1 ||
                  !formData.point_2 ||
                  !formData.point_3 ||
                  !formData.point_4
                }
              >
                Done
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <ManualMeasurementCoordinateEntryCard
          isOpen={openCoordinatesSelection}
          onClose={() => setOpenCoordinatesSelection(false)}
          onConfirm={() => setOpenCoordinatesSelection(false)}
        />
      )}
    </>
  );
};
