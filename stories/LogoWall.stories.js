import LogoWall from "../app/components/LogoWall";

export default {
  title: "Components/LogoWall",
  component: LogoWall,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    logos: {
      control: "object",
      description: "Array of logo objects with src and alt properties",
    },
  },
};

export const Default = {
  args: {},
};

export const CustomLogos = {
  args: {
    logos: [
      { src: "assets/Section/Logo_CUBoulder.png", alt: "CU Boulder" },
      { src: "assets/Section/Logo_FoodNotBombs.png", alt: "Food Not Bombs" },
      { src: "assets/Section/Logo_Metagov.png", alt: "Metagov" },
    ],
  },
};

export const EmptyState = {
  args: {
    logos: [],
  },
};
