import { useGetCropInformationAnalysis } from "@/api/crop-information";
import {
  formatDateEpoch,
  formatTimeEpoch,
  formatWeekdayEpoch,
} from "@/lib/utils";
import type {
  WeatherAnalysisData,
  WeatherForecast,
} from "@/models/crop-information.model";
import { ChevronLeft, Compass, Droplet, Wind } from "lucide-react";

export const WeatherForecastSheet: React.FC<{
  id?: string;
  onClose: () => void;
  analysisData?: WeatherAnalysisData;
}> = ({ id, onClose, analysisData }) => {
  const { data, isLoading } = useGetCropInformationAnalysis(
    id ?? "",
    !!analysisData,
  );

  const weatherData: WeatherAnalysisData =
    analysisData ?? (data as WeatherAnalysisData);

  if (!id && !analysisData) {
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
          </header>
          <section className="size-full">
            <div className="flex h-full flex-col items-center justify-center pb-10">
              <div>
                <p className="rounded-xl bg-[#D10000] px-2 py-1.5 text-xs text-white">
                  Failed to pass data
                </p>
              </div>
            </div>
          </section>
        </section>
      </section>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-auto max-h-[96vh] w-3/4 max-w-xl overflow-y-auto rounded-[1.25rem] bg-[#F8F4F4]">
        <section className="space-y-4 p-6 pb-5">
          <div className="relative h-76.75 rounded-2xl bg-slate-800 p-6">
            <header className="mb-7.5 flex items-center justify-between gap-3.5">
              <button
                onClick={onClose}
                className="grid size-7 place-items-center rounded-full bg-[#E8E8E871]"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <p className="text-sm text-white">Today</p>
            </header>
            <div className="font-neue mx-auto mb-7 text-center text-sm text-white">
              <p className="mb-1">
                {weatherData.data.weather_now.condition.text}
              </p>
              <p className="text-[3.5rem] font-semibold text-white">
                {weatherData.data.weather_now.temp_c}°c
              </p>
              <p className="-mt-2">
                {formatDateEpoch(
                  weatherData.data.weather_now.last_updated_epoch,
                )}
              </p>
            </div>
            <div className="mx-auto flex w-fit gap-6 text-sm text-white">
              <div className="flex flex-col items-center">
                <Wind size={14} />
                <p>Wind speed</p>
                <p>{weatherData.data.weather_now.wind_kph}km/h</p>
              </div>
              <div className="flex flex-col items-center">
                <Compass size={14} />
                <p>Wind direction</p>
                <p>{weatherData.data.weather_now.wind_dir}</p>
              </div>
              <div className="flex flex-col items-center">
                <Droplet size={14} />
                <p>Humidity</p>
                <p>{Math.floor(weatherData.data.weather_now.humidity)}</p>
              </div>
            </div>
          </div>
          <div className="hide-scrollbar flex w-full items-center gap-3 overflow-x-auto">
            {weatherData.data.weather_forecast[0].hour.map((entry) => (
              <ForecastTime
                time={formatTimeEpoch(entry.time_epoch)}
                temparature={Math.floor(entry.temp_c)}
                icon_url={`https:${entry.condition.icon}`}
              />
            ))}
          </div>
          <WeekForecast data={weatherData.data.weather_forecast} />
        </section>
      </section>
    </section>
  );
};

const ForecastTime = ({
  time,
  temparature,
  icon_url,
}: {
  time: string;
  temparature: number;
  icon_url: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-[#E8E8E8] bg-white px-5 pt-3 pb-4 hover:border-[#8EC5AC] hover:bg-[#E7F2ED]">
      <span className="text-sm text-[#615C74]">{time}</span>
      <span className="font-neue text-lg text-[#130B30]">
        {Math.floor(temparature)}°c
      </span>
      <img src={icon_url} width={64} height={64} />
    </div>
  );
};

const WeekForecast = ({ data }: { data: WeatherForecast[] }) => {
  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white px-3 py-4">
      <h5 className="font-neue mb-5 text-[#130B30]">
        This week weather forecast
      </h5>
      <table className="w-full text-left">
        <thead>
          <tr className="font-neue text-[0.6875rem] font-semibold text-[#423C59]">
            <th className="pb-2 font-semibold">Day</th>
            <th className="pb-2 font-semibold">Sign</th>
            <th className="pb-2 font-semibold">Temperature</th>
            <th className="pb-2 font-semibold">Forecast</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[#130B30]">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="py-2">{formatWeekdayEpoch(item.date_epoch)}</td>
              <td className="py-2">
                <img
                  src={`https:${item.day.condition.icon}`}
                  width={32}
                  height={32}
                />
              </td>
              <td className="py-2">{item.day.avgtemp_c}°c</td>
              <td className="py-2">{item.day.condition.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
