export const ProcessingResultCard: React.FC<{
  isOpen?: boolean;
}> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <section className="size-full">
      <div className="flex h-full flex-col items-center justify-center pb-10">
        <div>
          <p className="rounded-xl bg-[#FFEEBE] px-2 py-1.5 text-xs text-[#674A00]">
            Processing result...
          </p>
        </div>
      </div>
    </section>
  );
};
