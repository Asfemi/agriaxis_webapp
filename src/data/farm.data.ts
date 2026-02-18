import type { Farm } from "@/models/farm.model";
import  { fakerEN_NG as faker } from "@faker-js/faker";

const STATUSES = ["healthy", "average"];
const LOCATIONS = ["Jos", "Apapa, Il Ade", "Ibadan", "Abeokuta"];

export const generateFarms = (count = 5): Farm[] => {
  return Array.from({ length: count }, () => ({
    id: `F/${faker.string.alphanumeric(5).toUpperCase()}`,
    farm_name:`${faker.company.name()} branch`,
    size: faker.string.numeric({ length: 2 }),
    location: faker.helpers.arrayElement(LOCATIONS),
    status: faker.helpers.arrayElement(STATUSES),
    date: faker.date
      .past({ years: 1 })
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  }));
};
