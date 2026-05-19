import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet/dist/leaflet.css";
import {
  useCoordinatesStore,
  type PointsFormData,
} from "@/stores/useCoordinatesStore";

interface Coordinate {
  lat: number;
  lng: number;
}

const calculatePolygonAreaInHectares = (coords: Coordinate[]): number => {
  if (coords.length < 3) return 0;
  
  const latLngs = coords.map(c => new L.LatLng(c.lat, c.lng));
  
  const areaInSquareMeters = (L as any).GeometryUtil 
    ? (L as any).GeometryUtil.geodesicArea(latLngs)
    : calculateGeodesicArea(latLngs);

  return areaInSquareMeters / 10000;
};

const calculateGeodesicArea = (latLngs: L.LatLng[]): number => {
  const RADIUS = 6378137;
  let area = 0;
  const len = latLngs.length;

  if (len > 2) {
    for (let i = 0; i < len; i++) {
      const p1 = latLngs[i];
      const p2 = latLngs[(i + 1) % len];
      area += (p2.lng - p1.lng) * Math.PI / 180 * (2 + Math.sin(p1.lat * Math.PI / 180) + Math.sin(p2.lat * Math.PI / 180));
    }
    area = area * RADIUS * RADIUS / 2;
  }
  return Math.abs(area);
};

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
      
      const actualPoints = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
      
      const formatted = (actualPoints as unknown as L.LatLng[]).map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));
      setCoords(formatted);
    };

    map.on("pm:create", (e: any) => {
      handleLayerChange(e);
      e.layer.on("pm:edit", () => handleLayerChange(e));
    });

    map.on("pm:remove", () => {
      setCoords([]);
    });

    return () => {
      map.off("pm:create");
      map.off("pm:remove");
    };
  }, [map, setCoords]);

  return null;
};

export const LeafletMapMeasurementCard: React.FC<{
  onClose: () => void;
  onConfirm: (coordinates: string) => void;
}> = ({ onClose, onConfirm }) => {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const { updateFormData: updateCoordinatesFormData } = useCoordinatesStore();

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
    const updates: Partial<PointsFormData> = {};

    coordinates.forEach((coord, index) => {
      const key = `point_${index + 1}` as keyof PointsFormData;
      updates[key] = `${coord.lat.toFixed(6)},${coord.lng.toFixed(6)}`;
    });

    updateCoordinatesFormData(updates);
    const result = coordinates
      .map((coord) => `${coord.lat.toFixed(4)}:${coord.lng.toFixed(4)}`)
      .join(",");
    onConfirm(result);
  };

  const areaInHectares = calculatePolygonAreaInHectares(coordinates);

  return (
    <section className="size-full overflow-y-auto rounded-[1.25rem] bg-white px-7 lg:max-w-xl z-50 ml-auto">
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

      <div className="relative mb-5 h-135 w-full rounded-xl overflow-hidden">
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

        {coordinates.length >= 3 && (
          <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm flex items-center gap-2 border border-slate-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Area: {areaInHectares.toFixed(2)} ha</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pb-5">
        <Button type="button" variant="primary" onClick={handleSave}>
          Save GPS coordinates
        </Button>
      </div>
    </section>
  );
};
