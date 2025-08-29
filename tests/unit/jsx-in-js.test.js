import { describe, it, expect } from "vitest";
import React from "react";

function Thing() {
  return <div>ok</div>;
}

describe("jsx in .js", () => {
  it("parses", () => {
    expect(Thing).toBeTypeOf("function");
  });
});
