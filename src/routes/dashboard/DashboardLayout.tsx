import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSidebar, SidebarProvider } from "@/contexts/SidebarContext";
import { Suspense, useEffect } from "react";
import {
  createRoute,
  Outlet,
  redirect,
  type AnyRoute,
} from "@tanstack/react-router";
import { getOrgId, userToken } from "@/lib/utils";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { LoaderCircle, SquaresExclude } from "lucide-react";
import { meQueryOptions } from "@/api/auth";
import { DashboardError } from "@/components/dashboard/DashboardError";

function DashboardLayoutContent() {
  const { isOpen, close } = useSidebar();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isGlobalLoading = isFetching > 0 || isMutating > 0;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        close();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [close]);

  return (
    <section className="stable-gutter h-screen w-screen gap-4 overflow-hidden bg-[#F3F6F8] p-4 lg:flex">
      <div
        className={`fixed inset-y-0 z-30 w-65 transform transition-transform duration-300 ease-in-out max-lg:top-4 max-lg:h-[calc(100%-2rem)] lg:static lg:inset-0 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <section className="ml-4 flex h-full w-full flex-col gap-2 pr-4 transition-all duration-300 lg:ml-0 lg:pr-0">
        <div className="">
          <DashboardHeader />
        </div>
        <div className="flex-1 overflow-y-auto rounded-lg bg-white shadow">
          {isGlobalLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-[1px]">
              <SquaresExclude className="text-primary h-12 w-12 animate-bounce" />
            </div>
          )}

          <Suspense
            fallback={
              <LoaderCircle className="mx-auto mt-48 mb-14 animate-spin text-green-700" />
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </section>
    </section>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardLayoutContent />
    </SidebarProvider>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "dashboard",
    component: DashboardLayout,
    getParentRoute: () => parentRoute,
    errorComponent: DashboardError,
    beforeLoad: async ({ context }) => {
      const token = userToken();
      const orgId = getOrgId();
      if (!token) {
        throw redirect({ to: "/signin", replace: true });
      }

      if (!orgId) {
        throw redirect({ to: "/organisation" });
      } 

      try {
        await context.queryClient.ensureQueryData(meQueryOptions());
      } catch (error) {
        throw redirect({ to: "/signin", replace: true });
      }
    },
  });
