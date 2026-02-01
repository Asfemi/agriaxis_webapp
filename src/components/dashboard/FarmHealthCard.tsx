import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import FarmIconHealthy from "/assets/icons/farm.svg";
import FarmIconAverage from "/assets/icons/farm-yellow.svg";
import FarmIconPoor from "/assets/icons/farm-red.svg";
import type { DashboardResponse } from "@/models/farm.model";

interface FarmData {
  name: "Healthy" | "Average" | "Poor";
  value: number;
  fill: string;
  percentage: string;
  [key: string]: any;
}

interface FarmHealthCardProps {
  data: FarmData[];
  totalFarms: number;
}

const iconMap: { [key in FarmData["name"]]: string } = {
  Healthy: FarmIconHealthy,
  Average: FarmIconAverage,
  Poor: FarmIconPoor,
};

const colorMap = {
  "#17AD49": { border: "border-[#0A814A]", bg: "bg-[#E7F2ED]" },
  "#FFC107": { border: "border-[#D9A728]", bg: "bg-[#FFEEBE]" },
  "#E91E63": { border: "border-[#E61504]", bg: "bg-[#E615040D]" },
} as const;

const FarmHealthCard: React.FC<FarmHealthCardProps> = ({
  data,
  totalFarms,
}) => {
  const width = 300;
  const height = 150;
  const outerRadius = 70;
  const innerRadius = 55;

  const CenterText: React.FC = () => (
    <div
      className="font-neue pointer-events-none absolute top-1/2 left-1/2 text-center"
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="text-[2rem] font-bold text-[#130B30]">{totalFarms}</div>
      <div className="text-sm text-[#615C74]">Total Farms</div>
    </div>
  );

  const FarmHealthLegend: React.FC = () => (
    <div className="min-w-[150px] pl-5">
      {data.map((entry, index) => {
        const colors = colorMap[entry.fill as keyof typeof colorMap];

        return (
          <div
            key={`legend-${index}`}
            className="mb-2 flex items-center text-gray-800"
          >
            <div className="mr-3 flex items-center">
              <div
                className={`grid h-7 w-7 place-items-center rounded-md border ${colors.border} ${colors.bg}`}
              >
                <img
                  src={iconMap[entry.name]}
                  alt={`${entry.name} farm icon`}
                  width={18}
                  height={16}
                />
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold">{entry.name}</div>
              <div className="mt-0.5 flex items-baseline justify-between">
                <span className="mr-2 text-lg font-bold">{entry.value}</span>
                <span className="text-base text-gray-600">
                  {entry.percentage}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative w-full rounded-lg border border-gray-200 p-5 shadow-md">
      <header className="font-neue mb-8">
        <h5 className="text-lg font-semibold text-[#130B30]">Farm health</h5>
        <h6 className="text-[#615C74]">over of all farm health status</h6>
      </header>

      <div className="flex items-center">
        <div className="relative grid grow place-items-center">
          <PieChart width={width / 2} height={height}>
            <Pie
              data={data}
              cx={width / 4}
              cy={height / 2}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>

          <CenterText />
        </div>

        <FarmHealthLegend />
      </div>
    </div>
  );
};

const FarmHealthCardWrapper: React.FC<{ data: DashboardResponse }> = ({
  data,
}) => {
  const totalFarms = data.no_of_farm;

  const chartData: FarmData[] = [
    {
      name: "Healthy",
      value: data.farm_health_summary.healthy,
      fill: "#17AD49",
      percentage:
        totalFarms > 0
          ? `${Math.round((data.farm_health_summary.healthy / totalFarms) * 100)}%`
          : "0%",
    },
    {
      name: "Average",
      value: data.farm_health_summary.average,
      fill: "#FFC107",
      percentage:
        totalFarms > 0
          ? `${Math.round((data.farm_health_summary.average / totalFarms) * 100)}%`
          : "0%",
    },
    {
      name: "Poor",
      value: data.farm_health_summary.poor,
      fill: "#E91E63",
      percentage:
        totalFarms > 0
          ? `${Math.round((data.farm_health_summary.poor / totalFarms) * 100)}%`
          : "0%",
    },
  ];

  return <FarmHealthCard data={chartData} totalFarms={totalFarms} />;
};

export default FarmHealthCardWrapper;
