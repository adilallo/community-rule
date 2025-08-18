"use client";

const SectionNumber = ({ number }) => {
  const getImageSrc = (num) => {
    switch (num) {
      case 1:
        return "/assets/SectionNumber_1.png";
      case 2:
        return "/assets/SectionNumber_2.png";
      case 3:
        return "/assets/SectionNumber_3.png";
      default:
        return "/assets/SectionNumber_1.png";
    }
  };

  return (
    <div className="relative size-[40px] overflow-visible -rotate-[15deg]">
      <img
        src={getImageSrc(number)}
        alt={`Section ${number}`}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[47.37px] max-w-none"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[var(--font-size-body-small)] font-[var(--font-weight-bold)] text-[var(--color-content-inverse-primary)]">
          {number}
        </span>
      </div>
    </div>
  );
};

export default SectionNumber;
