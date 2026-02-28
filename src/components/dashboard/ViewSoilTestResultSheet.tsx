import type { FarmTest } from "@/models/farm.model";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/Button";

export const ViewSoilTestResultSheet: React.FC<{
  onClose?: () => void;
  isOpen: boolean;
  test: FarmTest;
}> = ({ onClose, test, isOpen }) => {
  if (!isOpen) return null;

  return (
    <section
      className="fixed inset-0 z-40 bg-black/70 p-4 transition-opacity"
      onClick={onClose}
    >
      <section
        className="z-50 ml-auto h-full w-3/4 max-w-xl overflow-y-auto rounded-[1.25rem] bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-10 flex items-center gap-3.5">
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-full bg-[#E8E8E8]"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col gap-2">
            <h5 className="font-neue text-xl font-bold text-[#130B30]">
              {test.testID}
            </h5>
            <h6 className="text-[#423C59]">Your result is ready</h6>
          </div>
        </header>
        <section className="relative mx-10 h-11/12 pb-5">
          <div className="mb-6 flex w-full items-baseline justify-between">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="37"
                height="37"
                rx="5.5"
                fill="#E7F2ED"
              />
              <rect
                x="0.5"
                y="0.5"
                width="37"
                height="37"
                rx="5.5"
                stroke="#0A814A"
              />
              <path
                d="M26.4829 20.7261C26.5025 20.8058 26.5062 20.8886 26.4938 20.9698C26.4814 21.0509 26.4532 21.1289 26.4107 21.1991C26.3682 21.2693 26.3122 21.3305 26.2461 21.3791C26.1799 21.4277 26.1048 21.4628 26.0251 21.4824L24.1001 21.9511L24.6048 23.8347C24.6261 23.914 24.6315 23.9967 24.6208 24.0782C24.61 24.1596 24.5834 24.2381 24.5423 24.3092C24.5013 24.3803 24.4466 24.4426 24.3814 24.4925C24.3163 24.5425 24.2419 24.5791 24.1626 24.6003C24.11 24.6155 24.0556 24.6239 24.0009 24.6253C23.8634 24.6252 23.7298 24.5798 23.6207 24.496C23.5117 24.4122 23.4333 24.2949 23.3978 24.1621L22.7946 21.9121L19.6259 20.0832V23.7418L21.3181 25.4332C21.3761 25.4912 21.4222 25.5602 21.4536 25.636C21.4851 25.7119 21.5012 25.7932 21.5012 25.8753C21.5012 25.9575 21.4851 26.0388 21.4536 26.1147C21.4222 26.1905 21.3761 26.2595 21.3181 26.3175C21.26 26.3756 21.1911 26.4217 21.1152 26.4531C21.0393 26.4845 20.958 26.5007 20.8759 26.5007C20.7938 26.5007 20.7124 26.4845 20.6366 26.4531C20.5607 26.4217 20.4918 26.3756 20.4337 26.3175L19.0009 24.8839L17.5681 26.3175C17.51 26.3756 17.4411 26.4217 17.3652 26.4531C17.2893 26.4845 17.208 26.5007 17.1259 26.5007C17.0438 26.5007 16.9624 26.4845 16.8866 26.4531C16.8107 26.4217 16.7418 26.3756 16.6837 26.3175C16.6256 26.2595 16.5796 26.1905 16.5481 26.1147C16.5167 26.0388 16.5005 25.9575 16.5005 25.8753C16.5005 25.7932 16.5167 25.7119 16.5481 25.636C16.5796 25.5602 16.6256 25.4912 16.6837 25.4332L18.3759 23.7418V20.0832L15.2079 21.9121L14.6048 24.1621C14.5692 24.295 14.4907 24.4125 14.3815 24.4962C14.2723 24.58 14.1385 24.6254 14.0009 24.6253C13.946 24.6253 13.8914 24.6182 13.8384 24.6043C13.7591 24.583 13.6847 24.5464 13.6196 24.4964C13.5544 24.4465 13.4997 24.3842 13.4587 24.3131C13.4176 24.242 13.3909 24.1635 13.3802 24.0821C13.3695 24.0007 13.3749 23.9179 13.3962 23.8386L13.9009 21.955L11.9759 21.4863C11.8149 21.4467 11.6762 21.3448 11.5904 21.203C11.5045 21.0612 11.4785 20.891 11.5181 20.73C11.5576 20.569 11.6596 20.4304 11.8014 20.3445C11.9432 20.2586 12.1133 20.2326 12.2743 20.2722L14.5751 20.8371L17.7509 19.0003L14.5759 17.1675L12.2751 17.7324C12.2263 17.7445 12.1762 17.7505 12.1259 17.7503C11.9731 17.7505 11.8255 17.6946 11.7111 17.5932C11.5967 17.4919 11.5234 17.3522 11.505 17.2005C11.4866 17.0488 11.5245 16.8956 11.6114 16.7699C11.6983 16.6442 11.8282 16.5547 11.9767 16.5183L13.9017 16.0496L13.397 14.1621C13.3541 14.0019 13.3766 13.8313 13.4595 13.6877C13.5424 13.5441 13.679 13.4393 13.8392 13.3964C13.9993 13.3536 14.17 13.376 14.3136 13.459C14.4571 13.5419 14.5619 13.6785 14.6048 13.8386L15.2079 16.0886L18.3759 17.9175V14.2589L16.6837 12.5675C16.5664 12.4503 16.5005 12.2912 16.5005 12.1253C16.5005 12.0432 16.5167 11.9619 16.5481 11.886C16.5796 11.8102 16.6256 11.7412 16.6837 11.6832C16.7418 11.6251 16.8107 11.579 16.8866 11.5476C16.9624 11.5162 17.0438 11.5 17.1259 11.5C17.2917 11.5 17.4508 11.5659 17.5681 11.6832L19.0009 13.1168L20.4337 11.6832C20.551 11.5659 20.71 11.5 20.8759 11.5C21.0417 11.5 21.2008 11.5659 21.3181 11.6832C21.4353 11.8004 21.5012 11.9595 21.5012 12.1253C21.5012 12.2912 21.4353 12.4503 21.3181 12.5675L19.6259 14.2589V17.9175L22.7939 16.0886L23.397 13.8386C23.4399 13.6785 23.5446 13.5419 23.6882 13.459C23.8318 13.376 24.0024 13.3536 24.1626 13.3964C24.3228 13.4393 24.4593 13.5441 24.5423 13.6877C24.6252 13.8313 24.6477 14.0019 24.6048 14.1621L24.1001 16.0457L26.0251 16.5144C26.1777 16.547 26.3125 16.6355 26.4032 16.7624C26.4939 16.8894 26.5338 17.0457 26.5151 17.2005C26.4964 17.3554 26.4204 17.4977 26.3021 17.5995C26.1839 17.7012 26.0318 17.755 25.8759 17.7503C25.8256 17.7505 25.7755 17.7445 25.7267 17.7324L23.4259 17.1675L20.2509 19.0003L23.4259 20.8332L25.7267 20.2683C25.8064 20.2487 25.8892 20.245 25.9703 20.2574C26.0515 20.2698 26.1294 20.298 26.1996 20.3406C26.2699 20.3831 26.331 20.439 26.3796 20.5052C26.4282 20.5713 26.4633 20.6464 26.4829 20.7261Z"
                fill="#0A814A"
              />
            </svg>

            <span className="text-sm text-[#423C59]">{test.date}</span>
          </div>
          <img
            src="/assets/images/farm.png"
            width={400}
            height={140}
            className="mb-4 w-full"
          />
          <div>
            <h6 className="mb-4 text-sm font-medium text-[#130B30]">
              {`Planting date: ${test.plantingDate}`}
            </h6>
            <section className="space-y-2">
              <PhenologyCard
                title="Germination"
                phenophase="0-5 (0)"
                acquisition="Oct 14"
                actual="0.28"
                expected="0.25"
              />

              <PhenologyCard
                title="Emergence"
                phenophase="6-14 (10)"
                acquisition="Oct 24"
                actual="0.35"
                expected="0.40"
              />
            </section>
          </div>
          <Button onClick={onClose} variant="primary" className="sticky bottom-0 mt-8">
            Confirm
          </Button>
        </section>
      </section>
    </section>
  );
};

const PhenologyCard: React.FC<{
  title: string;
  phenophase: string;
  acquisition: string;
  actual: string;
  expected: string;
}> = ({ title, phenophase, acquisition, actual, expected }) => {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-neue text-sm font-semibold text-[#130B30]">
          {title}
        </h2>
        <p className="text-sm text-[#615C74]">Index: Nil</p>
      </div>

      <div className="grid grid-cols-4 gap-4 text-sm">
        <div className="text-sm">
          <p className="font-neue font-semibold text-[#423C59]">Phenophase</p>
          <p className="text-[#615C74]">{phenophase}</p>
        </div>

        <div className="text-sm">
          <p className="font-neue font-semibold text-[#423C59]">Acquisition</p>
          <p className="text-sm text-[#615C74]">{acquisition}</p>
        </div>

        <div className="text-sm">
          <p className="font-neue font-semibold text-[#423C59]">Actual</p>
          <p className="text-sm text-[#615C74]">{actual}</p>
        </div>

        <div className="text-sm">
          <p className="font-neue font-semibold text-[#423C59]">Expected</p>
          <p className="text-[#615C74]">{expected}</p>
        </div>
      </div>
    </div>
  );
};
