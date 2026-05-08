import { describe, expect, it } from "vitest";
import {
  extensionForMime,
  isAllowedMime,
  isValidUploadFileId,
  maxBytesForPurpose,
} from "../../lib/server/uploads/uploadConstants";

describe("createFlow upload constants", () => {
  it("maxBytesForPurpose caps community smaller than custom attachment", () => {
    expect(maxBytesForPurpose("communityAvatar")).toBe(5 * 1024 * 1024);
    expect(maxBytesForPurpose("customMethodAttachment")).toBe(10 * 1024 * 1024);
  });

  it("isAllowedMime allows images for both purposes", () => {
    expect(isAllowedMime("communityAvatar", "image/png")).toBe(true);
    expect(isAllowedMime("customMethodAttachment", "image/jpeg")).toBe(true);
  });

  it("isAllowedMime allows pdf only for customMethodAttachment", () => {
    expect(isAllowedMime("communityAvatar", "application/pdf")).toBe(false);
    expect(isAllowedMime("customMethodAttachment", "application/pdf")).toBe(
      true,
    );
  });

  it("extensionForMime maps common types", () => {
    expect(extensionForMime("image/png")).toBe(".png");
    expect(extensionForMime("image/jpeg")).toBe(".jpg");
    expect(extensionForMime("application/pdf")).toBe(".pdf");
  });

  it("isValidUploadFileId rejects traversal and non-uuid", () => {
    expect(isValidUploadFileId("../etc/passwd")).toBe(false);
    expect(isValidUploadFileId("not-a-uuid")).toBe(false);
    expect(
      isValidUploadFileId("550e8400-e29b-41d4-a716-446655440000"),
    ).toBe(true);
  });
});
