import { describe, it, expect } from "vitest";
import {
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
  CREATE_FLOW_MD_UP_GRID_CELL_CLASS,
  CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS,
} from "../../app/(app)/create/components/createFlowLayoutTokens";

describe("createFlowLayoutTokens", () => {
  it("exports create-flow column and two-column max class strings", () => {
    expect(CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS).toBe(
      "w-full min-w-0 md:max-w-[640px]",
    );
    expect(CREATE_FLOW_MD_UP_GRID_CELL_CLASS).toBe(
      "w-full min-w-0 md:mx-auto md:max-w-[640px]",
    );
    expect(CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS).toBe("md:max-w-[1328px]");
  });
});
