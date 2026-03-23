import { Button } from "@/components/Button";
import { Eye, EyeOff, LoaderCircle, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { allCountries, type Country } from "@/data/countries";
import { createRoute, Link, type AnyRoute } from "@tanstack/react-router";
import { useLogin } from "@/api/auth";

const flagStyle = {
  fontSize: "1.25rem",
  lineHeight: 1,
  marginLeft: "0.5rem",
};

type LoginType = "phone" | "email";
const LOGIN_TYPE: LoginType = "email";

interface LoginFormData {
  email: string;
  phone: string;
  password: string;
  device_name: string;
}

const initialFormData: LoginFormData = {
  email: "",
  phone: "",
  password: "",
  device_name: "web",
};

function Signin() {
  const { mutate: login, isPending: isLoading } = useLogin();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    allCountries.find((c) => c.code === "234") || allCountries[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="max-w-5/12 min-w-135 rounded-3xl bg-white p-16">
      <section className="flex w-full flex-col gap-10">
        <header className="space-y-2">
          <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
            Welcome back!
          </h5>
          <h6 className="text-[#423C59]">
            Fill in your details to continue with Farm Intelligence
          </h6>
        </header>
        <section className="space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {LOGIN_TYPE === "phone" ? (
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
                  <div className="flex w-full items-center justify-between rounded-lg bg-[#F3F6F8] p-4">
                    <input
                      name="phone"
                      type="tel"
                      className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                      placeholder="081 **** 572"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-0.5 text-sm text-[#130B30]">Email</label>
                <div className="rounded-lg bg-[#F3F6F8] p-4">
                  <input
                    name="email"
                    type="email"
                    className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="mb-0.5 text-sm text-[#130B30]">Password</label>
              <div className="flex items-center justify-between rounded-lg bg-[#F3F6F8] p-4">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-11/12 border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
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
              <p className="mt-0.5 ml-auto w-fit cursor-pointer text-[#0A814A]">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="mx-auto animate-spin" />
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </form>
        </section>
        <p className="mx-auto w-fit">
          Don't have an account?{" "}
          <span className="ml-3 cursor-pointer text-[#0A814A]">
            <Link to="/signup">Sign up</Link>
          </span>
        </p>
      </section>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "signin",
    component: Signin,
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: [
        { title: "Sign in" }
      ]
    })
  });
