export default function HeaderTab({ children, className = "", ...props }) {
  return (
    <div
      className={`relative bg-[var(--color-surface-default-brand-primary)] rounded-t-[16px] pl-[var(--spacing-measures-spacing-012)] h-[40px] ${className}`}
      {...props}
    >
      {children}
      <img
        src="/assets/Union.svg"
        alt="Union"
        className="absolute bottom-[0px] -right-[55px] w-[61px] h-[24px]"
      />
    </div>
  );
}
