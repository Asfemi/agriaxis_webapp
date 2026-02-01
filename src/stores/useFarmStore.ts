import type { Farm } from "@/models/farm.model";
import { create } from "zustand";

interface FarmStore {
  farm: Farm | null;
  setFarm: (farm: Farm) => void;
}

export const useFarmStore = create<FarmStore>((set) => ({
  farm: null,
  setFarm: (farm) => set({ farm }),
}));
