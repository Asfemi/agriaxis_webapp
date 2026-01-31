import { FarmDetailsContainer } from "@/components/dashboard/FarmDetailsContainer";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { Suspense } from "react";

const Details = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FarmDetailsContainer />
    </Suspense>
  );
};

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "dashboard/farms/details/$id",
    component: Details,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Dashboard",
    },
  });
