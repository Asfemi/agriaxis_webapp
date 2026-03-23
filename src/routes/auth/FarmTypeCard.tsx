import { FarmTypeCheckbox } from "@/components/auth/FarmTypeCheckbox";
import { Button } from "@/components/Button";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import { createRoute, Link, redirect, type AnyRoute } from "@tanstack/react-router";
import { useState } from "react";

interface FarmerType {
  id: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
}

const farmerTypes: FarmerType[] = [
  {
    id: 'large',
    title: 'Large scale Farmer',
    subtitle: 'I manage 10 and above hectare farmland',
    imageSrc: '/assets/images/large-scale-farmer.png',
  },
  {
    id: 'medium',
    title: 'Medium scale Farmer',
    subtitle: 'I manage between 1-9 hectare farmland',
    imageSrc: '/assets/images/medium-scale-farmer.png',
  },
  // {
  //   id: 'small',
  //   title: 'Small scale Farmer',
  //   subtitle: 'I manage farmlands below 1 hectare',
  //   imageSrc: '/assets/images/small-scale-farmer.png',
  // },
  {
    id: 'finance',
    title: 'Financial Institutions',
    subtitle: 'I manage a financial institution',
    imageSrc: '/assets/images/bank.jpg',
  },
  {
    id: 'project',
    title: 'Project Sponsors',
    subtitle: 'I sponsor various projects',
    imageSrc: '/assets/images/sponsor.jpg',
  },
  {
    id: 'others',
    title: 'Others',
    subtitle: 'My category is unlisted',
    imageSrc: '/assets/images/question.jpg',
  },
];

function FarmTypeCard() {
  const [selectedId, setSelectedId] = useState<string | null>();
  const formData = useRegistrationStore((state) => state.updateFormData);
  const handleSelect = (id: string) => {
    setSelectedId(prevId => (prevId === id ? null : id));
    formData({ farm_type: id });
  };

  return (
    <div className="flex max-w-5/12 min-w-135 flex-col gap-10 rounded-3xl bg-white p-10 h-[82vh]">
      <header className="space-y-2">
        <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
          Your Farm Type
        </h5>
        <h6 className="text-[#423C59]">Let us know your farm size to serve you better</h6>
      </header>
      <section className="space-y-4 h-[65vh] overflow-y-auto">
        {farmerTypes.map((farmer) => (
          <FarmTypeCheckbox
            key={farmer.id}
            title={farmer.title}
            subtitle={farmer.subtitle}
            imageSrc={farmer.imageSrc}
            isChecked={selectedId === farmer.id}
            onChange={() => handleSelect(farmer.id)}
          />
        ))}
      </section>
      <Link to="/signup" className="block">
        <Button variant="primary" disabled={!selectedId}>Continue</Button>
      </Link>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: 'farm-type',
    component: FarmTypeCard,
    getParentRoute: () => parentRoute,
    beforeLoad: () => {
      const isValid = useRegistrationStore.getState().validateStep(['country'])
      if (!isValid) {
        throw redirect({
          to: "/select-country",
          replace: true,
        })
      }
    },
    head: () => ({
      meta: [
        { title: "Select Farm type" }
      ]
    })
  })
