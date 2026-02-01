import { ChevronLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewUserSchema, type NewUser } from "@/models/user.model";
import { toast } from "sonner";
import { useAddUserMutation } from "@/api/users";

export const AddNewUserSheet: React.FC<{
  onClose: () => void;
  isOpen?: boolean;
}> = ({ onClose }) => {
  //   if (!isOpen) return null;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<NewUser>({
    resolver: zodResolver(NewUserSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useAddUserMutation();

  const onSubmit = (data: NewUser) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("User created successfully!");
        reset();
        onClose();
      },
      onError: () => toast.error("Failed to create user, please try again!"),
    });
  };

  const inputClass =
    "w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70 disabled:cursor-not-allowed disabled:opacity-50";

  const fieldWrapperClass =
    "rounded-lg bg-[#F3F6F8] p-4 focus-within:ring-2 focus-within:ring-[#130B30]/20";

  return (
    <section
      className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity"
      onClick={onClose}
    >
      <section
        className="z-50 ml-auto h-full w-full rounded-[1.25rem] bg-white p-8 pb-12 lg:w-3/4 lg:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-8 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col gap-2">
            <h5 className="font-neue text-xl font-bold text-[#130B30]">
              Add new user
            </h5>
            <h6 className="text-[#423C59]">Fill in the user details</h6>
          </div>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <section className="mb-10 space-y-6">
            <div>
              <label
                htmlFor="first_name"
                className="mb-0.5 text-sm text-[#130B30]"
              >
                First Name
              </label>
              <div className={fieldWrapperClass}>
                <input
                  id="first_name"
                  autoComplete="given-name"
                  {...register("first_name")}
                  type="text"
                  className={inputClass}
                  disabled={isPending}
                  placeholder="Enter user first name"
                />
              </div>
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.first_name?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="mb-0.5 text-sm text-[#130B30]"
              >
                Last Name
              </label>
              <div className={fieldWrapperClass}>
                <input
                  id="last_name"
                  autoComplete="family-name"
                  {...register("last_name")}
                  type="text"
                  className={inputClass}
                  disabled={isPending}
                  placeholder="Enter user last name"
                />
              </div>
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.last_name?.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="mb-0.5 text-sm text-[#130B30]">
                Email
              </label>
              <div className={fieldWrapperClass}>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  className={inputClass}
                  placeholder="Enter user email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="mb-0.5 text-sm text-[#130B30]"
              >
                Phone Number
              </label>
              <div className={fieldWrapperClass}>
                <input
                  id="phone_number"
                  {...register("phone_number")}
                  type="tel"
                  autoComplete="tel"
                  disabled={isPending}
                  className={inputClass}
                  placeholder="Enter user phone number"
                />
              </div>
              {errors.phone_number && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone_number?.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="role" className="mb-0.5 text-sm text-[#130B30]">
                Role
              </label>
              <div className={fieldWrapperClass}>
                <input
                  id="role"
                  {...register("role")}
                  type="text"
                  disabled={isPending}
                  className={inputClass}
                  placeholder="Enter user role"
                />
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.role?.message}
                </p>
              )}
            </div>
          </section>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="mx-auto animate-spin" />
            ) : (
              <span>Add new user</span>
            )}
          </Button>
        </form>
      </section>
    </section>
  );
};
