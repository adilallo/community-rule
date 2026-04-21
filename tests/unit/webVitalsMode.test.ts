import { afterEach, describe, expect, it, vi } from "vitest";
import { getWebVitalsStorageMode } from "../../lib/server/webVitals/mode";

describe("getWebVitalsStorageMode", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns external when WEB_VITALS_STORAGE=external", () => {
    vi.stubEnv("WEB_VITALS_STORAGE", "external");
    vi.stubEnv("NODE_ENV", "development");
    expect(getWebVitalsStorageMode()).toBe("external");
  });

  it("returns local when WEB_VITALS_STORAGE=local", () => {
    vi.stubEnv("WEB_VITALS_STORAGE", "local");
    vi.stubEnv("NODE_ENV", "production");
    expect(getWebVitalsStorageMode()).toBe("local");
  });

  it("defaults to external in production when unset", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getWebVitalsStorageMode()).toBe("external");
  });

  it("defaults to local in development when unset", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(getWebVitalsStorageMode()).toBe("local");
  });

  it("maps database to external until implemented", () => {
    vi.stubEnv("WEB_VITALS_STORAGE", "database");
    vi.stubEnv("NODE_ENV", "development");
    expect(getWebVitalsStorageMode()).toBe("external");
  });
});
