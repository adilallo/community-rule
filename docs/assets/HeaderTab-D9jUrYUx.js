import { j as s } from "./jsx-runtime-C_nHp4yK.js";
function n({ children: a, className: e = "", stretch: l = !1, ...p }) {
  const r = l
    ? "flex-1 sm:mr-[var(--spacing-scale-008)] md:mr-[185px] lg:mr-[var(--spacing-scale-024)] xl:mr-[var(--spacing-scale-032)]"
    : "";
  return s.jsxs("div", {
    className: `HeaderTab header-breakpoint-transition relative bg-[var(--color-surface-default-brand-primary)] rounded-t-[32px] sm:rounded-t-[32px] md:rounded-t-[32px] lg:rounded-t-[32px] xl:rounded-t-[32px] pl-[var(--spacing-measures-spacing-012)] h-[40px] sm:h-[52px] md:h-[52px] lg:h-[52px] xl:h-[64px] sm:pr-[var(--spacing-scale-006)] md:pl-[var(--spacing-scale-024)] lg:pl-[var(--spacing-scale-024)] xl:pl-[var(--spacing-scale-032)] md:pr-[var(--spacing-scale-012)] lg:pr-[var(--spacing-scale-048)] xl:pr-[var(--spacing-scale-120)] md:gap-[var(--spacing-scale-032)] ${r} ${e}`,
    ...p,
    children: [
      a,
      s.jsx("img", {
        src: "assets/Union_xsm.svg",
        alt: "Union",
        className:
          "absolute -bottom-[3px] -right-[52px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] sm:hidden -z-10",
      }),
      s.jsx("img", {
        src: "assets/Union_sm_md_lg.svg",
        alt: "Union",
        className:
          "absolute -bottom-[3.7px] -right-[53px] w-[61px] h-[24px] sm:w-[61px] sm:h-[31.5px] hidden sm:block xl:hidden -z-10",
      }),
      s.jsx("img", {
        src: "assets/Union_xlg.svg",
        alt: "Union",
        className:
          "absolute -bottom-[6px] -right-[94px] w-[105px] h-[53px] hidden xl:block -z-10",
      }),
    ],
  });
}
n.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "HeaderTab",
  props: {
    className: { defaultValue: { value: '""', computed: !1 }, required: !1 },
    stretch: { defaultValue: { value: "false", computed: !1 }, required: !1 },
  },
};
export { n as H };
