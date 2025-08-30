import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { S as t } from "./SectionNumber-Cptefv18.js";
const r = ({ number: l, text: s, iconShape: o, iconColor: a }) =>
  e.jsxs("div", {
    className:
      "bg-[var(--color-surface-inverse-primary)] rounded-[12px] p-5 shadow-lg flex flex-col gap-4 sm:p-8 sm:gap-8 sm:flex-row sm:items-center lg:p-8 lg:gap-0 lg:flex-row lg:items-stretch lg:relative lg:h-[238px]",
    children: [
      e.jsx("div", {
        className:
          "flex justify-end sm:justify-start sm:flex-shrink-0 lg:absolute lg:top-8 lg:right-8",
        children: e.jsx(t, { number: l }),
      }),
      e.jsx("div", {
        className: "sm:flex-1 lg:absolute lg:bottom-8 lg:left-8 lg:right-16",
        children: e.jsx("p", {
          className:
            "font-bricolage-grotesque font-medium text-[24px] leading-[32px] sm:font-normal sm:leading-[24px] sm:text-[24px] lg:text-[24px] lg:leading-[24px] xl:text-[32px] xl:leading-[32px] text-[#141414]",
          children: s,
        }),
      }),
    ],
  });
r.__docgenInfo = { description: "", methods: [], displayName: "NumberedCard" };
export { r as N };
