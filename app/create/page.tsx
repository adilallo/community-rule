import { redirect } from "next/navigation";
import { FIRST_STEP } from "./utils/flowSteps";

/** `/create` redirects to the first wizard step (Figma frame 1). */
export default function CreateIndexPage() {
  redirect(`/create/${FIRST_STEP}`);
}
