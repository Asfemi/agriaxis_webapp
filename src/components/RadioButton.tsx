import type React from "react";

export const RadioButton: React.FC<{
  title: string;
  isSelected: boolean;
  select: (value: string) => void;
}> = ({ title, isSelected, select }) => {
  return (
    <button
      type="button"
      onClick={() => select(title)}
      className="flex items-center justify-between rounded-lg bg-[#F3F6F8] p-3.5 cursor-pointer"
    >
      <span className="text-sm text-[#130B30] capitalize">{title}</span>
      <div className="grid size-4 p-0.5 place-items-center rounded-full border border-[#0A814A]">
        {isSelected && (
          <div className="size-full rounded-full bg-[#0A814A]"></div>
        )}
      </div>
    </button>
  );
};
