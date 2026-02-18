import { Outlet, HeadContent } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { useMe } from "@/api/auth";
import { LoaderCircle } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";
import { saveOrgId } from "@/lib/utils";

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
      <Toaster />
    </div>
  );
}

function App() {
  const { data: user, isLoading } = useMe();
  const { setUser } = useUserStore();

  useEffect(() => {
    if (user) {
      setUser(user);
      saveOrgId(user.organisations[0].id.toString());
    }
  }, [user, setUser]);

  if (isLoading) return <LoaderCircle className="mx-auto animate-spin" />;

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
