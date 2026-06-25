import { useGetCropInformationAnalysis } from "@/api/crop-information";
import type { UpdatedClimateAnalysisData } from "@/models/crop-information.model";
import {
  ChevronLeft,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  CloudRain,
  Sun,
  CalendarDays,
  ShieldAlert,
} from "lucide-react";

// ── Markdown table parser ────────────────────────────────────────────────────

interface ClimateRow {
  parameter: string;
  forecast: string;
  period: string;
  impact: string;
  action: string;
}

function parseMarkdownTable(markdown: string): ClimateRow[] {
  const lines = markdown
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !l.match(/^\|[\s:|-]+\|/));

  if (lines.length < 2) return [];

  // skip header row
  const rows = lines.slice(1);
  return rows.map((row) => {
    const cols = row
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    return {
      parameter: cols[0] ?? "",
      forecast: cols[1] ?? "",
      period: cols[2] ?? "",
      impact: cols[3] ?? "",
      action: cols[4] ?? "",
    };
  });
}

function extractAdvisorySummary(report: string): string {
  const match = report.match(
    /\*\*Actionable Advisory Summary:\*\*\s*([\s\S]+)/,
  );
  return match ? match[1].trim() : "";
}

// ── Risk badge helper ────────────────────────────────────────────────────────

function getRiskStyle(text: string): { bg: string; text: string; dot: string } {
  const lower = text.toLowerCase();
  if (lower.includes("high"))
    return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" };
  if (lower.includes("medium") || lower.includes("moderate"))
    return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" };
  if (lower.includes("low"))
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    };
  return { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
}

function paramIcon(param: string) {
  const p = param.toLowerCase();
  if (p.includes("flood"))
    return <CloudRain size={15} className="text-blue-500" />;
  if (p.includes("drought"))
    return <Sun size={15} className="text-amber-500" />;
  if (p.includes("temperature") || p.includes("heat"))
    return <Thermometer size={15} className="text-red-500" />;
  if (p.includes("rain"))
    return <Droplets size={15} className="text-sky-500" />;
  if (p.includes("dry spell"))
    return <Wind size={15} className="text-orange-400" />;
  if (p.includes("onset") || p.includes("cessation") || p.includes("season"))
    return <CalendarDays size={15} className="text-violet-500" />;
  return <AlertTriangle size={15} className="text-slate-400" />;
}

function calculateRiskPercentage(rows: ClimateRow[]): number {
  if (rows.length === 0) return 0;

  let riskPoints = 0;
  rows.forEach((row) => {
    const text = (row.forecast + " " + row.parameter).toLowerCase();
    if (text.includes("high") || text.includes("severe")) riskPoints += 25;
    else if (text.includes("medium") || text.includes("moderate"))
      riskPoints += 10;
  });

  return Math.min(riskPoints, 100);
}

// ── Main component ───────────────────────────────────────────────────────────

export const ClimateInformationSheet: React.FC<{
  onClose: () => void;
  analysisData?: UpdatedClimateAnalysisData;
  id?: string;
}> = ({ onClose, analysisData, id }) => {
  const { data, isLoading } = useGetCropInformationAnalysis(
    id ?? "",
    !!analysisData,
  );

  const climateData: UpdatedClimateAnalysisData =
    analysisData ?? (data as UpdatedClimateAnalysisData);

  // ── Guard: no data ────────────────────────────────────────────────────────
  if (!id && !analysisData) {
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
        <div className="rounded-2xl bg-white px-8 py-6">
          <p className="animate-pulse text-sm font-medium text-gray-500">
            Loading climate data…
          </p>
        </div>
      </div>
    );
  }

  const report = climateData?.data?.climate_report ?? "";
  const rows = parseMarkdownTable(report);
  const advisory = extractAdvisorySummary(report);
  const cropType = climateData?.data?.crop_type ?? "";
  const coords = climateData?.data?.gps_coordinates ?? "";
  const updatedAt = climateData?.updated_at
    ? new Date(climateData.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  const riskPercent = calculateRiskPercentage(rows);
  const riskColor =
    riskPercent > 60
      ? "bg-red-500"
      : riskPercent > 30
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto flex h-full max-h-[96vh] w-3/4 max-w-xl flex-col overflow-hidden rounded-[1.25rem] bg-[#F9F8FC]">
        {/* ── Header ── */}
        <header className="flex shrink-0 items-start gap-3.5 border-b border-[#EBEBEB] bg-white px-8 py-5">
          <button
            onClick={onClose}
            className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#E8E8E8] transition-colors hover:bg-[#DADADF]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-lg leading-tight font-bold text-[#130B30]">
                {climateData.farm_name}
              </h4>
              <span className="rounded-full bg-[#F0EAF8] px-2.5 py-0.5 text-xs font-semibold text-[#7C3AED] capitalize">
                {cropType}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 capitalize">
                {climateData.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#8C87A0]">
              {climateData.test_id} · {coords}
            </p>
            {updatedAt && (
              <p className="mt-0.5 text-xs text-[#B0ABBB]">
                Updated {updatedAt}
              </p>
            )}
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {/* Advisory banner */}
          {advisory && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-amber-600" />
                <span className="text-xs font-bold tracking-wide text-amber-700 uppercase">
                  Actionable Advisory
                </span>
              </div>
              <p className="text-sm leading-relaxed text-amber-900">
                {advisory}
              </p>
            </div>
          )}

          {/* Climate parameter cards */}
          {rows.length > 0 ? (
            <div className="space-y-3">
              <h3 className="px-1 text-sm font-bold text-[#130B30]">
                Climate Parameters
              </h3>
              {rows.map((row, i) => {
                const riskStyle = getRiskStyle(row.forecast);
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#EBEBEB] bg-white p-4 shadow-sm"
                  >
                    {/* Parameter name */}
                    <div className="mb-3 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">
                        {paramIcon(row.parameter)}
                      </span>
                      <h4 className="text-sm leading-snug font-semibold text-[#130B30]">
                        {row.parameter}
                      </h4>
                    </div>

                    {/* Forecast + Period row */}
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${riskStyle.bg} ${riskStyle.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${riskStyle.dot}`}
                        />
                        {row.forecast}
                      </span>
                      {row.period && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          <CalendarDays size={11} />
                          {row.period}
                        </span>
                      )}
                    </div>

                    {/* Impact */}
                    {row.impact && (
                      <div className="mb-2">
                        <p className="mb-0.5 text-[10px] font-bold tracking-wider text-[#9E99B0] uppercase">
                          Impact on crop
                        </p>
                        <p className="text-xs leading-relaxed text-[#423C59]">
                          {row.impact}
                        </p>
                      </div>
                    )}

                    {/* Recommended action */}
                    {row.action && (
                      <div className="rounded-xl bg-[#F4F1FA] px-3 py-2">
                        <p className="mb-0.5 text-[10px] font-bold tracking-wider text-[#7C3AED] uppercase">
                          Recommended Action
                        </p>
                        <p className="text-xs leading-relaxed text-[#3D2D6E]">
                          {row.action}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              <footer className="shrink-0 border-t border-[#EBEBEB] bg-white px-8 py-5 rounded-xl">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert
                      size={16}
                      className={
                        riskPercent > 60 ? "text-red-500" : "text-slate-400"
                      }
                    />
                    <span className="text-xs font-bold tracking-wider text-[#130B30] uppercase">
                      Overall Climate Risk
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${riskPercent > 60 ? "text-red-600" : "text-[#130B30]"}`}
                  >
                    {riskPercent}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-1000 ${riskColor}`}
                    style={{ width: `${riskPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-[#8C87A0]">
                  Based on {rows.length} analyzed parameters for the current
                  window.
                </p>
              </footer>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E0DAF0] bg-white">
              <p className="text-sm text-gray-400">
                No climate parameters found
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

// TODO: Walk through, and refactor if need be
