import { j as e } from "./jsx-runtime-C_nHp4yK.js";
const a = ({ number: t }) => {
  const s = (r) => {
    switch (r) {
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
  return e.jsxs("div", {
    className: "relative size-[40px] overflow-visible -rotate-[15deg]",
    children: [
      e.jsx("img", {
        src: s(t),
        alt: `Section ${t}`,
        className:
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[47.37px] max-w-none",
      }),
      e.jsx("div", {
        className: "absolute inset-0 flex items-center justify-center",
        children: e.jsx("span", {
          className:
            "text-[var(--font-size-body-small)] font-[var(--font-weight-bold)] text-[var(--color-content-inverse-primary)]",
          children: t,
        }),
      }),
    ],
  });
};
a.__docgenInfo = { description: "", methods: [], displayName: "SectionNumber" };
export { a as S };
