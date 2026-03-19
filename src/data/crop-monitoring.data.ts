import  { fakerEN_NG as faker } from "@faker-js/faker";
import type { CropMonitoringAnalysis } from "@/models/crop-monitoring.model";

const STATUSES: Array<'processing' | 'completed'> = ['processing', 'completed'];

/**
 * @deprecated
 * @param count 
 * @returns 
 */
export const generateCropMonitoringAnalysis = (count = 5): CropMonitoringAnalysis[] => {
  return Array.from({ length: count }, () => ({
    id: `R/${faker.string.alphanumeric(5).toUpperCase()}`,
    farm_name: faker.company.name(),
    status: faker.helpers.arrayElement(STATUSES),
    payment: faker.number.int({ min: 5000, max: 25000 }),
    date: faker.date
      .past({ years: 1 })
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  }));
};
