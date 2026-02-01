import { FarmsListContainer } from "@/components/dashboard/FarmsListContainer";
import { createRoute, type AnyRoute } from "@tanstack/react-router";

const List = () => {
  return (
    <FarmsListContainer />
  );
};

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "dashboard/farms",
    component: List,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Dashboard",
    },
  });
