import { j as r } from "./jsx-runtime-C_nHp4yK.js";
function i({ children: e, size: a = "small", className: s = "", ...l }) {
  const t = `items-center ${{ small: "flex -space-x-2", medium: "flex -space-x-[9px]", large: "flex -space-x-[10px]", xlarge: "flex -space-x-[13px]" }[a]} ${s}`;
  return r.jsx("div", { className: t, ...l, children: e });
}
i.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "AvatarContainer",
  props: {
    size: { defaultValue: { value: '"small"', computed: !1 }, required: !1 },
    className: { defaultValue: { value: '""', computed: !1 }, required: !1 },
  },
};
export { i as A };
