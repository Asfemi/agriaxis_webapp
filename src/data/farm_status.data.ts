import type {
  FarmStatus,
  FarmStatValues,
  FarmStatusData,
} from "@/models/farm-status.model";
import  { fakerEN_NG as faker } from "@faker-js/faker";

const STATUS_POOL: FarmStatus[] = ["healthy", "no data", "average", "poor"];

function generateStats(status: FarmStatus): FarmStatValues {
  switch (status) {
    case "healthy":
      return {
        soilPh: faker.number
          .float({ min: 6.5, max: 7.2, fractionDigits: 1 })
          ,
        moisture: faker.number.int({ min: 70, max: 85 }),
        nutrient: "High",
        size: `${faker.number.float({ min: 5, max: 7, fractionDigits: 1 })} Hectares`,
      };

    case "average":
      return {
        soilPh: faker.number
          .float({ min: 5.5, max: 6.2, fractionDigits: 1 })
          ,
        moisture: faker.number.int({ min: 45, max: 60 }),
        nutrient: "Medium",
        size: `${faker.number.float({ min: 3, max: 4, fractionDigits: 1 })} Hectares`,
      };

    case "poor":
      return {
        soilPh: faker.number
          .float({ min: 4.0, max: 5.0, fractionDigits: 1 })
         ,
        moisture: faker.number.int({ min: 20, max: 35 }),
        nutrient: "Low",
        size: `${faker.number.float({ min: 2, max: 5, fractionDigits: 1 })} Hectares`,
      };

    case "no data":
    default:
      return {
        soilPh: 0,
        moisture: 0,
        nutrient: "-",
        size: `${faker.number.float({ min: 5, max: 7, fractionDigits: 1 })} Hectares`,
      };
  }
}

export function generateFarmStatus(count = 6): FarmStatusData[] {
  return Array.from({ length: count }).map(() => {
    const status = faker.helpers.arrayElement(STATUS_POOL);

    return {
      id: faker.string.uuid(),
      title: "Farm Jos II",
      status,
      stats: generateStats(status),
    };
  });
}
