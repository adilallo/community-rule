import CaseStudy, {
  CASE_STUDY_SURFACE_OPTIONS,
} from "../../app/components/cards/CaseStudy";

export default {
  title: "Components/Cards/CaseStudy",
  component: CaseStudy,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Figma **Card / CaseStudy** ([21993-32352](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21993-32352)). Fixed **305×305** artwork when **`visual`** is omitted: Mutual Aid **SVG** (**`assets/case-study/`**) + raster tiles for neutral/rose (**[22112-871524](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22112-871524)**).",
      },
    },
  },
  argTypes: {
    surface: {
      control: { type: "select" },
      options: [...CASE_STUDY_SURFACE_OPTIONS],
    },
  },
  tags: ["autodocs"],
};

export const Lavender = {
  args: { surface: "lavender", imageAlt: "Mutual Aid Colorado logo" },
};
export const Neutral = {
  args: { surface: "neutral", imageAlt: "Food Not Bombs logo" },
};
export const Rose = {
  args: {
    surface: "rose",
    imageAlt: "Boulder County Street Medics logo",
  },
};
