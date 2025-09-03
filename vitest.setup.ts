import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./tests/msw/server";
// expose Tailwind tokens to JSDOM (for design token checks)
import "./app/tailwind.css";

// MSW for API integration tests (mock fetch)
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // Clean up React DOM after each test
});
afterAll(() => server.close());
