import { useLogout } from "@/api/auth";
import { FarmDetailsContainer } from "@/components/dashboard/FarmDetailsContainer";
import { createRoute, useNavigate, type AnyRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function DetailsErrorFallback({ error }: FallbackProps) {
  const { mutate: logout } = useLogout();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 bg-white">
      <h1 className="text-xl font-semibold text-red-500">
        Something went wrong. Failed to fetch farm
      </h1>
      <p className="text-sm text-gray-500">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
      <button
        className="bg-primary rounded px-4 py-2 text-white"
        onClick={() => navigate({ to: '/dashboard/dashboard/farms/' })}
      >
        Go back
      </button>
      <button
        className="rounded bg-red-500 px-4 py-2 text-white"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}

const Details = () => {
  return (
    <ErrorBoundary FallbackComponent={DetailsErrorFallback}>
    <Suspense fallback={<div>Loading...</div>}>
      <FarmDetailsContainer />
    </Suspense>
    </ErrorBoundary>
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
