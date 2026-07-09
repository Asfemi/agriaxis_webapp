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
    common_names: string[];
    type: string;
    description: string;
    severity: string;
    spreading: string;
    symptoms?: Record<string, string>;
    treatment: string[] | {
      prevention?: string[];
      chemical_treatment?: string[];
      biological_treatment?: string[];
    };
  }[];
};

export type DiseaseDetectionHistory = {
  id: string;
  user_id: string;
  organisation_id: string;
  org_farm_id: string;
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

export type YieldEstimation = {
  id: string;
  user_id: string;
  organisation_id: string;
  org_farm_id: string;
  farm_name: string;
  name: string;
  crop_type: string;
  latitude: string;
  longitude: string;
  land_size: string;
  land_unit: string;
  region: string;
  year: number;
  created_at: string;
  status: string;
  payment: null;
  data: {
    crop: string;
    location: string;
    land_size: {
      hectares: string;
      acres: string;
    };
    yield_estimate_per_hectare: {
      low: string;
      moderate: string;
      high: string;
    };
    yield_estimate_per_acre: {
      low: string;
      moderate: string;
      high: string;
    };
    estimated_total_output: {
      low: string;
      moderate: string;
      high: string;
    };
    yield_unit: string;
    climate_risks: string[];
    recommendations: string[];
    confidence_level: string;
    disclaimer: string;
  };
};
