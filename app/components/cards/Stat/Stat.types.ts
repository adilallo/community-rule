import type { StatShapeVariant } from "../../asset/Shapes";

export interface StatProps {
  value: string;
  label: string;
  asOf?: string;
  shapeVariant?: StatShapeVariant;
  className?: string;
}

export interface StatViewProps extends StatProps {
  shapeVariant: StatShapeVariant;
}
