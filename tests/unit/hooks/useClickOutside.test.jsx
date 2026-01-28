import { renderHook, act } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { useClickOutside } from "../../../app/hooks/useClickOutside";
import { useRef } from "react";

describe("useClickOutside", () => {
  let handler;

  beforeEach(() => {
    handler = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("calls handler when clicking outside element", () => {
    const { result } = renderHook(() => {
      const ref = useRef(null);
      useClickOutside([ref], handler, true);
      return ref;
    });

    const div = document.createElement("div");
    document.body.appendChild(div);
    result.current.current = div;

    act(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(div);
  });

  test("does not call handler when clicking inside element", () => {
    const { result } = renderHook(() => {
      const ref = useRef(null);
      useClickOutside([ref], handler, true);
      return ref;
    });

    const div = document.createElement("div");
    const innerDiv = document.createElement("div");
    div.appendChild(innerDiv);
    document.body.appendChild(div);
    result.current.current = div;

    act(() => {
      innerDiv.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(div);
  });

  test("does not call handler when disabled", () => {
    renderHook(() => {
      const ref = useRef(null);
      useClickOutside([ref], handler, false);
      return ref;
    });

    act(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });

    expect(handler).not.toHaveBeenCalled();
  });

  test("handles multiple refs", () => {
    const { result } = renderHook(() => {
      const ref1 = useRef(null);
      const ref2 = useRef(null);
      useClickOutside([ref1, ref2], handler, true);
      return { ref1, ref2 };
    });

    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    result.current.ref1.current = div1;
    result.current.ref2.current = div2;

    act(() => {
      document.body.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true }),
      );
    });

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });
});
