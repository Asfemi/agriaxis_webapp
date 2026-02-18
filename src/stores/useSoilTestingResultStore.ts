import type { SoilTestingResult } from "@/models/soil-testing.model";
import { create } from "zustand";

interface SoilTestingResultStore {
  result: SoilTestingResult | null;
  setResult: (result: SoilTestingResult) => void;
}

export const useSoilTestingResultStore = create<SoilTestingResultStore>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}));

