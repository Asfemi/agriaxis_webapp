import {
  useGetSoilTestingResultById,
  useSoilTestingRecommendation,
} from "@/api/soil-testing";
import { formatDate } from "@/lib/utils";
import { useCoordinatesStore } from "@/stores/useCoordinatesStore";
import { useSoilTestingResultStore } from "@/stores/useSoilTestingResultStore";
import { ChevronLeft, LoaderCircle, TicketPercent } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/Button";
import jsPDF from "jspdf";
import { useRef } from "react";
import { toPng } from "html-to-image";

export const SoilTestResultsCard: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    if (!reportRef.current) return;
    const imgData = await toPng(reportRef.current, {
      pixelRatio: 2,
      canvasWidth: 800, // constrain capture width
      style: {
        width: "800px",
        margin: "0",
      },
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const img = new Image();
    img.src = imgData;
    await new Promise((res) => (img.onload = res));

    const imgHeightMm = (img.height * pdfWidth) / img.width;

    let remainingHeight = imgHeightMm;
    let yOffset = 0;

    while (remainingHeight > 0) {
      const margin = 10; // mm
      const contentWidth = pdfWidth - margin * 2;
      const imgHeightMm = (img.height * contentWidth) / img.width;
      pdf.addImage(imgData, "PNG", margin, -yOffset, contentWidth, imgHeightMm);
      // pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, imgHeightMm);
      remainingHeight -= pdfHeight;
      if (remainingHeight > 0) {
        pdf.addPage();
        yOffset += pdfHeight;
      }
    }

    pdf.save(`${result?.name ?? "soil-test"}-result.pdf`);
  };

  const { result } = useSoilTestingResultStore();
  const {
    data: resultData,
    isLoading: isLoadingResult,
    isError: isErrorResult,
  } = useGetSoilTestingResultById(String(result?.id) ?? "");
  const { formData: coordinatesStoreData } = useCoordinatesStore();
  const coordinatesList = useMemo(() => {
    const keys = ["point_1", "point_2", "point_3", "point_4"] as const;

    return keys
      .map((key, index) => {
        const val = coordinatesStoreData[key];
        if (!val) return null;

        const [lat, lng] = val.split(",");

        return {
          label: `point ${index + 1}`,
          value1: lat ? `${lat}°N` : "—",
          value2: lng ? `${lng}°E` : "—",
        };
      })
      .filter(Boolean);
  }, [coordinatesStoreData]);

  const {
    data: recommendations,
    isLoading: isLoadingRecommendations,
    isError: isErrorRecommendations,
  } = useSoilTestingRecommendation(Number(result?.id));

  if (!isOpen) return null;

  if (!result || isErrorResult)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-xl font-medium text-gray-500">
          No soil test result found
        </p>
      </div>
    );

  return (
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
                {result.name}
              </h5>
              <h6 className="text-[#423C59]">Your soil test result</h6>
            </div>
          </header>
          <section ref={reportRef} className="mx-20 space-y-6 pb-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="grid size-9.5 place-items-center rounded-[0.375rem] border border-[#0A814A] bg-[#E7F2ED]">
                <TicketPercent size={20} className="text-[#0A814A]" />
              </div>
              <p className="text-sm text-[#423C59]">
                {formatDate(result.completed_at)}
              </p>
            </div>
            <h5 className="font-neue mb-3 text-xl font-semibold">
              Land Measurement Report{" "}
              <span className="text-sm">(Point to point)</span>
            </h5>
            {coordinatesList.length > 1 && (
              <div className="mb-7">
                <>
                  <h6 className="mb-4 text-lg font-medium text-[#423C59]">
                    Coordinates
                  </h6>

                  <div className="space-y-2.5">
                    {coordinatesList.map((entry, index) => (
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

                        <div className="text-[#423C59] capitalize">{`${entry?.label}: ${entry?.value1}, ${entry?.value2}`}</div>
                      </div>
                    ))}
                  </div>
                </>
              </div>
            )}
            {isLoadingResult ? (
              <LoaderCircle className="mx-auto my-10 animate-spin text-[#0A814A]" />
            ) : (
              <div className="mb-7 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Current pH: {resultData?.ph_level}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Nitrogen (N): {resultData?.nitrogen}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Phosphorus (P): {resultData?.phosphorus}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Pottasium (K): {resultData?.potassium}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Sulphur: {resultData?.sulphur}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Aluminium: {resultData?.alumunium}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Magnesium: {resultData?.magnesium}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Calcium: {resultData?.calcium}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Zinc: {resultData?.zinc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Stone: {resultData?.stone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Clay: {resultData?.clay}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Silt: {resultData?.silt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Sand: {resultData?.sand}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Salinity: {resultData?.salinity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Carbon content: {resultData?.carbon_content}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-600"></div>
                  <p className="text-sm text-[#423C59]">
                    Organic matter: {resultData?.organic_matter}
                  </p>
                </div>
              </div>
            )}
            <div>
              <h5 className="font-neue mb-3 text-xl font-semibold">
                AI recommendations
              </h5>
              {isLoadingRecommendations && (
                <LoaderCircle className="mx-auto my-10 animate-spin text-[#0A814A]" />
              )}
              {isErrorRecommendations && (
                <p className="text-sm text-[#423C59]">
                  Failed to fetch recommendations...
                </p>
              )}
              {!isLoadingRecommendations && !isErrorRecommendations && (
                <>
                  <div className="mb-5 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 animate-pulse rounded-lg bg-blue-500"></div>
                      <h6 className="font-medium text-slate-800">Summary</h6>
                    </div>
                    <p className="text-sm text-[#615C74]">
                      {recommendations?.summary}
                    </p>
                  </div>
                  <div className="mb-5 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 animate-pulse rounded-lg bg-blue-500"></div>
                      <h6 className="font-medium text-slate-800">
                        Recommendation
                      </h6>
                    </div>
                    <p className="text-sm text-[#615C74]">
                      {recommendations?.recommendation}
                    </p>
                  </div>
                  <div className="mb-5 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 animate-pulse rounded-lg bg-blue-500"></div>
                      <h6 className="font-medium text-slate-800">
                        Suitable crops
                      </h6>
                    </div>
                    <p className="text-sm text-[#615C74]">
                      {recommendations?.suitable_crops}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="py-5">
              <Button variant="primary" onClick={() => handleDownload()}>
                Download Result
              </Button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
