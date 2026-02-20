import { useLogout } from "@/api/auth";

export function DashboardError({ error }: { error: Error }) {
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-[1px]">
      <p className="text-lg font-semibold text-red-500">Something went wrong</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button
        className="bg-primary rounded px-4 py-2 text-white"
        onClick={() => window.location.reload()}
      >
        Reload app
      </button>
      <button
        className="bg-red-500 rounded px-4 py-2 text-white"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}
