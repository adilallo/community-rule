import { describe, it, expect } from "vitest";
import messages from "../../messages/en/index";

describe("create footer messages", () => {
  it("exposes confirmName for the community-name footer CTA", () => {
    expect(messages.create.footer.confirmName).toBe("Confirm name");
  });

  it("exposes confirmDetails for the community-structure footer CTA", () => {
    expect(messages.create.footer.confirmDetails).toBe("Confirm details");
  });

  it("exposes confirmDescription for the community-context footer CTA", () => {
    expect(messages.create.footer.confirmDescription).toBe(
      "Confirm description",
    );
  });

  it("exposes confirmMembers for the community-size footer CTA", () => {
    expect(messages.create.footer.confirmMembers).toBe("Confirm members");
  });
});
