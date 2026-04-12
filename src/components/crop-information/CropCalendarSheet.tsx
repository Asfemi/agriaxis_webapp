import { useState } from "react";
import { useGetCropInformationAnalysis } from "@/api/crop-information";
import { ChevronLeft, MapPin } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CropCalendarAnalysisData {
  id: string;
  test_id: string;
  subsection: string;
  status: string;
  name: string;
  farm_name: string;
  org_farm_id: string;
  external_farm_id: string;
  payment: string | null;
  amount_paid: string | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
  error_message: string | null;
  data: {
    crop_calendar_report: string;
    crop_type: string;
    gps_coordinates: string;
  };
}

// ── Calendar config ───────────────────────────────────────────────────────────

const YEAR = 2026;

const MONTHS = [
  { month: 3, label: "March",  days: 31 },
  { month: 4, label: "April",  days: 30 },
  { month: 5, label: "May",    days: 31 },
  { month: 6, label: "June",   days: 30 },
  { month: 7, label: "July",   days: 31 },
];

interface StageConfig {
  name: string;
  start: [number, number];
  end:   [number, number];
  bg: string;
  border: string;
  text: string;
  dotBg: string;
  activity: string;
  conditions: string;
  advisory: string;
}

const STAGES: StageConfig[] = [
  {
    name: "Land preparation",
    start: [3, 15], end: [4, 5],
    bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-900", dotBg: "bg-amber-400",
    activity: "Clearing, primary tillage (ploughing/ridging), secondary tillage (harrowing), fertilizer application.",
    conditions: "Moist soil after initial light rains, friable soil texture.",
    advisory: "Initiate land preparation with the first few showers to soften soil. Aim for a fine seedbed. Incorporate organic matter or basal fertilizer during tillage.",
  },
  {
    name: "Planting window",
    start: [4, 1], end: [4, 30],
    bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-900", dotBg: "bg-emerald-500",
    activity: "Optimal sowing Apr 1–15. Extended/acceptable period Apr 16–30. Use certified maize seeds.",
    conditions: "Consistent soil moisture after reliable rainfall onset, soil temperature >18°C.",
    advisory: "Plant immediately after sufficient rainfall for good germination. Use spacing 75×25 cm or 90×30 cm, depth 3–5 cm. Early planting maximises yield potential.",
  },
  {
    name: "Germination & establishment",
    start: [4, 8], end: [4, 29],
    bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-900", dotBg: "bg-teal-500",
    activity: "Emergence of seedlings, initial root and shoot development.",
    conditions: "Adequate soil moisture, warm temperatures 25–32°C, good seed-to-soil contact.",
    advisory: "Monitor for uniform emergence. Replant gaps within 7–10 days of planting. Protect from armyworms and early weed competition.",
  },
  {
    name: "Vegetative growth",
    start: [4, 30], end: [5, 30],
    bg: "bg-green-100", border: "border-green-300", text: "text-green-900", dotBg: "bg-green-500",
    activity: "Rapid leaf and stalk development, nutrient uptake.",
    conditions: "Ample soil moisture, good nutrient supply, warm temperatures.",
    advisory: "Implement first weeding 2–3 weeks after planting and side-dress nitrogen fertilizer. Ensure good drainage to prevent waterlogging.",
  },
  {
    name: "Flowering / reproductive",
    start: [5, 31], end: [6, 25],
    bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-900", dotBg: "bg-rose-500",
    activity: "Tasseling, silking, pollination, and initial kernel development.",
    conditions: "High soil moisture, moderate temperatures, clear skies for pollination.",
    advisory: "Most critical stage for yield determination. Avoid any moisture stress. Scout for stem borers, fall armyworm, and diseases like rusts and blight.",
  },
  {
    name: "Maturity & harvest",
    start: [6, 26], end: [7, 30],
    bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-900", dotBg: "bg-orange-400",
    activity: "Grain filling, physiological maturity, drying down of cobs and stalks.",
    conditions: "Sufficient moisture early, drier conditions later for harvest.",
    advisory: "Harvest when grains are firm at ~18–20% moisture. Complete before heavy August rains to prevent spoilage. Watch for black layer formation.",
  },
];

// ── Date helpers ──────────────────────────────────────────────────────────────

function toDate(month: number, day: number) {
  return new Date(YEAR, month - 1, day);
}

function generateWeeks() {
  const seasonStart = toDate(3, 1);
  const seasonEnd   = toDate(7, 31);
  const weeks: { start: Date; end: Date }[] = [];
  let cursor = new Date(seasonStart);
  while (cursor <= seasonEnd) {
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > seasonEnd) weekEnd.setTime(seasonEnd.getTime());
    weeks.push({ start: new Date(cursor), end: new Date(weekEnd) });
    cursor.setDate(cursor.getDate() + 7);
  }
  return weeks;
}

const WEEKS = generateWeeks();
const MONTH_SHORT = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function stageBandInCell(
  stage: StageConfig,
  week: { start: Date; end: Date },
  month: { month: number; days: number },
): { left: number; width: number; showLabel: boolean } | null {
  const ss = toDate(stage.start[0], stage.start[1]);
  const se = toDate(stage.end[0],   stage.end[1]);
  const ms = toDate(month.month, 1);
  const me = toDate(month.month, month.days);
  const DAY = 86400000;

  const cellStart = new Date(Math.max(week.start.getTime(), ms.getTime()));
  const cellEnd   = new Date(Math.min(week.end.getTime(),   me.getTime()));
  const stStart   = new Date(Math.max(ss.getTime(), cellStart.getTime()));
  const stEnd     = new Date(Math.min(se.getTime(), cellEnd.getTime()));

  if (stStart > stEnd) return null;

  const cellSpan = (cellEnd.getTime() - cellStart.getTime()) / DAY + 1;
  const fromLeft = (stStart.getTime() - cellStart.getTime()) / DAY;
  const duration = (stEnd.getTime()   - stStart.getTime())   / DAY + 1;

  return {
    left:      (fromLeft / cellSpan) * 100,
    width:     (duration / cellSpan) * 100,
    showLabel: stStart.getTime() === ss.getTime(),
  };
}

// ── Stage detail panel ────────────────────────────────────────────────────────

const StageDetail: React.FC<{ stage: StageConfig }> = ({ stage }) => (
  <div className="overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white">
    <div className="flex items-center gap-3 border-b border-[#EBEBEB] px-4 py-3">
      <div className={`size-2.5 shrink-0 rounded-full ${stage.dotBg}`} />
      <span className="flex-1 text-sm font-semibold text-[#130B30]">{stage.name}</span>
      <span className="text-xs text-[#9E99B0]">
        {MONTH_SHORT[stage.start[0]]} {stage.start[1]} – {MONTH_SHORT[stage.end[0]]} {stage.end[1]}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3 p-4">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#9E99B0]">Activity</p>
        <p className="text-xs leading-relaxed text-[#423C59]">{stage.activity}</p>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#9E99B0]">Key conditions</p>
        <p className="text-xs leading-relaxed text-[#423C59]">{stage.conditions}</p>
      </div>
    </div>
    <div className={`mx-4 mb-4 rounded-xl border px-3 py-2.5 ${stage.bg} ${stage.border}`}>
      <p className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${stage.text}`}>Advisory</p>
      <p className={`text-xs leading-relaxed ${stage.text}`}>{stage.advisory}</p>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export const CropCalendarSheet: React.FC<{
  onClose: () => void;
  analysisData?: CropCalendarAnalysisData;
  id?: string;
}> = ({ onClose, analysisData, id }) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const { data, isLoading } = useGetCropInformationAnalysis(
    id ?? "",
    !!analysisData,
  );

  const calendarData: CropCalendarAnalysisData =
    analysisData ?? (data as CropCalendarAnalysisData);

  if (!id && !analysisData) {
    return (
      <section className="fixed inset-0 z-40 bg-black/70 p-4">
        <section className="z-50 ml-auto h-auto w-3/4 max-w-xl rounded-[1.25rem] bg-white p-8">
          <header className="mb-10 flex items-center gap-3.5">
            <button onClick={onClose} className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]">
              <ChevronLeft size={20} />
            </button>
          </header>
          <div className="flex items-center justify-center pb-10">
            <p className="rounded-xl bg-[#D10000] px-2 py-1.5 text-xs text-white">Failed to pass data</p>
          </div>
        </section>
      </section>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
        <div className="rounded-2xl bg-white px-8 py-6">
          <p className="animate-pulse text-sm font-medium text-gray-500">Loading crop calendar…</p>
        </div>
      </div>
    );
  }

  const cropType  = calendarData?.data?.crop_type ?? "";
  const coords    = calendarData?.data?.gps_coordinates ?? "";
  const updatedAt = calendarData?.updated_at
    ? new Date(calendarData.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto flex h-full max-h-[96vh] w-[90%] max-w-3xl flex-col overflow-hidden rounded-[1.25rem] bg-[#F9F8FC]">

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
              <span className="text-xs font-medium text-[#8C87A0]">{calendarData.test_id}</span>
              {coords && (
                <span className="flex items-center gap-1 text-xs text-[#B0ABBB]">
                  <MapPin size={10} />
                  {coords}
                </span>
              )}
              {updatedAt && <span className="text-xs text-[#B0ABBB]">Updated {updatedAt}</span>}
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {STAGES.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedStage(i)}
                className="flex items-center gap-1.5 text-xs text-[#615C74] transition-opacity hover:opacity-70"
              >
                <span className={`inline-block size-2.5 rounded-[3px] ${s.dotBg}`} />
                {s.name}
              </button>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white">

            {/* Month header row */}
            <div
              className="grid border-b border-[#EBEBEB]"
              style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}
            >
              <div className="border-r border-[#EBEBEB] px-3 py-2 text-[11px] font-medium text-[#9E99B0]">
                Week
              </div>
              {MONTHS.map((m) => (
                <div
                  key={m.month}
                  className="border-r border-[#EBEBEB] px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-[#615C74] last:border-r-0"
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Week rows */}
            {WEEKS.map((week, wi) => (
              <div
                key={wi}
                className="grid border-b border-[#EBEBEB] last:border-b-0"
                style={{ gridTemplateColumns: "80px repeat(5, 1fr)", minHeight: 34 }}
              >
                {/* Week label */}
                <div className="flex items-center border-r border-[#EBEBEB] px-3 py-1 text-[11px] text-[#9E99B0]">
                  {week.start.toLocaleString("en", { month: "short" })} {week.start.getDate()}
                </div>

                {/* Month cells */}
                {MONTHS.map((m) => {
                  const bands = STAGES.flatMap((stage, si) => {
                    const b = stageBandInCell(stage, week, m);
                    if (!b) return [];
                    return [{ ...b, stage, si }];
                  });

                  return (
                    <div
                      key={m.month}
                      className="relative border-r border-[#EBEBEB] last:border-r-0"
                      style={{ minHeight: 34 }}
                    >
                      {bands.map((b, bi) => (
                        <button
                          key={bi}
                          onClick={() => setSelectedStage(b.si)}
                          className={`absolute bottom-1 top-1 flex items-center overflow-hidden rounded border px-1.5 text-[11px] font-medium transition-opacity hover:opacity-75 ${b.stage.bg} ${b.stage.border} ${b.stage.text}`}
                          style={{ left: `${b.left}%`, width: `${b.width}%` }}
                        >
                          {b.showLabel && (
                            <span className="truncate">{b.stage.name}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Stage detail */}
          <StageDetail stage={STAGES[selectedStage]} />

          {/* Farmer advisory */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Farmer advisory
            </p>
            <p className="text-xs leading-relaxed text-amber-900">
              Plant maize between April 1–15 for optimal yields, aligning with reliable first rains.
              Consider early-maturing varieties if planting after April 20. Always use certified seeds,
              ensure proper spacing, and implement good weed and moisture management practices.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
};