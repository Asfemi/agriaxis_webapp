import { X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/Button";

interface RenameResultModalProps {
  isOpen: boolean;
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export const RenameResultModal: React.FC<RenameResultModalProps> = ({
  isOpen,
  value,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;
  const [newName, setNewName] = useState(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit result title
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="result-title"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Result title
          </label>
          <input
            id="result-title"
            type="text"
            value={newName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
            }
            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-green-600"
            placeholder={value}
          />
        </div>

        <Button
          variant="primary"
          onClick={() => onSave(newName)}
          className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Save title
        </Button>
      </div>
    </div>
  );
};

