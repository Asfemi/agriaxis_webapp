export type CropInformationAnalytics = {
  id: string;
  test_id: string;
  farm_name: string;
  status: "completed" | "failed";
  amount_paid: null | string;
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
