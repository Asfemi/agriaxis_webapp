import type { YieldEstimation } from "@/models/crop-monitoring.model";
import {
  ChevronLeft,
  CloudRain,
  Droplets,
  Thermometer,
  Bug,
  AlertTriangle,
} from "lucide-react";

const RISK_ICONS = [CloudRain, Droplets, Thermometer, Bug, AlertTriangle];

export const YieldEstimationSheet: React.FC<{
  onClose: () => void;
  estimationData?: YieldEstimation;
  id?: string;
}> = ({ onClose, estimationData, id }) => {
  /* ── Guard: no data ── */
  if (!id && !estimationData) {
    return (
      <section className="fixed inset-0 z-40 bg-black/70 p-4">
        <section className="z-50 ml-auto h-auto w-3/4 max-w-xl rounded-[1.25rem] bg-white p-8">
          <header className="mb-10 flex items-center gap-3.5">
            <button
              onClick={onClose}
              className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
            >
              <ChevronLeft size={20} />
            </button>
          </header>
          <div className="flex items-center justify-center pb-10">
            <p className="rounded-xl bg-[#D10000] px-2 py-1.5 text-xs text-white">
              Failed to pass data
            </p>
          </div>
        </section>
      </section>
    );
  }

  const d = estimationData?.data;
  const crop = d?.crop ?? estimationData?.crop_type ?? "";

  const location = d?.location ?? estimationData?.region ?? "";
  const hectares = d?.land_size?.hectares ?? estimationData?.land_size ?? "–";
  const acres = d?.land_size?.acres ?? "–";
  const yph = d?.yield_estimate_per_hectare;
  const totalOutput = d?.estimated_total_output;
  const unit = d?.yield_unit ?? "tons";
  const confidence = d?.confidence_level ?? "–";
  const risks = d?.climate_risks ?? [];
  const recs = d?.recommendations ?? [];
  const disclaimer = d?.disclaimer ?? "";
  const year = estimationData?.year;
  const farmName = estimationData?.farm_name ?? "";
  const status = estimationData?.status ?? "";

  /* Bar widths for the three scenarios */
  const maxYph = parseFloat(yph?.high ?? "6") || 6;
  const barLow = Math.round((parseFloat(yph?.low ?? "0") / maxYph) * 100);
  const barMod = Math.round((parseFloat(yph?.moderate ?? "0") / maxYph) * 100);
  const barHigh = 100;

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto flex h-full max-h-[96vh] w-3/4 max-w-xl flex-col overflow-hidden rounded-[1.25rem] bg-[#F9F8FC]">
        {/* ── Header ── */}
        <header className="flex shrink-0 flex-col gap-1 border-b border-[#EBEBEB] bg-white px-7 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#E8E8E8] transition-colors hover:bg-[#DADADF]"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#111]">
                {estimationData?.name ?? `${farmName} – ${crop} Yield Estimate`}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#888]">
                <span>{farmName}</span>
                {year && (
                  <>
                    <span>·</span>
                    <span>{year}</span>
                  </>
                )}
                {status && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-600 uppercase">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Crop hero band ── */}
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] px-7 py-5">
          <div className="flex items-center gap-3.5">
            <div className="grid size-[52px] shrink-0 place-items-center rounded-2xl bg-white/15">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22V12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 12C12 12 7 10 5 5C9 4 13 7 12 12Z"
                  fill="white"
                  fillOpacity="0.85"
                />
                <path
                  d="M12 12C12 12 17 10 19 5C15 4 11 7 12 12Z"
                  fill="white"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white capitalize">
                {crop}
              </p>
              <p className="mt-0.5 text-[11px] text-white/70">📍 {location}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-white">{hectares}</p>
            <p className="text-[10px] tracking-wide text-white/65 uppercase">
              Hectares
            </p>
            <p className="text-[10px] text-white/50">{acres} acres</p>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {/* Yield per hectare */}
          {yph && (
            <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
              <p className="mb-4 text-[11px] font-bold tracking-[0.7px] text-[#999] uppercase">
                Yield estimate · per hectare
              </p>
              {(
                [
                  {
                    label: "Low",
                    val: yph.low,
                    pct: barLow,
                    color: "bg-red-300",
                  },
                  {
                    label: "Moderate",
                    val: yph.moderate,
                    pct: barMod,
                    color: "bg-amber-300",
                  },
                  {
                    label: "High",
                    val: yph.high,
                    pct: barHigh,
                    color: "bg-emerald-300",
                  },
                ] as const
              ).map(({ label, val, pct, color }) => (
                <div
                  key={label}
                  className="mb-2.5 flex items-center gap-3 last:mb-0"
                >
                  <span className="w-16 shrink-0 text-[11px] font-semibold text-[#555]">
                    {label}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#F4F4F4]">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-[12px] font-bold text-[#222]">
                    {val} t/ha
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Total output */}
          {totalOutput && (
            <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
              <p className="mb-4 text-[11px] font-bold tracking-[0.7px] text-[#999] uppercase">
                Estimated total output
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    {
                      label: "Low",
                      val: totalOutput.low,
                      bg: "bg-red-50",
                      tagBg: "bg-red-100",
                      tagText: "text-red-600",
                      numText: "text-red-600",
                    },
                    {
                      label: "Moderate",
                      val: totalOutput.moderate,
                      bg: "bg-amber-50",
                      tagBg: "bg-amber-100",
                      tagText: "text-amber-700",
                      numText: "text-amber-600",
                    },
                    {
                      label: "High",
                      val: totalOutput.high,
                      bg: "bg-emerald-50",
                      tagBg: "bg-emerald-100",
                      tagText: "text-emerald-700",
                      numText: "text-emerald-600",
                    },
                  ] as const
                ).map(({ label, val, bg, tagBg, tagText, numText }) => (
                  <div
                    key={label}
                    className={`rounded-xl p-3 text-center ${bg}`}
                  >
                    <span
                      className={`mb-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${tagBg} ${tagText}`}
                    >
                      {label}
                    </span>
                    <p
                      className={`text-xl leading-none font-extrabold ${numText}`}
                    >
                      {parseFloat(val).toFixed(1)}
                    </p>
                    <p className="mt-1 text-[10px] text-[#888]">{unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence */}
          {confidence &&
            (() => {
              const dotIdx = confidence.indexOf(".");
              const hasDetail = dotIdx !== -1 && dotIdx < confidence.length - 1;
              const confidenceLabel = hasDetail
                ? confidence.slice(0, dotIdx).trim()
                : confidence.trim();
              const confidenceDetail = hasDetail
                ? confidence.slice(dotIdx + 1).trim()
                : null;
              const barWidth = confidenceLabel.toLowerCase().includes("high")
                ? "75%"
                : "50%";
              return (
                <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
                  <p className="mb-3 text-[11px] font-bold tracking-[0.7px] text-[#999] uppercase">
                    Confidence level
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F4F4F4]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        style={{ width: barWidth }}
                      />
                    </div>
                    <span className="shrink-0 text-[12px] font-bold text-emerald-600">
                      {confidenceLabel}
                    </span>
                  </div>
                  {confidenceDetail && (
                    <p className="mt-3 border-t border-[#F4F4F4] pt-3 text-[11px] leading-relaxed text-[#777]">
                      {confidenceDetail}
                    </p>
                  )}
                </div>
              );
            })()}

          {/* Climate risks */}
          {risks.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[1px] text-[#BBB] uppercase">
                  Climate Risks
                </span>
                <div className="h-px flex-1 bg-[#E8E8E8]" />
              </div>
              <div className="rounded-2xl border border-[#F0F0F0] bg-white px-5 py-3">
                {risks.map((risk, i) => (
                  <div
                    key={i}
                    className="flex gap-2.5 border-b border-[#F4F4F4] py-3 last:border-b-0 last:pb-0"
                  >
                    <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-amber-50">
                      {(() => {
                        const Icon = RISK_ICONS[i % RISK_ICONS.length];
                        return <Icon size={15} className="text-amber-500" />;
                      })()}
                    </div>
                    <p className="pt-0.5 text-[12px] leading-relaxed text-[#444]">
                      {risk}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[1px] text-[#BBB] uppercase">
                  Recommendations
                </span>
                <div className="h-px flex-1 bg-[#E8E8E8]" />
              </div>
              <div className="rounded-2xl border border-[#F0F0F0] bg-white px-5 py-3">
                {recs.map((rec, i) => (
                  <div
                    key={i}
                    className="flex gap-2.5 border-b border-[#F4F4F4] py-3 last:border-b-0 last:pb-0"
                  >
                    <div className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-violet-100 text-[10px] font-extrabold text-violet-700">
                      {i + 1}
                    </div>
                    <p className="pt-0.5 text-[12px] leading-relaxed text-[#444]">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Disclaimer */}
          {disclaimer && (
            <div className="rounded-xl border-l-4 border-[#DDD] bg-[#F8F8F8] px-4 py-3.5 text-[11px] leading-relaxed text-[#888]">
              ⚠️ {disclaimer}
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

// TODO: Walk through, and refactor if need be
