import type { FarmStatus, FarmStatValues } from "@/models/farm-status.model";

interface FarmStatusCardProps {
  title: string;
  status: FarmStatus;
  stats: FarmStatValues;
}

interface StatusStyle {
  label: string;
  badge: string;
  valueText: string;
}

const STATUS_STYLES: Record<FarmStatus, StatusStyle> = {
  healthy: {
    label: "Healthy",
    badge: "bg-[#E7F2ED] text-[#0A814A]",
    valueText: "text-[#0A814A]",
  },
  "no data": {
    label: "No data",
    badge: "bg-[#E7E7EA] text-[#423C59]",
    valueText: "text-[#423C59]",
  },
  "empty": {
    label: "No data",
    badge: "bg-[#E7E7EA] text-[#423C59]",
    valueText: "text-[#423C59]",
  },
  average: {
    label: "Average",
    badge: "bg-[#FFEEBE] text-[#674A00]",
    valueText: "text-[#D9A728]",
  },
  poor: {
    label: "Poor",
    badge: "bg-[#E623130D] text-[#E61504]",
    valueText: "text-[#E61504]",
  },
};

const FarmStatusCard: React.FC<FarmStatusCardProps> = ({
  title,
  status,
  stats,
}) => {
  const styles = STATUS_STYLES[status];

  return (
    <div className="w-full rounded-2xl border border-[#E8E8E8] bg-white px-4 py-6 shadow-lg">
      <div className="mb-4 flex size-9.5 items-center justify-center rounded-lg border border-green-500/30 bg-green-50">
        <img
          src="/assets/icons/farm.svg"
          alt="Farm"
          width={17.5}
          height={15.64}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-neue text-lg font-semibold text-[#130B30]">
            {title}
          </h3>
          <p className="text-[#615C74]">Data from last test</p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Stat
          label="Soil PH"
          value={stats.soilPh?.toLocaleString() || "N/A"}
          valueClass={styles.valueText}
        />
        <Stat
          label="Moisture"
          value={stats.moisture?.toLocaleString() || "N/A"}
          valueClass={styles.valueText}
        />
        <Stat
          label="Nutrient"
          value={stats.nutrient?.toLocaleString() || "N/A"}
          valueClass={styles.valueText}
        />
        <Stat label="Size" value={`${stats.size} Hectares`} />
      </div>
    </div>
  );
};

interface StatProps {
  label: string;
  value: string;
  valueClass?: string;
}

const Stat: React.FC<StatProps> = ({ label, value, valueClass }) => {
  return (
    <div className="rounded-xl bg-[#F3F6F8] p-3">
      <p className="text-sm text-[#615C74]">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
};

export { FarmStatusCard };
