import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCoordinatesStore } from "@/stores/useCoordinatesStore";

interface Coordinate {
  lat: number;
  lng: number;
}

const MapUpdater: React.FC<{ coordinates: Coordinate[] }> = ({
  coordinates,
}) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map((c) => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
};

// Pending-pin icon so a tapped-but-unconfirmed point is visually distinct
// from the green polygon vertices already saved.
const pendingIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#F59E0B;border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.15);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const MapClickHandler: React.FC<{
  onPick: (coord: Coordinate) => void;
}> = ({ onPick }) => {
  useMapEvents({
    click: (e) => {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

export const ManualMeasurementCoordinateEntryCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
  const { formData, updateFormData } = useCoordinatesStore();
  const [coordinateInput, setCoordinateInput] = useState("");
  const [error, setError] = useState("");
  const [pendingPoint, setPendingPoint] = useState<Coordinate | null>(null);

  const coordinates: Coordinate[] = [
    formData.point_1,
    formData.point_2,
    formData.point_3,
    formData.point_4,
  ]
    .filter(Boolean)
    .map((point) => {
      const [lat, lng] = point!.split(",").map(Number);
      return { lat, lng };
    })
    .filter((coord) => !isNaN(coord.lat) && !isNaN(coord.lng));

  const handleMapPick = (coord: Coordinate) => {
    setError("");
    setPendingPoint(coord);
    setCoordinateInput(`${coord.lat.toFixed(6)},${coord.lng.toFixed(6)}`);
  };

  const handleEnterCoordinate = () => {
    setError("");

    // Parse input format: "lat,lng" or "lat:lng"
    const parsed = coordinateInput.trim().replace(":", ",");
    const [lat, lng] = parsed.split(",").map((n) => parseFloat(n.trim()));

    if (isNaN(lat) || isNaN(lng)) {
      setError("Invalid format. Use: latitude,longitude (e.g., 6.6172,3.3530)");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError(
        "Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180",
      );
      return;
    }

    const coordinateValue = `${lat},${lng}`;

    if (formData.currentPoint === "1") {
      updateFormData({ point_1: coordinateValue });
    } else if (formData.currentPoint === "2") {
      updateFormData({ point_2: coordinateValue });
    } else if (formData.currentPoint === "3") {
      updateFormData({ point_3: coordinateValue });
    } else if (formData.currentPoint === "4") {
      updateFormData({ point_4: coordinateValue });
    } else {
      setError("All 4 points already entered");
      return;
    }

    setCoordinateInput("");
    setPendingPoint(null);
    onConfirm();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEnterCoordinate();
    }
  };

  return (
    <section className="size-full overflow-y-auto">
      <header className="mb-10 flex items-center gap-3.5 pt-7">
        <button
          onClick={onClose}
          className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
        >
          <ChevronLeft size={24} className="text-[#434449]" />
        </button>
        <div>
          <h5 className="font-neue text-xl font-bold text-[#130B30]">Map</h5>
          <p className="text-sm text-[#615C74]">
            Tap the map or type coordinates directly (format: lat,lng)
          </p>
        </div>
      </header>

      <div className="relative mb-5 h-135">
        <MapContainer
          key={"manual"}
          center={[6.6172, 3.353]}
          zoom={16}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />

          {coordinates.length > 0 && (
            <Polygon
              positions={coordinates.map((c) => [c.lat, c.lng])}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          )}

          {pendingPoint && (
            <Marker
              position={[pendingPoint.lat, pendingPoint.lng]}
              icon={pendingIcon}
            />
          )}

          <MapClickHandler onPick={handleMapPick} />
          <MapUpdater coordinates={coordinates} />
        </MapContainer>

        {/* Coordinate Counter */}
        {coordinates.length > 0 && (
          <div className="absolute bottom-4 left-1/2 z-1000 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-[10px] text-white backdrop-blur-md">
            Points Entered: {coordinates.length} / 4
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pb-10">
        <div>
          <div className="rounded-lg bg-[#F3F6F8] p-3.5">
            <input
              id="coordinate"
              type="text"
              value={coordinateInput}
              onChange={(e) => {
                setCoordinateInput(e.target.value);
                setPendingPoint(null);
              }}
              onKeyPress={handleKeyPress}
              className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-sm placeholder:text-[#423C59] placeholder:opacity-70"
              placeholder="Enter coordinate (e.g., 6.6172,3.3530)"
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleEnterCoordinate}
        >
          Enter coordinate
        </Button>
      </div>
    </section>
  );
};
