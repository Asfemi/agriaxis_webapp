import { Button } from "@/components/Button";
import { useForgotPasswordStore } from "@/stores/useForgotPasswordStore";
import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/models/forgot-password.schema";
import { useResetPasswordMutation } from "@/api/auth";
import PasswordSetModal from "@/components/auth/PasswordSetModal";

function ResetPassword() {
  const {
    formData,
    updateFormData,
    errors: storeErrors,
  } = useForgotPasswordStore();

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  const { mutate, isPending } = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value as Partial<ForgotPasswordFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => setShowConfirmationModal(true),
    });
  };

  return (
    <>
      <div className="flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-16">
        <header className="space-y-2">
          <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
            Reset Password
          </h5>
          <h6 className="text-[#423C59]">
            Let's keep your account secure, reset password
          </h6>
        </header>
        <form onSubmit={handleSubmit}>
          <section className="space-y-6">
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">
                Create new password
              </label>
              <div className="flex items-center justify-between rounded-lg bg-[#F3F6F8] p-4">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Enter your new password"
                />
                {showPassword ? (
                  <EyeOff
                    className="text-[#626267]"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="text-[#626267]"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {(errors.password || storeErrors.password) && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password?.message || storeErrors.password}
                </p>
              )}
            </div>
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">
                Confirm new password
              </label>
              <div className="flex items-center justify-between rounded-lg bg-[#F3F6F8] p-4">
                <input
                  {...register("password_confirmation")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Confirm your new password"
                />
                {showConfirmPassword ? (
                  <EyeOff
                    className="text-[#626267]"
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <Eye
                    className="text-[#626267]"
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
              {(errors.password_confirmation ||
                storeErrors.password_confirmation) && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password_confirmation?.message ||
                    storeErrors.password_confirmation}
                </p>
              )}
            </div>
          </section>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="mx-auto animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </form>
      </div>
      {showConfirmationModal && <PasswordSetModal />}
    </>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "reset-password",
    component: ResetPassword,
    getParentRoute: () => parentRoute,
  });
