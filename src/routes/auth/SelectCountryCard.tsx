import { Button } from "@/components/Button";
import arrowUp from "/assets/icons/arrow-up.svg";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createRoute, Link, type AnyRoute } from "@tanstack/react-router";
import { useRegistrationStore } from "@/stores/useRegistrationStore";

const countries = [
  {
    value: "nigeria",
    label: "Nigeria",
  },
  {
    value: "ghana",
    label: "Ghana",
  },
];

function SelectCountryCard() {
  const [countryListOpen, setcountryListOpen] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const selectedCountry = countries.find(
    (country) => country.value === countryValue,
  );
  const formData = useRegistrationStore((state) => state.updateFormData);
  const selectCountry = (country: string) => {
    setCountryValue(country);
    formData({ country: country });
  };
  const isValid = useRegistrationStore.getState().validateStep(["country"]);

  return (
    <div className="flex max-w-5/12 min-w-135 flex-col gap-7 rounded-3xl bg-white p-16">
      <header className="space-y-2">
        <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
          Your country
        </h5>
        <h6 className="text-[#423C59]">Let us know your country</h6>
      </header>
      <Popover open={countryListOpen} onOpenChange={setcountryListOpen}>
        <PopoverTrigger asChild>
          <div
            className="cursor-pointer"
            role="combobox"
            aria-expanded={countryListOpen}
            aria-controls="country-list"
          >
            <label className="mb-0.5 text-sm text-[#130B30]">Country</label>
            <div className="flex items-center justify-between rounded-xl bg-[#F3F6F8] p-4">
              <span
                className={cn(
                  "text-sm text-[#423C59]",
                  !selectedCountry && "opacity-65",
                )}
              >
                {selectedCountry
                  ? selectedCountry.label
                  : "Select your country"}
              </span>
              <img
                src={arrowUp}
                width={20}
                height={20}
                className={cn(
                  "transition-transform",
                  countryListOpen && "rotate-180",
                )}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="max-w-1/3 min-w-120 p-0">
          <Command>
            <CommandInput placeholder="Search country..." className="h-9" />
            <CommandList id="country-list">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      selectCountry(currentValue);
                      setcountryListOpen(false);
                    }}
                  >
                    {country.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        countryValue === country.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mb-6">
        <Link to="/farm-type" className="block">
          <Button variant="primary" disabled={!isValid}>
            Continue
          </Button>
        </Link>
      </div>
      <p className="mx-auto w-fit">
        Already have an account?{" "}
        <span className="ml-3 cursor-pointer text-[#0A814A]">
          <Link to="/signin">Sign in</Link>
        </span>
      </p>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "select-country",
    component: SelectCountryCard,
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: [
        { title: "Select Country" }
      ]
    })
  });
