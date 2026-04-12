import { useState } from "react";
import { useGetCropInformationAnalysis } from "@/api/crop-information";
import { ChevronLeft, MapPin, AlertCircle } from "lucide-react";
import type { CropCalendarAnalysisData } from "@/models/crop-information.model";

interface ParsedStage {
  name: string;
  /** [year, month (1-based), day] */
  start: [number, number, number];
  end:   [number, number, number];
  activity: string;
  conditions: string;
  advisory: string;
  /** Assigned after parsing, based on position */
  colorIndex: number;
}

// ── Colour palette (cycles by index) ─────────────────────────────────────────

const STAGE_COLORS = [
  { bg: "bg-amber-100",   border: "border-amber-300",   text: "text-amber-900",   dot: "bg-amber-400"   },
  { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-900", dot: "bg-emerald-500" },
  { bg: "bg-teal-100",    border: "border-teal-300",    text: "text-teal-900",    dot: "bg-teal-500"    },
  { bg: "bg-green-100",   border: "border-green-300",   text: "text-green-900",   dot: "bg-green-500"   },
  { bg: "bg-rose-100",    border: "border-rose-300",    text: "text-rose-900",    dot: "bg-rose-500"    },
  { bg: "bg-orange-100",  border: "border-orange-300",  text: "text-orange-900",  dot: "bg-orange-400"  },
  { bg: "bg-purple-100",  border: "border-purple-300",  text: "text-purple-900",  dot: "bg-purple-400"  },
  { bg: "bg-sky-100",     border: "border-sky-300",     text: "text-sky-900",     dot: "bg-sky-400"     },
];

function stageColor(index: number) {
  return STAGE_COLORS[index % STAGE_COLORS.length];
}

// ── Date parsing ──────────────────────────────────────────────────────────────

const MONTH_NAMES: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8,
  sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Attempt to parse a date string like "April 1", "Apr 8", "March 15 – April 5"
 * Returns [year, month, day] or null.
 * Falls back to the first date in a range if a range is detected.
 * yearHint: the year to assume (derived from created_at).
 */
function parseDateString(raw: string, yearHint: number): [number, number, number] | null {
  const cleaned = raw.replace(/\*\*/g, "").trim();

  // Try "Month D" or "Month DD"
  const simple = cleaned.match(/([A-Za-z]+)\s+(\d{1,2})/);
  if (simple) {
    const month = MONTH_NAMES[simple[1].toLowerCase()];
    const day   = parseInt(simple[2], 10);
    if (month && day >= 1 && day <= 31) return [yearHint, month, day];
  }
  return null;
}

/**
 * Parse a period cell that may contain one date, a range ("April 1 – April 15"),
 * or sub-ranges separated by line breaks / semicolons.
 * Returns { start, end } as [year, month, day] tuples.
 */
function parsePeriodCell(
  cell: string,
  yearHint: number,
): { start: [number, number, number]; end: [number, number, number] } | null {
  const cleaned = cell.replace(/\*\*/g, "").replace(/<br\s*\/?>/gi, " ").trim();

  // Split on "–", "—", " to ", " - "
  const parts = cleaned.split(/\s*[–—]\s*|\s+to\s+|\s+-\s+/);

  const dates = parts
    .map((p) => parseDateString(p.trim(), yearHint))
    .filter(Boolean) as [number, number, number][];

  if (dates.length >= 2) return { start: dates[0], end: dates[dates.length - 1] };
  if (dates.length === 1) return { start: dates[0], end: dates[0] };
  return null;
}

// ── Markdown report parser ────────────────────────────────────────────────────

function cleanCell(s: string) {
  return s.replace(/\*\*/g, "").replace(/<br\s*\/?>/gi, " ").trim();
}

function parseReportRows(report: string): string[][] {
  return report
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !l.match(/^\|[\s:|-]+\|/))
    .slice(1) // skip header
    .map((row) =>
      row
        .split("|")
        .filter((_, i, arr) => i > 0 && i < arr.length - 1)
        .map(cleanCell),
    );
}

function extractFarmerAdvisory(report: string): string {
  // Matches lines after "Farmer Advisory Summary:" or "Advisory Summary:"
  const match = report.match(/(?:Farmer\s+)?Advisory\s+Summary[:\s]+([^#\n][\s\S]+?)(?:\n\n|\n#|$)/i);
  return match ? match[1].replace(/\*\*/g, "").trim() : "";
}

/**
 * Build ParsedStage[] from the raw report markdown.
 * Table columns expected: Stage | Activity | Period | Conditions | Advisory
 * Column order is detected by scanning the header row.
 */
function parseStages(report: string, yearHint: number): ParsedStage[] {
  // Detect header column positions
  const headerLine = report
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith("|") && !l.match(/^\|[\s:|-]+\|/));

  if (!headerLine) return [];

  const headers = headerLine
    .split("|")
    .filter((_, i, arr) => i > 0 && i < arr.length - 1)
    .map((h) => h.replace(/\*\*/g, "").trim().toLowerCase());

  const col = (keywords: string[]) =>
    headers.findIndex((h) => keywords.some((k) => h.includes(k)));

  const iStage      = col(["stage", "growth"]);
  const iActivity   = col(["activity", "action", "task"]);
  const iPeriod     = col(["period", "date", "timing", "recommended"]);
  const iConditions = col(["condition", "key", "required"]);
  const iAdvisory   = col(["advisory", "note", "recommendation"]);

  const rows = parseReportRows(report);

  const stages: ParsedStage[] = [];

  rows.forEach((cols, idx) => {
    const name       = iStage      >= 0 ? cleanCell(cols[iStage]      ?? "") : `Stage ${idx + 1}`;
    const activity   = iActivity   >= 0 ? cleanCell(cols[iActivity]   ?? "") : "";
    const periodRaw  = iPeriod     >= 0 ? cleanCell(cols[iPeriod]     ?? "") : "";
    const conditions = iConditions >= 0 ? cleanCell(cols[iConditions] ?? "") : "";
    const advisory   = iAdvisory   >= 0 ? cleanCell(cols[iAdvisory]   ?? "") : "";

    const dates = parsePeriodCell(periodRaw, yearHint);
    if (!dates) return; // skip rows we can't place on the calendar

    stages.push({
      name,
      start: dates.start,
      end:   dates.end,
      activity,
      conditions,
      advisory,
      colorIndex: idx,
    });
  });

  return stages;
}

// ── Calendar helpers ──────────────────────────────────────────────────────────

function toDate([y, m, d]: [number, number, number]) {
  return new Date(y, m - 1, d);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

interface CalMonth { year: number; month: number; label: string; days: number }
interface CalWeek  { start: Date; end: Date }

/** Derive the month columns from the stages themselves. */
function buildMonthColumns(stages: ParsedStage[]): CalMonth[] {
  if (stages.length === 0) return [];

  let minDate = toDate(stages[0].start);
  let maxDate = toDate(stages[0].end);
  stages.forEach((s) => {
    const sd = toDate(s.start);
    const ed = toDate(s.end);
    if (sd < minDate) minDate = sd;
    if (ed > maxDate) maxDate = ed;
  });

  const months: CalMonth[] = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const end    = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    months.push({
      year:  y,
      month: m,
      label: cursor.toLocaleString("en", { month: "long" }),
      days:  daysInMonth(y, m),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

function buildWeeks(months: CalMonth[]): CalWeek[] {
  if (months.length === 0) return [];
  const first   = months[0];
  const last    = months[months.length - 1];
  const start   = new Date(first.year, first.month - 1, 1);
  const end     = new Date(last.year,  last.month  - 1, last.days);
  const weeks: CalWeek[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const weekEnd = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > end) weekEnd.setTime(end.getTime());
    weeks.push({ start: new Date(cursor), end: new Date(weekEnd) });
    cursor.setDate(cursor.getDate() + 7);
  }
  return weeks;
}

function stageBandInCell(
  stage: ParsedStage,
  week: CalWeek,
  col: CalMonth,
): { left: number; width: number; showLabel: boolean } | null {
  const ss = toDate(stage.start);
  const se = toDate(stage.end);
  const ms = new Date(col.year, col.month - 1, 1);
  const me = new Date(col.year, col.month - 1, col.days);
  const DAY = 86400000;

  const cellStart = new Date(Math.max(week.start.getTime(), ms.getTime()));
  const cellEnd   = new Date(Math.min(week.end.getTime(),   me.getTime()));
  const stStart   = new Date(Math.max(ss.getTime(), cellStart.getTime()));
  const stEnd     = new Date(Math.min(se.getTime(), cellEnd.getTime()));

  if (stStart > stEnd) return null;

  const cellSpan = (cellEnd.getTime()  - cellStart.getTime()) / DAY + 1;
  const fromLeft = (stStart.getTime()  - cellStart.getTime()) / DAY;
  const duration = (stEnd.getTime()    - stStart.getTime())   / DAY + 1;

  return {
    left:      (fromLeft / cellSpan) * 100,
    width:     (duration / cellSpan) * 100,
    showLabel: stStart.getTime() === ss.getTime(),
  };
}

// ── Stage detail panel ────────────────────────────────────────────────────────

const MONTH_SHORT = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const StageDetail: React.FC<{ stage: ParsedStage }> = ({ stage }) => {
  const c = stageColor(stage.colorIndex);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white">
      <div className="flex items-center gap-3 border-b border-[#EBEBEB] px-4 py-3">
        <div className={`size-2.5 shrink-0 rounded-full ${c.dot}`} />
        <span className="flex-1 text-sm font-semibold text-[#130B30]">{stage.name}</span>
        <span className="text-xs text-[#9E99B0]">
          {MONTH_SHORT[stage.start[1]]} {stage.start[2]} – {MONTH_SHORT[stage.end[1]]} {stage.end[2]}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {stage.activity && (
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#9E99B0]">Activity</p>
            <p className="text-xs leading-relaxed text-[#423C59]">{stage.activity}</p>
          </div>
        )}
        {stage.conditions && (
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#9E99B0]">Key conditions</p>
            <p className="text-xs leading-relaxed text-[#423C59]">{stage.conditions}</p>
          </div>
        )}
      </div>
      {stage.advisory && (
        <div className={`mx-4 mb-4 rounded-xl border px-3 py-2.5 ${c.bg} ${c.border}`}>
          <p className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${c.text}`}>Advisory</p>
          <p className={`text-xs leading-relaxed ${c.text}`}>{stage.advisory}</p>
        </div>
      )}
    </div>
  );
};

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

  const report  = calendarData?.data?.crop_calendar_report ?? "";
  const cropType = calendarData?.data?.crop_type ?? "";
  const coords   = calendarData?.data?.gps_coordinates ?? "";
  const updatedAt = calendarData?.updated_at
    ? new Date(calendarData.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";

  // Derive year from created_at so the calendar is always anchored to the right season
  const yearHint = calendarData?.created_at
    ? new Date(calendarData.created_at).getFullYear()
    : new Date().getFullYear();

  const stages         = parseStages(report, yearHint);
  const farmerAdvisory = extractFarmerAdvisory(report);
  const months         = buildMonthColumns(stages);
  const weeks          = buildWeeks(months);

  const activeStage = stages[selectedStage] ?? null;

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto flex h-full max-h-[96vh] w-[90%] max-w-5xl flex-col overflow-hidden rounded-[1.25rem] bg-[#F9F8FC]">

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
              {cropType && (
                <span className="rounded-full bg-[#F0EAF8] px-2.5 py-0.5 text-xs font-semibold capitalize text-[#7C3AED]">
                  {cropType}
                </span>
              )}
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

          {stages.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#E0DAF0] bg-white">
              <p className="text-sm text-gray-400">No calendar stages could be parsed from this report.</p>
            </div>
          ) : (
            <>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {stages.map((s, i) => {
                  const c = stageColor(s.colorIndex);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedStage(i)}
                      className="flex items-center gap-1.5 text-xs text-[#615C74] transition-opacity hover:opacity-70"
                    >
                      <span className={`inline-block size-2.5 rounded-[3px] ${c.dot}`} />
                      {s.name}
                    </button>
                  );
                })}
              </div>

              {/* Calendar grid */}
              <div className="overflow-x-auto rounded-2xl border border-[#EBEBEB] bg-white">
                <div style={{ minWidth: `${80 + months.length * 120}px` }}>

                  {/* Month header */}
                  <div
                    className="grid border-b border-[#EBEBEB]"
                    style={{ gridTemplateColumns: `80px repeat(${months.length}, 1fr)` }}
                  >
                    <div className="border-r border-[#EBEBEB] px-3 py-2 text-[11px] font-medium text-[#9E99B0]">
                      Week
                    </div>
                    {months.map((m) => (
                      <div
                        key={`${m.year}-${m.month}`}
                        className="border-r border-[#EBEBEB] px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-[#615C74] last:border-r-0"
                      >
                        {m.label}
                      </div>
                    ))}
                  </div>

                  {/* Week rows */}
                  {weeks.map((week, wi) => (
                    <div
                      key={wi}
                      className="grid border-b border-[#EBEBEB] last:border-b-0"
                      style={{ gridTemplateColumns: `80px repeat(${months.length}, 1fr)`, minHeight: 34 }}
                    >
                      <div className="flex items-center border-r border-[#EBEBEB] px-3 py-1 text-[11px] text-[#9E99B0]">
                        {week.start.toLocaleString("en", { month: "short" })} {week.start.getDate()}
                      </div>

                      {months.map((m) => {
                        const bands = stages.flatMap((stage, si) => {
                          const b = stageBandInCell(stage, week, m);
                          if (!b) return [];
                          return [{ ...b, stage, si }];
                        });

                        return (
                          <div
                            key={`${m.year}-${m.month}`}
                            className="relative border-r border-[#EBEBEB] last:border-r-0"
                            style={{ minHeight: 34 }}
                          >
                            {bands.map((b, bi) => {
                              const c = stageColor(b.stage.colorIndex);
                              return (
                                <button
                                  key={bi}
                                  onClick={() => setSelectedStage(b.si)}
                                  className={`absolute bottom-1 top-1 flex items-center overflow-hidden rounded border px-1.5 text-[11px] font-medium transition-opacity hover:opacity-75 ${c.bg} ${c.border} ${c.text}`}
                                  style={{ left: `${b.left}%`, width: `${b.width}%` }}
                                >
                                  {b.showLabel && (
                                    <span className="truncate">{b.stage.name}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage detail */}
              {activeStage && <StageDetail stage={activeStage} />}
            </>
          )}

          {/* Farmer advisory */}
          {farmerAdvisory && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <AlertCircle size={13} className="shrink-0 text-amber-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Farmer advisory
                </p>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">{farmerAdvisory}</p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};