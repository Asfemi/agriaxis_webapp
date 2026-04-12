import { useGetCropInformationAnalysis } from "@/api/crop-information";
import type { CropCalendarAnalysisData } from "@/models/crop-information.model";
import {
  ChevronLeft,
  Shovel,
  Sprout,
  Leaf,
  Flower2,
  Wheat,
  CalendarDays,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface CalendarRow {
  stage: string;
  activity: string;
  period: string;
  conditions: string;
  advisory: string;
}

// ── Markdown table parser ────────────────────────────────────────────────────

function parseCropCalendarTable(markdown: string): CalendarRow[] {
  const lines = markdown
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !l.match(/^\|[\s:|-]+\|/));

  if (lines.length < 2) return [];

  return lines.slice(1).map((row) => {
    const cols = row
      .split("|")
      .map((c) => c.replace(/\*\*/g, "").trim())
      .filter((c) => c.length > 0);
    return {
      stage: cols[0] ?? "",
      activity: cols[1] ?? "",
      period: cols[2] ?? "",
      conditions: cols[3] ?? "",
      advisory: cols[4] ?? "",
    };
  });
}

function extractFarmerAdvisory(report: string): string {
  const match = report.match(/\*\*Farmer Advisory Summary:\*\*\s*([\s\S]+)/);
  return match ? match[1].trim() : "";
}

function extractIntroSummary(report: string): string {
  const lines = report.split("\n").filter((l) => l.trim().length > 0);
  const summaryLines: string[] = [];
  for (const line of lines) {
    if (line.trim().startsWith("|") || line.trim().startsWith("*") || line.trim().startsWith("-") || line.trim().startsWith("---")) break;
    if (!line.includes("agronomist") && !line.includes("analyzed")) {
      summaryLines.push(line.replace(/\*\*/g, "").trim());
    }
  }
  return summaryLines.filter(Boolean).slice(0, 3).join(" ");
}

// ── Stage config ─────────────────────────────────────────────────────────────

const STAGE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; dot: string; border: string }
> = {
  "land preparation": {
    icon: <Shovel size={15} />,
    color: "text-amber-800",
    bg: "bg-amber-50",
    dot: "bg-amber-400",
    border: "border-amber-200",
  },
  planting: {
    icon: <Sprout size={15} />,
    color: "text-green-800",
    bg: "bg-green-50",
    dot: "bg-green-500",
    border: "border-green-200",
  },
  germination: {
    icon: <Leaf size={15} />,
    color: "text-teal-800",
    bg: "bg-teal-50",
    dot: "bg-teal-500",
    border: "border-teal-200",
  },
  vegetative: {
    icon: <Leaf size={15} />,
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  flowering: {
    icon: <Flower2 size={15} />,
    color: "text-rose-800",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
    border: "border-rose-200",
  },
  maturity: {
    icon: <Wheat size={15} />,
    color: "text-orange-800",
    bg: "bg-orange-50",
    dot: "bg-orange-400",
    border: "border-orange-200",
  },
  harvest: {
    icon: <Wheat size={15} />,
    color: "text-orange-800",
    bg: "bg-orange-50",
    dot: "bg-orange-400",
    border: "border-orange-200",
  },
};

function getStageConfig(stage: string) {
  const key = Object.keys(STAGE_CONFIG).find((k) =>
    stage.toLowerCase().includes(k),
  );
  return (
    STAGE_CONFIG[key ?? ""] ?? {
      icon: <CalendarDays size={15} />,
      color: "text-slate-700",
      bg: "bg-slate-50",
      dot: "bg-slate-400",
      border: "border-slate-200",
    }
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

const StageCard: React.FC<{ row: CalendarRow; index: number; total: number }> = ({
  row,
  index,
  total,
}) => {
  const cfg = getStageConfig(row.stage);
  const isLast = index === total - 1;

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${cfg.border} ${cfg.bg} ${cfg.color}`}
        >
          {cfg.icon}
        </div>
        {!isLast && (
          <div className="mt-1 w-px flex-1 border-l border-dashed border-[#D8D3E8]" />
        )}
      </div>

      {/* Card */}
      <div className={`mb-4 min-w-0 flex-1 rounded-2xl border ${cfg.border} bg-white p-4 shadow-sm`}>
        {/* Stage name + period */}
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h4 className={`text-sm font-bold leading-tight ${cfg.color}`}>
            {row.stage}
          </h4>
          {row.period && (
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}
            >
              <CalendarDays size={10} />
              {row.period}
            </span>
          )}
        </div>

        {/* Activity */}
        {row.activity && (
          <p className="mb-3 text-xs leading-relaxed text-[#423C59]">
            {row.activity}
          </p>
        )}

        {/* Conditions */}
        {row.conditions && (
          <div className="mb-2 flex gap-2">
            <Info size={13} className="mt-0.5 shrink-0 text-sky-500" />
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9E99B0]">
                Key conditions
              </p>
              <p className="text-xs leading-relaxed text-[#55506A]">
                {row.conditions}
              </p>
            </div>
          </div>
        )}

        {/* Advisory */}
        {row.advisory && (
          <div className="mt-2 rounded-xl bg-[#F4F1FA] px-3 py-2.5">
            <div className="mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-[#7C3AED]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                Advisory
              </p>
            </div>
            <p className="text-xs leading-relaxed text-[#3D2D6E]">
              {row.advisory}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export const CropCalendarSheet: React.FC<{
  onClose: () => void;
  analysisData?: CropCalendarAnalysisData;
  id?: string;
}> = ({ onClose, analysisData, id }) => {
  const { data, isLoading } = useGetCropInformationAnalysis(
    id ?? "",
    !!analysisData,
  );

  const calendarData: CropCalendarAnalysisData =
    analysisData ?? (data as CropCalendarAnalysisData);

  // ── Guard: no data ─────────────────────────────────────────────────────────
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
            Loading crop calendar…
          </p>
        </div>
      </div>
    );
  }

  const report = calendarData?.data?.crop_calendar_report ?? "";
  const rows = parseCropCalendarTable(report);
  const farmerAdvisory = extractFarmerAdvisory(report);
  const introSummary = extractIntroSummary(report);
  const cropType = calendarData?.data?.crop_type ?? "";
  const coords = calendarData?.data?.gps_coordinates ?? "";
  const updatedAt = calendarData?.updated_at
    ? new Date(calendarData.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

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
              <h4 className="text-lg font-bold leading-tight text-[#130B30]">
                {calendarData.farm_name}
              </h4>
              <span className="rounded-full bg-[#F0EAF8] px-2.5 py-0.5 text-xs font-semibold capitalize text-[#7C3AED]">
                {cropType}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-700">
                {calendarData.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-[#8C87A0]">
                <span className="font-medium">{calendarData.test_id}</span>
              </span>
              {coords && (
                <span className="flex items-center gap-1 text-xs text-[#B0ABBB]">
                  <MapPin size={10} />
                  {coords}
                </span>
              )}
            </div>
            {updatedAt && (
              <p className="mt-0.5 text-xs text-[#B0ABBB]">
                Updated {updatedAt}
              </p>
            )}
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">

          {/* Intro context pill */}
          {introSummary && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <Info size={13} className="shrink-0 text-sky-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  Regional context
                </span>
              </div>
              <p className="text-xs leading-relaxed text-sky-900">
                {introSummary}
              </p>
            </div>
          )}

          {/* Season label */}
          {rows.length > 0 && (
            <div className="flex items-center gap-3 px-1">
              <div className="h-px flex-1 bg-[#E8E3F0]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9E99B0]">
                First season calendar
              </span>
              <div className="h-px flex-1 bg-[#E8E3F0]" />
            </div>
          )}

          {/* Stage timeline */}
          {rows.length > 0 ? (
            <div className="px-1">
              {rows.map((row, i) => (
                <StageCard key={i} row={row} index={i} total={rows.length} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E0DAF0] bg-white">
              <p className="text-sm text-gray-400">No calendar stages found</p>
            </div>
          )}

          {/* Farmer advisory */}
          {farmerAdvisory && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-amber-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Farmer advisory summary
                </span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                {farmerAdvisory}
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};