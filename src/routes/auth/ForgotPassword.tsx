import { useForgotPassword } from "@/api/auth";
import { Button } from "@/components/Button";
import { allCountries, type Country } from "@/data/countries";
import {
  createRoute,
  useNavigate,
  type AnyRoute,
} from "@tanstack/react-router";
import { LoaderCircle, Search, X } from "lucide-react";
import { useRef, useState, useMemo, useEffect } from "react";
import { useForgotPasswordStore } from "@/stores/useForgotPasswordStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/models/forgot-password.schema";

type LoginType = "phone" | "email";

const flagStyle = {
  fontSize: "1.25rem",
  lineHeight: 1,
  marginLeft: "0.5rem",
};

function ForgotPassword() {
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

  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value as Partial<ForgotPasswordFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  const navigate = useNavigate();
  const { mutate, isPending } = useForgotPassword();
  const [loginType] = useState<LoginType>("email");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(
    allCountries.find((c) => c.code === "234") || allCountries[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo<Country[]>(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearch) return allCountries;

    return allCountries.filter((country) => {
      return (
        country.name.toLowerCase().includes(lowerCaseSearch) ||
        country.code.includes(lowerCaseSearch)
      );
    });
  }, [searchTerm]);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => navigate({ to: "/reset-password-otp", replace: true }),
    });
  };

  return (
    <div className="flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-16">
      <header className="space-y-2">
        <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
          Forgot Password
        </h5>
        <h6 className="text-[#423C59]">
          Enter your registered {loginType} to reset your password
        </h6>
      </header>
      <section>
        <form onSubmit={handleSubmit}>
          {loginType === "phone" ? (
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">
                Phone number
              </label>
              <div className="flex items-center gap-0.5">
                <div
                  ref={dropdownRef}
                  className="relative z-20 shrink-0 cursor-pointer rounded-lg bg-[#F3F6F8] px-2 py-4 transition duration-150 ease-in-out"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center pr-2 pl-1.5">
                    <span className="text-sm text-[#130B30]">
                      +{selectedCountry.code}
                    </span>
                    <span style={flagStyle}>{selectedCountry.flag}</span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                      <div className="flex items-center border-b border-gray-100 p-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search country or code"
                          className="w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {searchTerm && (
                          <X
                            className="ml-2 h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => setSearchTerm("")}
                          />
                        )}
                      </div>

                      <ul className="custom-scrollbar max-h-64 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <li
                              key={`${country.code}-${country.name}`}
                              className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-3 transition duration-150 ease-in-out last:border-b-0 hover:bg-gray-100"
                              onClick={() => handleSelectCountry(country)}
                            >
                              <div className="flex items-center">
                                <span
                                  style={flagStyle}
                                  className="mr-2 text-sm"
                                >
                                  {country.flag}
                                </span>
                                <span className="text-sm font-medium text-[#130B30]">
                                  {country.name}
                                </span>
                              </div>
                              <span className="font-mono text-xs text-[#423C59]">
                                +{country.code}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="p-3 text-center text-sm text-[#423C59]">
                            No results found.
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div
                  className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-colors ${
                    errors.phone
                      ? "border-red-500 bg-[#E52B670D]"
                      : "border-transparent bg-[#F3F6F8]"
                  }`}
                >
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="081 **** 572"
                  />
                </div>
              </div>
              {(errors.phone || storeErrors.phone) && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.phone?.message || storeErrors.phone}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">Email</label>
              <div
                className={`rounded-lg border-2 p-4 transition-colors ${
                  errors.email
                    ? "border-red-500 bg-[#E52B670D]"
                    : "border-transparent bg-[#F3F6F8]"
                }`}
              >
                <input
                  type="email"
                  className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="user@example.com"
                  {...register("email")}
                />
              </div>
              {(errors.email || storeErrors.email) && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email?.message || storeErrors.email}
                </p>
              )}
            </div>
          )}
          <section className="mt-6 mb-2 space-y-4">
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderCircle className="mx-auto animate-spin" />
              ) : (
                <span>Continue</span>
              )}
            </Button>
            {/** 
         <Button
         variant="link"
         onClick={() =>
         setLoginType(
         loginType === "phone" ? "email" : "phone",
         )
         }
         >
         use my {loginType === "phone" ? "email" : "phone number"}
         </Button>
         */}
          </section>
        </form>
      </section>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "forgot-password",
    component: ForgotPassword,
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: [
        { title: "Forgot Password" }
      ]
    })
  });
