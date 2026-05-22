import Groups from "../../app/components/sections/Groups";
import { getAssetPath, vectorMarkPath } from "../../lib/assetUtils";

const vectorIconSrc = [
  getAssetPath(vectorMarkPath("worker-coop")),
  getAssetPath(vectorMarkPath("mutual-aid")),
  getAssetPath(vectorMarkPath("open-source")),
  getAssetPath(vectorMarkPath("dao")),
];

const sampleItems = [
  {
    icon: (
      <img
        alt=""
        aria-hidden
        className="inline-block size-9 object-contain"
        height={36}
        src={vectorIconSrc[0]}
        width={36}
      />
    ),
    title: "Worker's cooperatives",
    description:
      "Employee-owned businesses often need to clarify how power is shared, decisions are made, and how processes operate within their organizations.",
  },
  {
    icon: (
      <img
        alt=""
        aria-hidden
        className="inline-block size-9 object-contain"
        height={36}
        src={vectorIconSrc[1]}
        width={36}
      />
    ),
    title: "Mutual aid groups",
    description:
      "Mutual aid groups must define how resources are shared, decisions are made, and volunteer coordination operates within their organizations.",
  },
  {
    icon: (
      <img
        alt=""
        aria-hidden
        className="inline-block size-9 object-contain"
        height={36}
        src={vectorIconSrc[2]}
        width={36}
      />
    ),
    title: "Open source projects",
    description:
      "Agree to how contributions are managed, technical decisions are made, and community participation operates within their development communities.",
  },
  {
    icon: (
      <img
        alt=""
        aria-hidden
        className="inline-block size-9 object-contain"
        height={36}
        src={vectorIconSrc[3]}
        width={36}
      />
    ),
    title: "DAOs",
    description:
      "Document token-based voting process, proposal patterns, and how community governance operates within their blockchain ecosystems.",
  },
];

export default {
  title: "Components/Sections/Groups",
  component: Groups,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Figma **Section** (**[22084-859062](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22084-859062&m=dev)**) — baseline stacked cards; **md+** `22084-859470` hairline grid. **`cards/Icon`** tiles (body **12px/16px** from **`lg`**).",
      },
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Who is this for?",
    items: sampleItems,
  },
};
