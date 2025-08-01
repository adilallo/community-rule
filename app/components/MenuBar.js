export default function MenuBar({ children, className = "", ...props }) {
  const baseStyles = `flex items-center px-[var(--spacing-scale-004)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)] ${className}`;

  return (
    <nav className={baseStyles} {...props}>
      {children}
    </nav>
  );
}
