import { Outlet, HeadContent } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import { useLogout } from "@/api/auth";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import "leaflet/dist/leaflet.css";

function DesktopOnlyOverlay() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white md:hidden">
      <div className="max-w-sm px-6 text-center">
        <h1 className="mb-3 text-xl font-semibold text-gray-800">
          Approved Device required!
        </h1>
        <p className="text-sm text-gray-700">
          This admin application is optimized for authorized devices only.
          <br />
          Please use an authorized tablet or computer to access the application.
        </p>
      </div>
    </div>
  );
}

function RootErrorFallback({ error }: FallbackProps) {
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-white">
      <h1 className="text-xl font-semibold text-red-500">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-500">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </p>
      <button
        className="bg-primary rounded px-4 py-2 text-white"
        onClick={() => window.location.reload()}
      >
        Reload Application
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

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={RootErrorFallback}>
        <HeadContent />
        <DesktopOnlyOverlay />
        <Toaster position="top-right" richColors />
        <Suspense
          fallback={
            <LoaderCircle className="mx-auto mt-48 mb-14 animate-spin text-green-700" />
          }
        >
          <Outlet />
        </Suspense>
        <TanStackRouterDevtools />
      </ErrorBoundary>
    </>
  );
}

export default App;
