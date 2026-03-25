export interface CropMonitoringAnalysis {
  test_id: string;
  farm_name: string;
  status: "processing" | "completed";
  payment: number | null;
  date: string;
}

export interface CropMonitoringDashboardResponse {
  total_farms_monitored: number;
  pending_farms: number;
  completed_farms: number;
  pest_disease_monitoring: PestMonitoringDashboard;
  crop_health: CropHealthDashboard;
  pagination: number;
}

export interface CropHealthDashboard {
  total_no_of_crop_tests: number;
  pending_crop_tests: number;
  completed_crop_tests: number;
  analytics_history: CropMonitoringAnalysis[];
}

export interface PestMonitoringDashboard {
  total_no_of_farms_monitored: number;
  pending_farms_to_be_monitored: number;
  completed_farm_monitoring: number;
  analytics_history: CropMonitoringAnalysis[];
}

export type CropMonitoringDiseaseDetectResponse = {
  images: string[];
  predictions: {
    id: string;
    name: string;
    scientific_name: string;
    probability: number;
    common_names: [];
    type: string;
    description: string;
    severity: string;
    spreading: string;
    treatment: [];
  }[];
};

export type DiseaseDetectionHistory = {
  id: string;
  user_id: string;
  organisation_id: number;
  org_farm_id: number;
  farm_name: string;
  status: "processing" | "completed";
  payment: number | null;
  name: string;
  datetime: string;
  data: CropMonitoringDiseaseDetectResponse;
};

export type CropHealthHistory = {
  id: string;
  created_at: string;
  user_id: string;
  organisation_id: number;
  org_farm_id: number;
  name: string;
  coordinates: string;
  farm_id: string;
  image_png: string;
  image_tiff: string;
};
