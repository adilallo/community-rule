export default function HeaderTab({ children, className = "", ...props }) {
  return (
    <div
      className={`relative bg-[var(--color-surface-default-brand-primary)] rounded-t-[16px] sm:rounded-t-[24px] pl-[var(--spacing-measures-spacing-012)] h-[40px] sm:h-[52px] sm:pr-[var(--spacing-scale-006)] ${className}`}
      {...props}
    >
      {children}
      <img
        src="/assets/Union_xsm.svg"
        alt="Union"
        className="absolute -bottom-[3px] -right-[55px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] sm:hidden"
      />
      <img
        src="/assets/Union_sm_md_lg.svg"
        alt="Union"
        className="absolute -bottom-[3px] -right-[55px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] hidden sm:block"
      />
    </div>
  );
}
