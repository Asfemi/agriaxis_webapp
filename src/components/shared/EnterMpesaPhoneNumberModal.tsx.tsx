import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { useState } from "react";

type Form = {
  phone: string;
};

export const EnterMpesaPhoneNumberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Form) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState<Form>({ phone: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(formData);
  };

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 transition-opacity">
      <div className="rounded-md bg-white p-3">
        <header className="mb-10 flex items-start gap-3.5 pt-7 pr-20 pl-6">
          <h5 className="font-neue text-xl font-bold text-[#130B30]">
            Enter your valid Mpesa Phone Number
          </h5>
          <button
            onClick={onClose}
            className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
          >
            <X size={24} className="text-[#434449]" />
          </button>
        </header>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input
            name="phone"
            type="tel"
            className="w-full border-none text-sm text-[#423C59] outline-0 placeholder:text-[#423C59] placeholder:opacity-70"
            placeholder="081 **** 572"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <Button variant="primary" type="submit">
            Proceed
          </Button>
        </form>
      </div>
    </section>
  );
};
