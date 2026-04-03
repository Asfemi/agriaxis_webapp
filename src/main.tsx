import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

import App from "@/App.tsx";
import AuthLayoutRoute from "@/routes/auth/AuthLayout.tsx";
import GetStartedRoute from "@/routes/auth/GetStartedCard.tsx";
import SelectCountryRoute from "@/routes/auth/SelectCountryCard.tsx";
import FarmTypeRoute from "@/routes/auth/FarmTypeCard.tsx";
import SigninRoute from "@/routes/auth/Signin.tsx";
import ForgotPasswordRoute from "@/routes/auth/ForgotPassword.tsx";
import OtpVerificationRoute from "@/routes/auth/OtpVerification.tsx";
import ResetPasswordRoute from "@/routes/auth/ResetPassword.tsx";
import SignupRoute from "@/routes/auth/Signup.tsx";
import DashboardLayoutRoute from "@/routes/dashboard/DashboardLayout.tsx";
import DashboardIndexRoute from "@/routes/dashboard/DashboardIndex.tsx";
import SoilTestingRoute from "@/routes/dashboard/SoilTesting.tsx";
import CropInformationRoute from "@/routes/dashboard/CropInformation.tsx";
import CropMonitoringRoute from "@/routes/dashboard/CropMonitoring.tsx";
import CreatePasswordRoute from "@/routes/auth/CreatePassword.tsx";
import RolesRoute from "@/routes/dashboard/Roles.tsx";
import UsersRoute from "@/routes/dashboard/Users.tsx";
import ProfileRoute from "@/routes/dashboard/Profile.tsx";
import ResetPasswordOTPRoute from "@/routes/auth/ResetPasswordOTP.tsx";
import FarmsListRoute from "@/routes/dashboard/farms/list.tsx";
import FarmDetailsRoute from "@/routes/dashboard/farms/details.tsx";
import PaymentSuccessRoute from "@/routes/payment/success.tsx";
import OrganisationLayoutRoute from "@/routes/auth/Organisation.tsx";
import type { QueryClient } from "@tanstack/react-query";
import WeatherServicePage from "@/components/crop-information/WeatherServicePage.tsx";
import ClimateServicePage from "@/components/crop-information/ClimateServicePage.tsx";
import CalendarServicePage from "@/components/crop-information/CalendarServicePage.tsx";

interface MyRouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRoute<MyRouterContext>({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "This is the Admin application of Agri Axis",
      },
      { title: "AgriAxis - Farm Intelligence" },
    ],
  }),
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: () => {
    throw redirect({
      to: "/get-started",
      replace: true,
    });
  },
});

const dashboardHomeRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  staticData: {
    title: "Dashboard",
  },
  loader: () => {
    throw redirect({
      to: "/dashboard/dashboard",
      replace: true,
    });
  },
});

const authRoute = AuthLayoutRoute(rootRoute);
const dashboardLayoutRoute = DashboardLayoutRoute(rootRoute);

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([
    GetStartedRoute(authRoute),
    SelectCountryRoute(authRoute),
    FarmTypeRoute(authRoute),
    SigninRoute(authRoute),
    CreatePasswordRoute(authRoute),
    ForgotPasswordRoute(authRoute),
    OtpVerificationRoute(authRoute),
    ResetPasswordRoute(authRoute),
    SignupRoute(authRoute),
    ResetPasswordOTPRoute(authRoute),
  ]),
  dashboardLayoutRoute.addChildren([
    dashboardHomeRoute,
    DashboardIndexRoute(dashboardLayoutRoute),
    SoilTestingRoute(dashboardLayoutRoute),
    CropInformationRoute(dashboardLayoutRoute),
    WeatherServicePage(dashboardLayoutRoute),
    ClimateServicePage(dashboardLayoutRoute),
    CalendarServicePage(dashboardLayoutRoute),
    CropMonitoringRoute(dashboardLayoutRoute),
    RolesRoute(dashboardLayoutRoute),
    UsersRoute(dashboardLayoutRoute),
    ProfileRoute(dashboardLayoutRoute),
    FarmsListRoute(dashboardLayoutRoute),
    FarmDetailsRoute(dashboardLayoutRoute),
  ]),
  OrganisationLayoutRoute(rootRoute),
  PaymentSuccessRoute(rootRoute),
]);

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
