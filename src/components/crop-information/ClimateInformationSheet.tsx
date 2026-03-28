import { ChevronLeft } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const ClimateInformationSheet: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-auto w-3/4 max-w-xl overflow-y-auto rounded-[1.25rem] bg-white p-8">
        <header className="mb-10 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col gap-2">
            <h5 className="font-neue text-xl font-bold text-[#130B30]">
              R/CI001
            </h5>
            <h6 className="text-[#423C59]">Corn plantation</h6>
          </div>
        </header>
        <section className="relative mx-10 h-11/12 pb-5 overflow-y-auto">
          <RainfallChart />
        </section>
      </section>
    </section>
  );
};

const chance_of_rainfall = [
  {
    time: "11:00pm",
    chance: 0,
    amount: 0,
  },
  {
    time: "12:00am",
    chance: 77,
    amount: 0.01,
  },
  {
    time: "01:00am",
    chance: 0,
    amount: 0,
  },
];

const RainfallChart = () => {
  const chartData = chance_of_rainfall;

  return (
    <div className="w-full h-200 rounded-xl border border-[#E8E8E8] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-bold text-[#130B30]">
          Rainfall Analysis
        </h3>
        <p className="text-xs text-[#615C74]">
          Blue bars: Amount (mm) | Shaded area: Probability (%)
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="#F0F0F0"
          />

          {/* X-Axis 1: Rain Amount (0 to 1mm) */}
          <XAxis type="number" hide domain={[0, "dataMax + 0.1"]} />

          {/* X-Axis 2: Probability (0 to 100) - Hidden but used for Area scaling */}
          <XAxis
            type="number"
            dataKey="chance"
            hide
            domain={[0, 100]}
            xAxisId="chanceAxis"
          />

          <YAxis
            dataKey="time"
            type="category"
            width={80}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#615C74", fontWeight: 500 }}
          />

          <Tooltip
            cursor={{ fill: "#F8FAFC" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { time, chance, amount } = payload[0].payload;
                return (
                  <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-xl">
                    <p className="mb-1 font-bold text-[#130B30]">{time}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                      <p className="text-sm text-gray-600">
                        Amount: <b>{amount} mm</b>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#8EC5AC]" />
                      <p className="text-sm text-gray-600">
                        Chance: <b>{chance}%</b>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* BACKGROUND AREA: Represents "Chance" */}
          {/* We use xAxisId to ensure it scales to 100% of the chart width */}
          <Area
            xAxisId="chanceAxis"
            dataKey="chance"
            stroke="#8EC5AC"
            fill="#E7F2ED"
            strokeWidth={1}
            type="monotone"
            connectNulls
          />

          {/* FOREGROUND BARS: Represents "Amount" */}
          <Bar
            dataKey="amount"
            fill="#3B82F6"
            barSize={12}
            radius={[0, 2, 2, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
