import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./tests/msw/server";
// Note: Tailwind CSS v4 uses syntax that jsdom can't parse
// CSS classes are still available via Tailwind's JIT compilation
// Design tokens are accessible via CSS variables in the DOM
// If you need to test CSS, use a CSS transformer or mock the import

// MSW for API integration tests (mock fetch)
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // Clean up React DOM after each test
});
afterAll(() => server.close());
