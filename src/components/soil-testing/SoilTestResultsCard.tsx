import {
  useGetSoilTestingResultById,
  useSoilTestingRecommendation,
} from "@/api/soil-testing";
import { formatDate } from "@/lib/utils";
import { useCoordinatesStore } from "@/stores/useCoordinatesStore";
import { useSoilTestingResultStore } from "@/stores/useSoilTestingResultStore";
import { ChevronLeft, LoaderCircle, TicketPercent } from "lucide-react";
import { useMemo, useRef } from "react";
import { Button } from "@/components/Button";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

/**
 * The `recommendation` field returned by the API sometimes embeds a
 * "Soil correction plan" as a JSON blob appended after a plain-text
 * intro paragraph, e.g.:
 *
 *   "Maize is NOT suitable for this soil ...
 *
 *    Soil correction plan:
 *    {"1. Acidity & Aluminium Mitigation": {...}, ...}"
 *
 * This helper splits that apart so we can render the intro as prose
 * and the plan as a table.
 */
type CorrectionStep = {
  fertilizer_type?: string;
  application_rate_kg_ha?: string;
  timing_dosage?: string;
  strategy?: string;
};

type ParsedRecommendation = {
  /** Legacy format: plain intro + a structured JSON correction plan */
  intro: string | null;
  plan: Record<string, CorrectionStep> | null;
  /** New format: free-form text with markdown-ish (**bold**, "* " bullets) hints */
  markdown: string | null;
};

function parseRecommendation(raw?: string | null): ParsedRecommendation {
  if (!raw) return { intro: null, plan: null, markdown: null };

  const marker = "soil correction plan:";
  const markerIndex = raw.toLowerCase().indexOf(marker);

  if (markerIndex !== -1) {
    const intro = raw.slice(0, markerIndex).trim();
    const jsonPart = raw.slice(markerIndex + marker.length).trim();

    try {
      const plan = JSON.parse(jsonPart) as Record<string, CorrectionStep>;
      return { intro, plan, markdown: null };
    } catch {
      // Not actually JSON (e.g. it's a markdown "Soil Correction Plan" section
      // instead) — fall through and treat the whole string as markdown text.
    }
  }

  return { intro: null, plan: null, markdown: raw.trim() };
}

/**
 * Renders a single line of text, converting **bold** markers into <strong>
 * tags. This is intentionally tiny/dependency-free rather than pulling in a
 * full markdown renderer, since the AI output only ever uses bold + bullets.
 */
const InlineText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-slate-800">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
};

/**
 * Renders free-form AI recommendation text that uses lightweight markdown
 * hints (blank-line separated sections, standalone "Title" lines, **bold**
 * sub-headings like "**1. Organic Matter Improvement:**", and "* " bullet
 * lists with bold labels) into clean, non-asterisk-y JSX.
 */
const FormattedRecommendation: React.FC<{ text: string }> = ({ text }) => {
  const blocks = useMemo(
    () =>
      text
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean),
    [text],
  );

  return (
    <div className="space-y-5">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        // A block that opens with a short, unadorned, un-punctuated line is
        // treated as a section title (e.g. "Soil Correction Plan").
        let title: string | null = null;
        let contentLines = lines;
        const [firstLine] = lines;
        if (
          firstLine &&
          !firstLine.startsWith("*") &&
          !/\*\*/.test(firstLine) &&
          !/[.:]$/.test(firstLine) &&
          firstLine.split(" ").length <= 6
        ) {
          title = firstLine;
          contentLines = lines.slice(1);
        }

        const elements: React.ReactNode[] = [];
        let bulletBuffer: string[] = [];

        const flushBullets = () => {
          if (!bulletBuffer.length) return;
          elements.push(
            <ul
              key={`ul-${elements.length}`}
              className="list-disc space-y-1.5 pl-5"
            >
              {bulletBuffer.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed text-[#615C74]">
                  <InlineText text={item} />
                </li>
              ))}
            </ul>,
          );
          bulletBuffer = [];
        };

        contentLines.forEach((line, i) => {
          const wholeLineBold = /^\*\*(.+)\*\*:?$/.exec(line);

          if (line.startsWith("*")) {
            bulletBuffer.push(line.replace(/^\*\s*/, ""));
          } else if (wholeLineBold) {
            flushBullets();
            elements.push(
              <h6
                key={`h-${i}`}
                className="mt-3 mb-1 text-sm font-semibold text-slate-800"
              >
                {wholeLineBold[1].replace(/:$/, "")}
              </h6>,
            );
          } else {
            flushBullets();
            elements.push(
              <p
                key={`p-${i}`}
                className="text-sm leading-relaxed text-[#615C74]"
              >
                <InlineText text={line} />
              </p>,
            );
          }
        });
        flushBullets();

        return (
          <div key={blockIndex} className="space-y-1.5">
            {title && (
              <h6 className="text-sm font-semibold text-slate-800">{title}</h6>
            )}
            {elements}
          </div>
        );
      })}
    </div>
  );
};

export const SoilTestResultsCard: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!reportRef.current) return;

    const canvas = await toPng(reportRef.current, {
      pixelRatio: 2,
      skipFonts: false,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const imgProps = pdf.getImageProperties(canvas);

    const printableWidth = pdfWidth - margin * 2;
    const printableHeight = (imgProps.height * printableWidth) / imgProps.width;

    let heightLeft = printableHeight;
    let position = margin;

    pdf.addImage(
      canvas,
      "PNG",
      margin,
      position,
      printableWidth,
      printableHeight,
    );
    heightLeft -= pdfHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - printableHeight + margin;
      pdf.addPage();
      pdf.addImage(
        canvas,
        "PNG",
        margin,
        position,
        printableWidth,
        printableHeight,
      );
      heightLeft -= pdfHeight - margin * 2;
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
  } = useSoilTestingRecommendation(result?.id ?? "");

  const {
    intro: recommendationIntro,
    plan: correctionPlan,
    markdown: recommendationMarkdown,
  } = useMemo(
    () => parseRecommendation(recommendations?.recommendation),
    [recommendations?.recommendation],
  );

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
          <div className="mx-20 space-y-6 pb-10">
            <section ref={reportRef}>
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

              {/* ---------- Soil parameters table ---------- */}
              <div className="mb-7">
                <h6 className="mb-4 text-lg font-medium text-[#423C59]">
                  Soil Parameters
                </h6>
                {isLoadingResult ? (
                  <LoaderCircle className="mx-auto my-10 animate-spin text-[#0A814A]" />
                ) : (
                  <div className="overflow-hidden rounded-lg border border-[#E5E3EE]">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#F5F4FA] text-left text-[#423C59]">
                          <th className="px-4 py-2.5 font-medium">Parameter</th>
                          <th className="px-4 py-2.5 font-medium">Value</th>
                          <th className="px-4 py-2.5 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultData?.parameters.map((entry, index) => (
                          <tr
                            key={entry.key}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-[#FAFAFC]"
                            }
                          >
                            <td className="px-4 py-2.5 text-[#130B30]">
                              {entry.label}
                            </td>
                            <td className="px-4 py-2.5 text-[#423C59]">
                              {entry.value}
                              {entry.unit}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F2ED] px-2.5 py-0.5 text-xs font-medium text-[#0A814A]">
                                <span className="size-1.5 rounded-full bg-[#0A814A]" />
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ---------- AI recommendations ---------- */}
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
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="rounded-lg border border-[#E5E3EE] bg-[#FAFAFC] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="size-2.5 rounded-lg bg-blue-500" />
                        <h6 className="font-medium text-slate-800">Summary</h6>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-[#615C74]">
                        {recommendations?.summary}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="rounded-lg border border-[#E5E3EE] bg-[#FAFAFC] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="size-2.5 rounded-lg bg-blue-500" />
                        <h6 className="font-medium text-slate-800">
                          Recommendation
                        </h6>
                      </div>

                      {/* Legacy format: plain intro + structured JSON plan */}
                      {correctionPlan && (
                        <>
                          <p className="text-sm leading-relaxed whitespace-pre-line text-[#615C74]">
                            {recommendationIntro}
                          </p>
                          <div className="mt-4">
                            <h6 className="mb-2 text-sm font-medium text-slate-800">
                              Soil Correction Plan
                            </h6>
                            <div className="overflow-hidden rounded-lg border border-[#E5E3EE]">
                              <table className="w-full border-collapse text-sm">
                                <thead>
                                  <tr className="bg-[#F5F4FA] text-left text-[#423C59]">
                                    <th className="px-3 py-2 font-medium">
                                      Step
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                      Fertilizer / Input
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                      Rate (kg/ha)
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                      Timing &amp; Dosage
                                    </th>
                                    <th className="px-3 py-2 font-medium">
                                      Strategy
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(correctionPlan).map(
                                    ([step, details], index) => (
                                      <tr
                                        key={step}
                                        className={
                                          index % 2 === 0
                                            ? "bg-white"
                                            : "bg-[#FAFAFC]"
                                        }
                                      >
                                        <td className="px-3 py-2 align-top font-medium text-[#130B30]">
                                          {step}
                                        </td>
                                        <td className="px-3 py-2 align-top text-[#423C59]">
                                          {details.fertilizer_type ?? "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top text-[#423C59]">
                                          {details.application_rate_kg_ha ??
                                            "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top text-[#423C59]">
                                          {details.timing_dosage ?? "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top text-[#423C59]">
                                          {details.strategy ?? "—"}
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      )}

                      {/* New format: free-form markdown-ish text (**bold**, * bullets) */}
                      {!correctionPlan && recommendationMarkdown && (
                        <FormattedRecommendation
                          text={recommendationMarkdown}
                        />
                      )}
                    </div>

                    {/* Suitable crops */}
                    <div className="rounded-lg border border-[#E5E3EE] bg-[#FAFAFC] p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="size-2.5 rounded-lg bg-blue-500" />
                        <h6 className="font-medium text-slate-800">
                          Suitable crops
                        </h6>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendations?.suitable_crops
                          ?.split(",")
                          .map((crop) => crop.trim())
                          .filter(Boolean)
                          .map((crop) => (
                            <span
                              key={crop}
                              className="rounded-full bg-[#E7F2ED] px-3 py-1 text-xs font-medium text-[#0A814A]"
                            >
                              {crop}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------- Disclaimer ---------- */}
                <div className="mt-6 rounded-lg border border-dashed border-[#D8D5E8] bg-[#FAFAFC] p-4">
                  <p className="text-xs leading-relaxed text-[#8A849C]">
                    <span className="font-medium text-[#615C74]">
                      Disclaimer:
                    </span>{" "}
                    These results and AI-generated recommendations are provided
                    for informational purposes only and are based on the soil
                    sample data submitted. They do not constitute professional
                    agronomic, environmental, or financial advice, and yields,
                    costs, and outcomes may vary based on local conditions,
                    weather, and farming practices. Please consult a certified
                    agronomist or soil scientist before making significant
                    farming decisions.
                  </p>
                </div>
              </div>
            </section>
            <div className="py-5">
              <Button variant="primary" onClick={() => handleDownload()}>
                Download Result
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
