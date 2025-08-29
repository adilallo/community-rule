import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./tests/msw/server";
// expose Tailwind tokens to JSDOM (for design token checks)
import "./app/tailwind.css";

// MSW for API integration tests (mock fetch)
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
