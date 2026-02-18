import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import { useSoilTestingFormStore } from "@/stores/useSoilTestingFormStore";
import { useUserStore } from "@/stores/useUserStore";
import {
  useSoilTestingCost,
  useSoilTestingPayment,
  useSoilTestingPaymentInitialise,
} from "@/api/soil-testing";
import { toast } from "sonner";
import type { SoilTestingPaymentInitialiseResponse } from "@/models/soil-testing-model";

interface Coordinate {
  lat: number;
  lng: number;
}

const RecenterMap: React.FC<{ position: [number, number] | null }> = ({
  position,
}) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { animate: true });
    }
  }, [position, map]);
  return null;
};

const GeomanController: React.FC<{
  setCoords: (coords: Coordinate[]) => void;
}> = ({ setCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const leafletMap = map as any;

    leafletMap.pm.addControls({
      position: "topleft",
      drawPolygon: true,
      drawRectangle: false,
      drawMarker: false,
      drawCircle: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawText: false,
      editMode: true,
      removalMode: true,
    });

    leafletMap.pm.setGlobalOptions({
      pathOptions: {
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.3,
      },
    });

    const handleLayerChange = (e: any) => {
      const layer = e.layer as L.Polygon;
      const latLngs = layer.getLatLngs() as L.LatLng[][];
      const formatted = (latLngs[0] as unknown as L.LatLng[]).map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));
      setCoords(formatted);
    };

    map.on("pm:create", (e: any) => {
      handleLayerChange(e);
      e.layer.on("pm:edit", () => handleLayerChange(e));
    });

    return () => {
      map.off("pm:create");
    };
  }, [map, setCoords]);

  return null;
};

export const MapMeasurementCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}> = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const { formData } = useSoilTestingFormStore();
  const user = useUserStore((state) => state.user);
  const { data: cost } = useSoilTestingCost(Number(formData.depth));
  const { mutate: initialisePayment } = useSoilTestingPaymentInitialise();
  const { mutate: confirmPayment } = useSoilTestingPayment();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Error getting location", err),
        { enableHighAccuracy: true },
      );
    }
  }, []);

  const handleSave = () => {
    // console.log(formData);
    const result = coordinates
      .map((coord) => `${coord.lat.toFixed(4)}:${coord.lng.toFixed(4)}`)
      .join(",");
    console.log(result);
    const request = {
      farmId: formData.farm_id ?? "",
      amount: cost?.amount ?? 0,
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
      onError: () =>
        toast.error("Failed to initiate payment. Please try again."),
    });
  };

  const openPaymentModal = (
    paymentData: SoilTestingPaymentInitialiseResponse,
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
      console.log("Event type:", event.data?.type);

      if (event.data?.type === "PAYMENT_COMPLETE") {
        messageReceived = true;

        const { status, transactionId } = event.data;
        confirmPayment({
          farmId: farm_id,
          amount,
          currency,
          txRef: tx_ref,
          transactionId: String(transactionId) ?? "",
          status: status ?? "",
          success: status === "successful" || status === "completed",
        });

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
          console.log("No message received, closing popup");
          cleanup();
        }
      }
    }, 1000);

    const cleanup = () => {
      console.log("Cleaning up listeners");
      clearInterval(checkClosed);
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <section className="size-full overflow-y-auto px-7">
      <header className="mb-10 flex items-center gap-3.5 pt-7">
        <button
          onClick={onClose}
          className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
        >
          <ChevronLeft size={24} className="text-[#434449]" />
        </button>
        <div>
          <h5 className="font-neue text-xl font-bold text-[#130B30]">
            Map view
          </h5>
        </div>
      </header>
      <div className="mb-5 h-135">
        <MapContainer
          key={"leaflet"}
          center={[6.5244, 3.3792]}
          zoom={16}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
          <RecenterMap position={userPos} />
          <GeomanController setCoords={setCoordinates} />
        </MapContainer>
      </div>
      <div className="flex flex-col gap-4 pb-5">
        <Button type="button" variant="primary" onClick={handleSave}>
          Save GPS coordinate
        </Button>
      </div>
    </section>
  );
};
