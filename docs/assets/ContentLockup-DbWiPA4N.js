import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { B as s } from "./Button-Z4hbXct5.js";
const n = ({
  title: l,
  subtitle: i,
  description: x,
  ctaText: a,
  ctaHref: t,
  buttonClassName: r = "",
}) =>
  e.jsxs("div", {
    className:
      "flex flex-col gap-[var(--spacing-scale-006)] sm:gap-[var(--spacing-scale-012)] md:gap-[var(--spacing-scale-020)] lg:gap-[var(--spacing-scale-020)] relative z-10",
    children: [
      e.jsxs("div", {
        className:
          "flex flex-col md:gap-[var(--spacing-scale-004)] lg:gap-[var(--spacing-scale-008)] xl:gap-[var(--spacing-scale-020)]",
        children: [
          e.jsxs("div", {
            className: "flex flex-col xl:gap-0",
            children: [
              e.jsxs("div", {
                className:
                  "flex gap-[var(--spacing-scale-008)] xl:gap-[var(--spacing-scale-010)] items-center",
                children: [
                  e.jsx("h1", {
                    className:
                      "font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] xl:text-[96px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]",
                    children: l,
                  }),
                  e.jsx("img", {
                    src: "assets/Shapes_1.svg",
                    alt: "Decorative shapes",
                    className:
                      "w-[27.2px] h-[27.2px] md:w-[34px] md:h-[34px] lg:w-[50px] lg:h-[50px]",
                  }),
                ],
              }),
              e.jsx("h2", {
                className:
                  "font-bricolage-grotesque font-medium text-[32px] leading-[32px] sm:text-[52px] sm:leading-[52px] md:text-[44px] md:leading-[44px] lg:text-[64px] lg:leading-[64px] xl:text-[96px] xl:leading-[110%] text-[var(--color-content-inverse-primary)]",
                children: i,
              }),
            ],
          }),
          e.jsx("p", {
            className:
              "font-inter font-[400] text-[18px] leading-[130%] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] text-[var(--color-content-inverse-primary)] pr-[var(--spacing-scale-032)] md:pr-[var(--spacing-scale-008)] lg:pr-[var(--spacing-scale-032)]",
            children: x,
          }),
        ],
      }),
      e.jsxs("div", {
        className: "flex justify-start",
        children: [
          e.jsx("div", {
            className: "block md:hidden",
            children: e.jsx(s, {
              variant: "primary",
              size: "small",
              children: a,
            }),
          }),
          e.jsx("div", {
            className: "hidden md:block xl:hidden",
            children: e.jsx(s, {
              variant: "primary",
              size: "large",
              className: r,
              children: a,
            }),
          }),
          e.jsx("div", {
            className: "hidden xl:block",
            children: e.jsx(s, {
              variant: "primary",
              size: "xlarge",
              children: a,
            }),
          }),
        ],
      }),
    ],
  });
n.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "ContentLockup",
  props: {
    buttonClassName: {
      defaultValue: { value: '""', computed: !1 },
      required: !1,
    },
  },
};
export { n as C };
