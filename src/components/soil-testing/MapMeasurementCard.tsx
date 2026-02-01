import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";

interface Coordinate {
  lat: number;
  lng: number;
}

const GeomanController: React.FC<{
  setCoords: (coords: Coordinate[]) => void;
}> = ({ setCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const leafletMap = map as any;

    leafletMap.pm.addControls({
      position: "topleft",
      drawRectangle: true,
      // drawMarker: false,
      // drawPolygon: true,
      // editMode: true,
      // dragMode: true,
      // removalMode: true,
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
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);

  return (
    <section className="size-full px-7 overflow-y-auto">
      <header className="mb-10 flex items-center gap-3.5 pt-7">
        <button
          onClick={onClose}
          className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
        >
          <ChevronLeft size={24} className="text-[#434449]" />
        </button>
        <div>
          <h5 className="font-neue text-xl font-bold text-[#130B30]">Map view</h5>
        </div>
      </header>
      <div className="h-135 mb-5">
        <MapContainer
          center={[-1.2863, 36.8219]}
          zoom={16}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
          <GeomanController setCoords={setCoordinates} />
        </MapContainer>

        {/* Coordinate Preview Footer */}
        {coordinates.length > 0 && (
          <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-[10px] text-white backdrop-blur-md">
            Vertices Captured: {coordinates.length}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 pb-5">
        <Button variant="primary">Save GPS coordinate</Button>
      </div>
    </section>
  );
};

