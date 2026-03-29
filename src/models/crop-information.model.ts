export type CropInformationAnalytics = {
  id: string;
  test_id: string;
  farm_name: string;
  status: "completed" | "failed";
  amount_paid: null | number;
  date: string;
  subsection: "weather_information" | "climate_information" | "crop_calendar";
};

export interface CropInformationDashboardResponse {
  total_tests: number;
  pending_tests: number;
  completed_tests: number;
  failed_tests: number;
  weather_information: {
    number_of_tests: number;
    pending_tests: number;
    completed_tests: number;
    analytics_history: CropInformationAnalytics[];
  };
  climate_information: {
    number_of_tests: number;
    pending_tests: number;
    completed_tests: number;
    analytics_history: CropInformationAnalytics[];
  };
  crop_calendar: {
    number_of_tests: number;
    pending_tests: number;
    completed_tests: number;
    analytics_history: CropInformationAnalytics[];
  };
  pagination: number;
}

export type WeatherDashboardRes = {
  number_of_tests: number;
  pending_tests: number;
  completed_tests: number;
  analytics_history: CropInformationAnalytics[];
};

export type ClimateDashboardRes = {
  number_of_tests: number;
  pending_tests: number;
  completed_tests: number;
  analytics_history: CropInformationAnalytics[];
};

export type CropCalendarDashboardRes = {
  number_of_tests: number;
  pending_tests: number;
  completed_tests: number;
  analytics_history: CropInformationAnalytics[];
};

export type WeatherForecast = {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
    is_moon_up: number;
    is_sun_up: number;
  };
  hour: ForecastHour[];
};

export type ForecastHour = {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  snow_cm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
  short_rad: number;
  diff_rad: number;
  dni: number;
  gti: number;
};

export type WeatherAnalysisData = {
  id: string;
  test_id: string;
  subsection: string;
  status: string;
  name: string;
  farm_name: string;
  org_farm_id: number;
  external_farm_id: string;
  payment: null | string;
  amount_paid: null | string;
  currency: null | string;
  created_at: string;
  updated_at: string;
  error_message: null | string;
  data: {
    weather_now: {
      last_updated_epoch: number;
      last_updated: string;
      temp_c: number;
      temp_f: number;
      is_day: number;
      condition: {
        text: string;
        icon: string;
        code: number;
      };
      wind_mph: number;
      wind_kph: number;
      wind_degree: number;
      wind_dir: string;
      pressure_mb: number;
      pressure_in: number;
      precip_mm: number;
      precip_in: number;
      humidity: number;
      cloud: number;
      feelslike_c: number;
      feelslike_f: number;
      windchill_c: number;
      windchill_f: number;
      heatindex_c: number;
      heatindex_f: number;
      dewpoint_c: number;
      dewpoint_f: number;
      vis_km: number;
      vis_miles: number;
      uv: number;
      gust_mph: number;
      gust_kph: number;
      short_rad: number;
      diff_rad: number;
      dni: number;
      gti: number;
    };
    weather_forecast: WeatherForecast[];
  };
};

export type ClimateAnalysisData = {
  id: string;
  test_id: string;
  subsection: string;
  status: string;
  name: string;
  farm_name: string;
  org_farm_id: number;
  external_farm_id: string;
  payment: null | string;
  amount_paid: null | string;
  currency: null | string;
  created_at: string;
  updated_at: string;
  error_message: null | string;
  data: {
    chance_of_rainfall: {
      time: string;
      chance: number;
      amount: number;
    }[];
  };
};
