import { Button } from "@/components/Button";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import {
  createRoute,
  redirect,
  useNavigate,
  type AnyRoute,
} from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle, Check } from "lucide-react"; 
import { useState, useMemo } from "react";
import { useRegisterUser } from "@/api/auth";
import { toast } from "sonner";

interface PasswordFormData {
  password: string;
  password_confirmation: string;
}

const initialFormData: PasswordFormData = {
  password: "",
  password_confirmation: "",
};

function CreatePassword() {
  const navigate = useNavigate();
  const {
    mutate: registerUser,
    isPending: isRegistering,
  } = useRegisterUser();
  
  const updateFormData = useRegistrationStore((state) => state.updateFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>(initialFormData);

  // Password Validation Logic
  const validation = useMemo(() => {
    const { password, password_confirmation } = passwordFormData;
    return {
      hasMinLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password === password_confirmation && password !== "",
    };
  }, [passwordFormData]);

  const isFormValid = Object.values(validation).every(Boolean);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    updateFormData(passwordFormData);
    const finalPayload = useRegistrationStore.getState().formData;
    
    registerUser(finalPayload, {
      onSuccess: () => {
        navigate({ to: "/otp-verification" });
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };

  return (
    <>
      <div className="flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-16">
        <header className="space-y-2">
          <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
            Create Password
          </h5>
          <h6 className="text-[#423C59]">Let's keep your account secured</h6>
        </header>
        
        <form onSubmit={handleSubmit}>
          <section className="space-y-6 mb-6">
            {/* Password Field */}
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">
                Create new password
              </label>
              <div className="flex items-center justify-between rounded-lg bg-[#F3F6F8] p-4 focus-within:ring-1 focus-within:ring-primary">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-11/12 border-none text-sm text-[#423C59] outline-0 bg-transparent placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Enter your new password"
                  value={passwordFormData.password}
                  onChange={handleInputChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="text-[#626267] size-5" /> : <Eye className="text-[#626267] size-5" />}
                </button>
              </div>
              
              {/* Requirements Checklist */}
              <div className="mt-3 space-y-1.5">
                <RequirementItem met={validation.hasMinLength} text="At least 8 characters" />
                <RequirementItem met={validation.hasUpper} text="At least one uppercase letter" />
                <RequirementItem met={validation.hasNumber} text="At least one number" />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">
                Confirm new password
              </label>
              <div className="flex items-center justify-between rounded-lg bg-[#F3F6F8] p-4 focus-within:ring-1 focus-within:ring-primary">
                <input
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-11/12 border-none text-sm text-[#423C59] outline-0 bg-transparent placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Confirm your new password"
                  value={passwordFormData.password_confirmation}
                  onChange={handleInputChange}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="text-[#626267] size-5" /> : <Eye className="text-[#626267] size-5" />}
                </button>
              </div>
              
              {/* Match Error Message */}
              {passwordFormData.password_confirmation && !validation.passwordsMatch && (
                <p className="mt-2 text-xs text-red-500 font-medium">Passwords do not match</p>
              )}
            </div>
          </section>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={!isFormValid || isRegistering}
          >
            {isRegistering ? (
              <LoaderCircle className="animate-spin mx-auto" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}

// Helper component for requirement items
const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center gap-2 text-xs ${met ? "text-green-600" : "text-[#626267]"}`}>
    {met ? <Check size={14} /> : <div className="w-3.5 h-3.5 border border-gray-300 rounded-full" />}
    <span>{text}</span>
  </div>
);

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "create-password",
    component: CreatePassword,
    getParentRoute: () => parentRoute,
    beforeLoad: () => {
      const isValid = useRegistrationStore.getState().validateStep(["first_name"]);
      if (!isValid) {
        throw redirect({
          to: "/signup",
          replace: true,
        });
      }
    },
    head: () => ({
      meta: [
        { title: "Create Password" }
      ]
    })
  });
