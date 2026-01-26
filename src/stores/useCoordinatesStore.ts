import { create } from "zustand";

interface Points {
  point1: {
    degree: number;
    minute: number;
    second: number;
  };
  point2: {
    degree: number;
    minute: number;
    second: number;
  };
  point3: {
    degree: number;
    minute: number;
    second: number;
  };
  point4: {
    degree: number;
    minute: number;
    second: number;
  };
}

const initialData: Points = {
  point1: {
    degree: 0,
    minute: 0,
    second: 0,
  },
  point2: {
    degree: 0,
    minute: 0,
    second: 0,
  },
  point3: {
    degree: 0,
    minute: 0,
    second: 0,
  },
  point4: {
    degree: 0,
    minute: 0,
    second: 0,
  },
};

