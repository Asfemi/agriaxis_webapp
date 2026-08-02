import React from "react";
import {
  Search,
  Bell,
  ChevronsRight,
  MailWarning,
  MessageSquareQuote,
} from "lucide-react";
import { useState } from "react";
import NotificationPermissionModal from "@/components/dashboard/NotificationPermissionModal";
import LocationPermissionModal from "@/components/dashboard/LocationPermissionModal";
import { FeedbackQuestionsModal } from "@/components/dashboard/FeedbackQuestionsModal";
import { useSidebar } from "@/contexts/SidebarContext";
import { Link, useLocation, useMatches } from "@tanstack/react-router";
import { useUserStore } from "@/stores/useUserStore";
import type { FeedbackTag } from "@/api/feedback";

interface IconButtonProps {
  children: React.ReactNode;
  badge?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ children, badge = false }) => (
  <button className="relative rounded-full bg-[#F1F5F9] p-3 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100">
    {children}
    {badge && (
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
    )}
  </button>
);

const ProfileButton: React.FC<{ profilePath: string }> = ({ profilePath }) => {
  const { user } = useUserStore();

  return (
    <button className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white p-1 pr-3 pl-1 transition duration-150 ease-in-out hover:shadow-md">
      <Link to={profilePath}>
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500 bg-green-100 text-sm font-semibold text-green-700 uppercase">
          {user?.name.slice(0, 2)}
        </div>
      </Link>
      <ChevronsRight className="h-5 w-5 text-gray-500" />
    </button>
  );
};

const getFeedbackTagFromPath = (pathname: string): FeedbackTag => {
  const normalizedPath = pathname.replace(/^\/dashboard\/?/, "").split("/")[0] ?? "";

  switch (normalizedPath) {
    case "soil-testing":
      return "soil_test";
    case "crop-information":
      return "crop_information";
    case "crop-monitoring":
      return "crop_health";
    default:
      return "general";
  }
};

const DashboardHeader: React.FC = () => {
  const [
    isNotificationPermissionModalOpen,
    setIsNotificationPermissionModalOpen,
  ] = useState(false);

  const handleAllowNotification = () => {
    setIsNotificationPermissionModalOpen(false);
  };
  const handleDenyNotification = () => {
    setIsNotificationPermissionModalOpen(false);
  };

  const [isLocationPermissionModalOpen, setIsLocationPermissionModalOpen] =
    useState(false);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleAllowLocation = () => {
    setIsLocationPermissionModalOpen(false);
  };
  const handleDenyLocation = () => {
    setIsLocationPermissionModalOpen(false);
  };

  const { toggle } = useSidebar();
  const matches = useMatches();
  const location = useLocation();
  const feedbackTag = getFeedbackTagFromPath(location.pathname);

  return (
    <header className="flex items-center justify-between rounded-[1.25rem] border-b border-[#E6EBF0] bg-white p-4 sm:p-6">
      <button
        onClick={toggle}
        className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
        aria-label="Open sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="flex items-center space-x-4">
        <h1 className="font-neue text-3xl font-bold text-[#0F172A] lg:text-2xl">
          {matches.map((match: any) => {
            return <span key={match.id}>{match.staticData.title}</span>;
          })}
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <a
          title="Contact" 
          className="relative rounded-full bg-[#F1F5F9] p-3 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100"
          href="mailto:agriaxisinternational@gmail.com"
        >
          <MailWarning className="h-5 w-5" />
        </a>

        <IconButton>
          <Search className="h-5 w-5" />
        </IconButton>

        <button
          type="button"
          onClick={() => setIsFeedbackModalOpen(true)}
          className="rounded-full bg-[#F1F5F9] p-3 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100"
          aria-label="Open feedback questions"
          title="Feedback"
        >
          <MessageSquareQuote className="h-5 w-5" />
        </button>

        <IconButton>
          <Bell className="h-5 w-5" />
        </IconButton>

        <ProfileButton profilePath="/dashboard/profile" />
      </div>

      <NotificationPermissionModal
        isOpen={isNotificationPermissionModalOpen}
        onAllow={handleAllowNotification}
        onDeny={handleDenyNotification}
        onClose={() => setIsNotificationPermissionModalOpen(false)}
      />

      <LocationPermissionModal
        isOpen={isLocationPermissionModalOpen}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
        onClose={() => setIsLocationPermissionModalOpen(false)}
      />

      <FeedbackQuestionsModal
        open={isFeedbackModalOpen}
        onOpenChange={setIsFeedbackModalOpen}
        tag={feedbackTag}
      />
    </header>
  );
};

export default DashboardHeader;
