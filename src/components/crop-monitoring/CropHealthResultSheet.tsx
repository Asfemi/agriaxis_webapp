import { ChevronLeft } from "lucide-react";
import healthIcon from "/assets/icons/health.svg";
import { MapContainer, TileLayer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsExpression } from "leaflet";
import type { CropHealthHistory } from "@/models/crop-monitoring.model";

// const farmData = {
//   coordinates: "6.6018:3.3477,6.6020:3.3488,6.6008:3.3488,6.6009:3.3477",
//   image_png:
//     "https://ruralfarmershub.com/imagery/a8b17c9c398c538f7d2d95a2c54641bc9093c33e.png",
// };

export const CropHealthResultSheet: React.FC<{
  onClose?: () => void;
  data: CropHealthHistory;
}> = ({ onClose, data }) => {

  const parseBounds = (coordString: string): LatLngBoundsExpression => {
    const points = coordString.split(",").map((p) => {
      const [lat, lng] = p.split(":").map(Number);
      return [lat, lng] as [number, number];
    });

    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);

    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
  };

  const bounds = parseBounds(data.coordinates);

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="relative z-45 ml-auto h-full w-3/4 overflow-hidden rounded-[1.25rem] bg-white">
        <header className="absolute top-8 left-8 z-46 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-white shadow-md hover:bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
        </header>

        <section className="relative flex h-full flex-col justify-between pb-6">
          <div className="absolute inset-0 z-0">
            <MapContainer
              bounds={bounds}
              zoom={18}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                opacity={0.3}
              />

              <ImageOverlay
                url={data.image_png}
                bounds={bounds}
                opacity={0.8}
                interactive={true}
                className="pixelated-overlay"
              />
            </MapContainer>
          </div>

          {/**
             <div className="z-10 mx-auto mt-auto w-[95%] rounded-xl border border-gray-100 bg-white/95 px-6 py-6 shadow-xl backdrop-blur-sm">
             <div className="flex flex-col">
             <div className="mb-5 flex size-10 items-center justify-center">
             <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
             <img src={healthIcon} width={20} height={20} alt="health" />
             </div>
             </div>

             <div>
             <h6 className="font-neue mb-4 font-semibold text-[#130B30]">
             Analysis Report — Farm name
             </h6>
             <section className="grid grid-cols-5 gap-4">
             <div className="flex flex-col gap-1.5">
             <p className="font-neue text-sm font-semibold text-[#423C59]">
             Insight
             </p>
             <div className="mt-1 flex flex-col gap-[18px]">
             <div className="size-2 rounded-full bg-[#7BDCFF]"></div>
             <div className="size-2 rounded-full bg-[#0A814A]"></div>
             <div className="size-2 rounded-full bg-[#EEB72C]"></div>
             <div className="size-2 rounded-full bg-[#E52B67]"></div>
             </div>
             </div>
             <div className="flex flex-col gap-1.5">
             <p className="font-neue text-sm font-semibold text-[#423C59]">
             Value
             </p>
             <p className="font-neue text-sm text-[#423C59]">0.1</p>
             <p className="font-neue text-sm text-[#423C59]">0.4</p>
             <p className="font-neue text-sm text-[#423C59]">0.2</p>
             <p className="font-neue text-sm text-[#423C59]">-1</p>
             </div>
             <div className="col-span-3 flex flex-col gap-1.5">
             <p className="font-neue text-sm font-semibold text-[#423C59]">
             Description
             </p>
             <p className="font-neue text-sm text-[#423C59]">
             Health, dense vegetation
             </p>
             <p className="font-neue text-sm text-[#423C59]">
             Sparse or stressed vegetation
             </p>
             <p className="font-neue text-sm text-[#423C59]">
             Non-vegetated surfaces
             </p>
             <p className="font-neue text-sm text-[#423C59]">
             Over log of water
             </p>
             </div>
             </section>
             </div>
             </div>
             </div>
             */}
        </section>
      </section>
    </section>
  );
};
