import { describe, expect, it } from "vitest";
import { isChromelessNavigationPath } from "../../../lib/navigationChromelessPath";

describe("isChromelessNavigationPath", () => {
  it.each([
    ["/create", true],
    ["/create/completed", true],
    ["/login", true],
    ["/use-cases/mutual-aid-colorado/rule", true],
    ["/use-cases/food-not-bombs/rule/", true],
    ["/", false],
    ["/use-cases", false],
    ["/use-cases/mutual-aid-colorado", false],
    ["/use-cases/mutual-aid-colorado/rule/extra", false],
  ] as const)("returns %s -> %s", (pathname, expected) => {
    expect(isChromelessNavigationPath(pathname)).toBe(expected);
  });

  it("returns false for null or undefined", () => {
    expect(isChromelessNavigationPath(null)).toBe(false);
    expect(isChromelessNavigationPath(undefined)).toBe(false);
  });
});
