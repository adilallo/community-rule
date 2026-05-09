import { describe, expect, it } from "vitest";
import { formatConflictApplicableScopeForTextarea } from "../../lib/create/ruleSectionsFromMethodSelections";

describe("formatConflictApplicableScopeForTextarea", () => {
  it("joins legacy preset fragments with comma-space as one sentence", () => {
    expect(
      formatConflictApplicableScopeForTextarea(
        [],
        [
          "Low-level friction",
          "misunderstandings",
          "and minor grievances between peers.",
        ],
      ),
    ).toBe(
      "Low-level friction, misunderstandings, and minor grievances between peers.",
    );
  });

  it("prefers selected scopes when non-empty", () => {
    expect(
      formatConflictApplicableScopeForTextarea(["only this"], ["a", "b"]),
    ).toBe("only this");
  });

  it("returns empty string when both lists are empty", () => {
    expect(formatConflictApplicableScopeForTextarea([], [])).toBe("");
  });
});
