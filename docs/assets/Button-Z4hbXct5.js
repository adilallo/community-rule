import { j as u } from "./jsx-runtime-C_nHp4yK.js";
function g({
  children: o,
  variant: e = "default",
  size: a = "xsmall",
  className: v = "",
  disabled: r = !1,
  type: p = "button",
  onClick: t,
  href: l,
  target: s,
  rel: c,
  ariaLabel: n,
  ...f
}) {
  const b = {
      xsmall:
        "px-[var(--spacing-scale-006)] py-[var(--spacing-scale-004)] gap-[var(--spacing-scale-001)]",
      small:
        "px-[var(--spacing-measures-spacing-008)] py-[var(--spacing-measures-spacing-008)] gap-[var(--spacing-scale-004)]",
      medium: "p-[var(--spacing-scale-010)] gap-[var(--spacing-scale-004)]",
      large:
        "px-[var(--spacing-scale-012)] py-[var(--spacing-scale-010)] gap-[var(--spacing-scale-004)]",
      xlarge:
        "px-[var(--spacing-scale-020)] py-[var(--spacing-scale-012)] gap-[var(--spacing-scale-008)]",
    },
    m = {
      xsmall:
        "font-['Inter'] text-[10px] leading-[12px] font-medium tracking-[0%]",
      small:
        "font-['Inter'] text-[12px] leading-[14px] font-medium tracking-[0%]",
      medium:
        "font-['Inter'] text-[14px] leading-[16px] font-medium tracking-[0%]",
      large:
        "font-['Inter'] text-[16px] leading-[20px] font-medium tracking-[0%]",
      xlarge:
        "font-['Inter'] text-[24px] leading-[28px] font-normal tracking-[0%]",
    },
    y = {
      default:
        "bg-[var(--color-surface-inverse-primary)] text-[var(--color-content-inverse-primary)] hover:bg-[var(--color-surface-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:outline-[var(--border-color-default-brandprimary)] hover:outline-inset hover:scale-[1.02] hover:shadow-lg focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-content-default-brand-primary)] focus:ring-offset-1 focus:scale-[1.02] active:bg-[var(--color-surface-inverse-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:outline-[var(--border-color-default-brandprimary)] active:outline-offset-1 active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:shadow-none disabled:hover:outline-none",
      secondary:
        "bg-transparent text-[var(--color-content-default-brand-primary)] hover:text-[var(--color-content-default-primary)] hover:scale-[1.02] hover:bg-transparent hover:outline-none focus:outline-1 focus:outline-inset focus:outline-[var(--border-color-default-tertiary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      primary:
        "bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] hover:bg-[var(--color-surface-default-primary)] hover:text-[var(--color-content-default-brand-primary)] hover:scale-[1.02] focus:bg-[var(--color-surface-default-primary)] focus:text-[var(--color-content-default-brand-primary)] focus:outline-none focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      outlined:
        "bg-transparent text-[var(--color-content-default-primary)] border-[1.5px] border-[var(--color-content-default-primary)] hover:bg-transparent hover:text-[var(--color-content-default-brand-primary)] hover:border-[1.5px] hover:border-[var(--color-content-default-brand-primary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-default-primary)] focus:outline-none focus:border-[1.5px] focus:border-[var(--color-content-default-primary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:border-transparent active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-default-secondary)] disabled:text-[var(--color-content-inverse-tertiary)] disabled:border-[1.5px] disabled:border-[var(--color-surface-default-secondary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      dark: "bg-transparent text-[var(--color-content-inverse-primary)] border border-[var(--border-color-default-primary)] hover:bg-transparent hover:text-[var(--color-content-inverse-brand-primary)] hover:border hover:border-[var(--border-color-inverse-brandprimary)] hover:scale-[1.02] focus:bg-transparent focus:text-[var(--color-content-inverse-primary)] focus:outline-none focus:border focus:border-[var(--border-color-default-primary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-brand-primary)] focus:blur-[0px] focus:scale-[1.02] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:border-transparent active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-primary)] disabled:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
      inverse:
        "bg-transparent text-[var(--color-content-inverse-primary)] hover:text-[var(--color-content-inverse-brand-primary)] hover:scale-[1.02] hover:bg-transparent hover:outline-none focus:outline-1 focus:outline-inset focus:outline-[var(--border-color-default-tertiary)] focus:shadow-[0_0_10px_1px_var(--color-surface-default-tertiary)] focus:blur-[0px] active:bg-[var(--color-surface-default-brand-primary)] active:text-[var(--color-content-inverse-primary)] active:shadow-none active:scale-[0.98] disabled:bg-[var(--color-surface-inverse-secondary)] disabled:text-[var(--color-content-default-primary)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100",
    },
    x =
      e === "primary" || e === "outlined" || e === "dark" || e === "inverse"
        ? ""
        : {
            xsmall: "hover:outline-1",
            small: "hover:outline-1",
            medium: "hover:outline-1",
            large: "hover:outline-2",
            xlarge: "hover:outline-[2.5px]",
          }[a],
    i = `${`inline-flex items-center justify-start box-border ${b[a]} rounded-[var(--radius-measures-radius-full)] ${m[a]} transition-all duration-500 ease-in-out cursor-pointer ${y[e]} ${x}`} ${v}`,
    d = {
      ...(n && { "aria-label": n }),
      ...(r && { "aria-disabled": "true" }),
      ...(s && { target: s }),
      ...(c && { rel: c }),
      tabIndex: r ? -1 : 0,
      ...f,
    };
  return l && !r
    ? u.jsx("a", { href: l, className: i, onClick: t, ...d, children: o })
    : u.jsx("button", {
        type: p,
        className: i,
        disabled: r,
        onClick: t,
        ...d,
        children: o,
      });
}
g.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "Button",
  props: {
    variant: {
      defaultValue: { value: '"default"', computed: !1 },
      required: !1,
    },
    size: { defaultValue: { value: '"xsmall"', computed: !1 }, required: !1 },
    className: { defaultValue: { value: '""', computed: !1 }, required: !1 },
    disabled: { defaultValue: { value: "false", computed: !1 }, required: !1 },
    type: { defaultValue: { value: '"button"', computed: !1 }, required: !1 },
  },
};
export { g as B };
