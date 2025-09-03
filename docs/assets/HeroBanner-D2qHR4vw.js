import { j as a } from "./jsx-runtime-C_nHp4yK.js";
import { C as t } from "./ContentLockup-DbWiPA4N.js";
import { H as p } from "./HeroDecor-Csfoi-N_.js";
const c = ({ title: e, subtitle: s, description: r, ctaText: l, ctaHref: n }) =>
  a.jsx("section", {
    className:
      "bg-transparent px-[var(--spacing-scale-008)] sm:px-[var(--spacing-scale-010)] md:px-[var(--spacing-scale-016)] lg:px-[var(--spacing-scale-024)] xl:px-[var(--spacing-scale-048)]",
    children: a.jsx("div", {
      className: "flex flex-col gap-[var(--spacing-scale-010)]",
      children: a.jsxs("div", {
        className:
          "bg-[var(--color-surface-default-brand-primary)] p-[var(--spacing-scale-012)] sm:p-[var(--spacing-scale-016)] md:p-[var(--spacing-scale-064)] lg:py-[var(--spacing-scale-096)] lg:px-[var(--spacing-scale-064)] rounded-tl-none rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] flex flex-col gap-[var(--spacing-scale-024)] sm:gap-[var(--spacing-scale-024)] md:flex-row md:gap-[var(--spacing-scale-048)] relative overflow-hidden",
        children: [
          a.jsx(p, {
            className:
              "pointer-events-none absolute z-0 left-0 top-0 translate-x-[-72px] translate-y-[26px] sm:translate-x-[-78px] sm:translate-y-[24px] md:translate-x-[-86px] md:translate-y-[16px] lg:translate-x-[-88px] lg:translate-y-[16px] w-[1540px] h-[645px] scale-[1.04]",
          }),
          a.jsx("div", {
            className: "md:flex-1",
            children: a.jsx(t, {
              title: e,
              subtitle: s,
              description: r,
              ctaText: l,
              ctaHref: n,
              buttonClassName: "shrink-0 whitespace-nowrap min-w-[280px]",
            }),
          }),
          a.jsx("div", {
            className:
              "w-full md:flex-1 rounded-[8px] overflow-hidden relative z-10 flex items-center justify-center",
            children: a.jsx("img", {
              src: "assets/HeroImage.png",
              alt: "Hero illustration",
              className: "w-full h-auto",
            }),
          }),
        ],
      }),
    }),
  });
c.__docgenInfo = { description: "", methods: [], displayName: "HeroBanner" };
export { c as H };
