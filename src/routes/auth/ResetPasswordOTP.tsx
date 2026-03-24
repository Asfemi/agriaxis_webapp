import { useVerifyOtpMutation } from "@/api/auth";
import CountdownTimer from "@/components/auth/CountdownTimer";
import OtpInput from "@/components/auth/OTPInput";
import { Button } from "@/components/Button";
import { useForgotPasswordStore } from "@/stores/useForgotPasswordStore";
import {
  createRoute,
  useNavigate,
  type AnyRoute,
} from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type LoginType = "phone number" | "email";

function ResetPasswordOtp() {
  const {
    formData,
  } = useForgotPasswordStore();

  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<LoginType>("email");
  const [otpTarget, setOtpTarget] = useState<string>("");
  const [otpValue, setOtpValue] = useState("");
  const { mutate: verify, isPending } = useVerifyOtpMutation();

  useEffect(() => {
    if (formData.phone) {
      setLoginType("phone number");
      setOtpTarget(formData.phone);
    } else {
      setLoginType("email");
      setOtpTarget(String(formData.email));
    }
  }, []);

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
  };

  const handleOtpComplete = (finalOtp: string) => {
    setOtpValue(finalOtp);
    verify(
      { otp: finalOtp, email: String(formData.email) },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully!");
          navigate({ to: "/reset-password", replace: true });
        },
      },
    );
  };

  return (
    <div className="flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-16">
      <header className="space-y-2">
        <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
          OTP Verification
        </h5>
        <h6 className="text-[#423C59]">
          {loginType === "phone number"
            ? `We sent a code to your phone number ${otpTarget} `
            : `We sent a code to your email ${otpTarget}`}
        </h6>
      </header>
      <section className="text-center">
        <div className="mx-auto mb-12 w-fit">
          <OtpInput
            length={6}
            onChange={handleOtpChange}
            onComplete={handleOtpComplete}
          />
        </div>
        <p className="text-sm text-[#434449]">
          Enter code in: <CountdownTimer />
        </p>
      </section>
      <Button variant="primary" disabled={otpValue.length < 6 || isPending}>
        {isPending ? (
          <LoaderCircle className="mx-auto animate-spin" />
        ) : (
          <span>Continue</span>
        )}
      </Button>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "reset-password-otp",
    component: ResetPasswordOtp,
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: [
        { title: "Enter OTP" }
      ]
    })
  });
