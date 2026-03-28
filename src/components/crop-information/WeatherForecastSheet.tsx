import { ChevronLeft, Cloud, Droplet, Wind } from "lucide-react";

const hourlyForecast = [
  { time: "00:00", temparature: 18.2, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
  { time: "01:00", temparature: 17.5, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
  { time: "02:00", temparature: 17.1, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/116.png" },
  { time: "03:00", temparature: 16.8, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/116.png" },
  { time: "04:00", temparature: 16.5, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/122.png" },
  { time: "05:00", temparature: 16.2, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/143.png" },
  { time: "06:00", temparature: 17.0, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/116.png" },
  { time: "07:00", temparature: 18.5, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "08:00", temparature: 20.1, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "09:00", temparature: 22.4, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "10:00", temparature: 24.8, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "11:00", temparature: 26.5, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "12:00", temparature: 28.2, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "13:00", temparature: 29.5, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "14:00", temparature: 30.1, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "15:00", temparature: 29.8, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/113.png" },
  { time: "16:00", temparature: 28.4, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/122.png" },
  { time: "17:00", temparature: 26.7, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/122.png" },
  { time: "18:00", temparature: 24.5, icon_url: "https://cdn.weatherapi.com/weather/64x64/day/116.png" },
  { time: "19:00", temparature: 22.1, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
  { time: "20:00", temparature: 20.8, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
  { time: "21:00", temparature: 19.9, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
  { time: "22:00", temparature: 19.2, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
  { time: "23:00", temparature: 18.7, icon_url: "https://cdn.weatherapi.com/weather/64x64/night/113.png" },
];

export const WeatherForecastSheet: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <section className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity">
      <section className="z-50 ml-auto h-auto w-3/4 max-w-xl overflow-y-auto rounded-[1.25rem] bg-[#F8F4F4]">
        <section className="p-6 pb-5 space-y-4">
          <div className="relative h-76.75 rounded-2xl bg-slate-800 p-6">
            <header className="mb-7.5 flex items-center gap-3.5 justify-between">
              <button
                onClick={onClose}
                className="grid size-7 place-items-center rounded-full bg-[#E8E8E871]"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <p className="text-sm text-white">Daily</p>
            </header>
            <div className="font-neue mx-auto mb-7 text-center text-sm text-white">
              <p className="mb-1">Perfect day for weeding - No rainfall</p>
              <p className="text-[3.5rem] font-semibold text-white">24°c</p>
              <p className="-mt-2">27 March, 2026</p>
            </div>
            <div className="mx-auto flex w-fit gap-6 text-sm text-white">
              <div className="flex flex-col items-center">
                <Wind size={14} />
                <p>Wind speed</p>
                <p>12km/h</p>
              </div>
              <div className="flex flex-col items-center">
                <Cloud size={14} />
                <p>Chance of rain</p>
                <p>12km/h</p>
              </div>
              <div className="flex flex-col items-center">
                <Droplet size={14} />
                <p>Humidity</p>
                <p>70%</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar">
            {hourlyForecast.map((entry) => (<ForecastTime time={entry.time} temparature={entry.temparature} icon_url={entry.icon_url} />))} 
          </div>
          <WeekForecast />
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
    <div className="flex flex-col items-start gap-3 rounded-xl border border-[#E8E8E8] bg-white px-5 pb-4 pt-3 hover:border-[#8EC5AC] hover:bg-[#E7F2ED]">
      <span className="text-sm text-[#615C74]">{time}</span>
      <span className="font-neue text-lg text-[#130B30]">
        {Math.floor(temparature)}°c
      </span>
      <img src={icon_url} width={64} height={64} />
    </div>
  );
};

const WeekForecast = () => {
  const forecastData = [
    { day: "Mon", icon: "cloud", temp: 24, desc: "Cloudy" },
    { day: "Mon", icon: "cloud", temp: 24, desc: "Cloudy" },
    { day: "Tue", icon: "moon", temp: 28, desc: "Rainy" },
    { day: "Wed", icon: "rain", temp: 22, desc: "Sunny" },
    { day: "Mon", icon: "cloud", temp: 24, desc: "Cloudy" },
    { day: "Tue", icon: "moon", temp: 28, desc: "Rainy" },
    { day: "Wed", icon: "rain", temp: 22, desc: "Sunny" },
  ];

  return (
    <div className="rounded-xl border border-[#E8E8E8] bg-white px-3 py-4">
      <h5 className="font-neue mb-3 text-sm text-[#130B30]">
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
          {forecastData.map((item, index) => (
            <tr key={index}>
              <td className="py-2">{item.day}</td>
              <td className="py-2">
                <i>{item.icon}</i>
              </td>
              <td className="py-2">{item.temp}°c</td>
              <td className="py-2">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
