import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { PaymentMethodCheckbox } from "@/components/soil-testing/PaymentMethodCheckbox";
import { useState } from "react";

interface PaymentMethod {
  id: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
}

// The payment gateway (Flutterwave/Paystack) is chosen automatically by the
// backend, with automatic failover when the primary provider is down — the
// user only picks a method type here, never a specific processor.
const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    title: "Debit card",
    subtitle: "Use your debit card to make payment",
    imageSrc: "/assets/icons/debit_card.svg",
  },
  {
    id: "2",
    title: "Bank transfer",
    subtitle: "Transfer money directly from your bank account",
    imageSrc: "/assets/icons/bank.svg",
  },
];

const PaymentMethodsSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const [selectedId, setSelectedId] = useState<string | null>(
    paymentMethods[0].id,
  );

  const handleSelect = (id: string) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section
      className="fixed inset-0 z-40 bg-black/40 p-4 transition-opacity"
      onClick={onClose}
    >
      <section
        className="z-50 ml-auto h-full w-3/4 max-w-xl rounded-[1.25rem] bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-10 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h5 className="font-neue text-xl font-bold text-[#130B30]">
              Payment methods
            </h5>
            <h6 className="text-[#423C59]">
              Select a payment method to continue with your soil testing
              analysis
            </h6>
          </div>
        </header>
        <section className="space-y-6">
          <section className="space-y-4">
            {paymentMethods.map((entry) => (
              <PaymentMethodCheckbox
                key={entry.id}
                title={entry.title}
                subtitle={entry.subtitle}
                imageSrc={entry.imageSrc}
                isChecked={selectedId === entry.id}
                onChange={() => handleSelect(entry.id)}
              />
            ))}
          </section>

          <Button onClick={onConfirm} variant="primary">
            Continue
          </Button>
        </section>
      </section>
    </section>
  );
};

export { PaymentMethodsSheet };
