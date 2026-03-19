import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface BaseProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  headerTitle: string;
  doneLabel?: string;
}

interface SingleSelectProps extends BaseProps {
  mode: "single";
  value: string | null;
  onChange: (value: string) => void;
}

interface MultiSelectProps extends BaseProps {
  mode: "multiple";
  value: string[] | null;
  onChange: (value: string[]) => void;
  footerPlaceholder?: string;
  onCreateOption?: (value: string) => void;
}

type SelectDropdownProps = SingleSelectProps | MultiSelectProps;

export const SelectDropdown: React.FC<SelectDropdownProps> = (props) => {
  const {
    label,
    options,
    placeholder = "Select option",
    headerTitle = "Select",
    doneLabel = "Done",
  } = props;

  const [open, setOpen] = useState(false);
  const [newOption, setNewOption] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isMulti = props.mode === "multiple";

  const selectedValues = isMulti
    ? (props.value ?? [])
    : props.value
      ? [props.value]
      : [];

  const selectedLabels = options
    .filter((o) => selectedValues.includes(o.value))
    .map((o) => o.label)
    .join(", ");

  const toggleValue = (val: string, isDisabled?: boolean) => {
    if (isDisabled) return;

    if (props.mode === "single") {
      props.onChange(val);
      setOpen(false);
    } else {
      const current = props.value ?? [];
      props.onChange(
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val],
      );
    }
  };

  const handleCreate = () => {
    if (props.mode !== "multiple" || !props.onCreateOption || !newOption.trim())
      return;

    props.onCreateOption(newOption.trim());
    setNewOption("");
  };

  return (
    <div ref={ref} className="relative w-full">
      {label && <label className="mb-1 text-sm text-[#130B30]">{label}</label>}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-13 w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600"
      >
        <span className="truncate">{selectedLabels || placeholder}</span>
        <ArrowUp
          className={`h-4 w-4 transition ${open ? "rotate-0" : "rotate-180"}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-3xs rounded-xl border bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="text-sm font-medium text-gray-700">
              {headerTitle}
            </span>
            {isMulti && (
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-green-700 px-6 py-2 text-xs font-semibold text-white hover:bg-green-800"
              >
                {doneLabel}
              </button>
            )}
          </div>

          {/* Options */}
          <div className="max-h-52 space-y-3 overflow-y-auto px-4 py-3">
            {options.map((option) => {
              const isDisabled = option.disabled;

              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  {isMulti ? (
                    <Checkbox
                      disabled={isDisabled}
                      className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-blue-700"
                      checked={selectedValues.includes(option.value)}
                      onCheckedChange={() =>
                        !isDisabled && toggleValue(option.value)
                      }
                    />
                  ) : (
                    <div
                      role="radio"
                      onClick={() => toggleValue(option.value)}
                      className={`grid size-4 place-items-center rounded-full border p-0.5 ${
                        isDisabled ? "border-gray-300" : "border-[#0A814A]"
                      }`}
                    >
                      {selectedValues.includes(option.value) && (
                        <div className={`size-full rounded-full ${isDisabled ? "bg-gray-300" : "bg-[#0A814A]"}`}></div>
                      )}
                    </div>
                  )}
                  <span className={isDisabled ? "text-gray-400" : ""}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Footer (multi only) */}
          {props.mode === "multiple" &&
            props.onCreateOption &&
            props.footerPlaceholder && (
              <div className="border-t px-4 py-3">
                <input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder={props.footerPlaceholder}
                  className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
};
