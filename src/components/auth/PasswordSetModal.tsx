import { Button } from "@/components/Button";
import checkIcon from "/assets/icons/check.svg";

export default function PasswordSetModal() {
  const handleNavigate = () => {
    window.location.href = "/login";
  };

  return (
    <section className="fixed top-0 left-0 z-50 grid h-screen w-screen place-items-center bg-black/50">
      <div className="max-w-5/12 min-w-115 rounded-3xl bg-white p-16">
        <img src={checkIcon} width={64} height={64} className="mx-auto mb-10" />
        <div className="mb-6 text-center">
          <h5 className="text-2xl font-medium text-[#14151C]">Password set!</h5>
          <h6 className="text-[#423C59]">
            Your password reset was successful. <br />
            Login to continue
          </h6>
        </div>
        <Button variant="primary" onClick={handleNavigate}>
          Login
        </Button>
      </div>
    </section>
  );
}
