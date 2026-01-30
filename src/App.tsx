import { Outlet, HeadContent } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { useMe } from "@/api/auth";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";

function DesktopOnlyOverlay() {
  const { data: user } = useMe();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

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
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <>
      <HeadContent />
      <DesktopOnlyOverlay />
      <Toaster position="top-right" richColors />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export default App;
