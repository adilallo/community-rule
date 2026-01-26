import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useComponentId } from "../../../app/hooks/useComponentId";

describe("useComponentId", () => {
  test("generates unique IDs with prefix", () => {
    const { result } = renderHook(() => useComponentId("input"));
    expect(result.current.id).toMatch(/^input-/);
    expect(result.current.labelId).toMatch(/^input-.*-label$/);
  });

  test("uses provided ID when given", () => {
    const { result } = renderHook(() => useComponentId("input", "custom-id"));
    expect(result.current.id).toBe("custom-id");
    expect(result.current.labelId).toBe("custom-id-label");
  });

  test("generates different IDs for different prefixes", () => {
    const { result: result1 } = renderHook(() => useComponentId("input"));
    const { result: result2 } = renderHook(() => useComponentId("select"));

    expect(result1.current.id).not.toBe(result2.current.id);
    expect(result1.current.id).toMatch(/^input-/);
    expect(result2.current.id).toMatch(/^select-/);
  });
});
