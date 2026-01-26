import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./tests/msw/server";
// Note: Tailwind CSS v4 uses syntax that jsdom can't parse
// CSS classes are still available via Tailwind's JIT compilation
// Design tokens are accessible via CSS variables in the DOM
// If you need to test CSS, use a CSS transformer or mock the import

// Mock next/dynamic for tests - return components directly instead of lazy loading
vi.mock("next/dynamic", () => {
  const React = require("react");
  return {
    default: (importFn: () => Promise<any>, options?: any) => {
      // In tests, return a component that immediately resolves and renders
      return function DynamicComponent(props: any) {
        const [Component, setComponent] = React.useState(null);
        const [loading, setLoading] = React.useState(true);
        
        React.useEffect(() => {
          importFn()
            .then((mod: any) => {
              setComponent(mod.default || mod);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        }, []);
        
        if (loading && options?.loading) {
          return options.loading();
        }
        
        if (Component) {
          return React.createElement(Component, props);
        }
        
        return null;
      };
    },
  };
});

// MSW for API integration tests (mock fetch)
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // Clean up React DOM after each test
});
afterAll(() => server.close());
