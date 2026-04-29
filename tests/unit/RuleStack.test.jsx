import {
  renderWithProviders as render,
  screen,
  cleanup,
  waitFor,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach, beforeEach } from "vitest";
import { logger } from "../../lib/logger";
import RuleStack from "../../app/components/sections/RuleStack";
import { testRouter } from "../mocks/navigation";
import {
  GOVERNANCE_TEMPLATE_CATALOG,
  GOVERNANCE_TEMPLATE_HOME_SLUGS,
  getGovernanceTemplatesForHome,
} from "../../lib/templates/governanceTemplateCatalog";
import { CREATE_FLOW_ANONYMOUS_KEY } from "../../app/(app)/create/utils/anonymousDraftStorage";
import { CORE_VALUE_DETAILS_STORAGE_KEY } from "../../app/(app)/create/utils/coreValueDetailsLocalStorage";

const homeFeatured = getGovernanceTemplatesForHome();

function mockTemplatesApiSuccess() {
  const templatesPayload = GOVERNANCE_TEMPLATE_HOME_SLUGS.map((slug, i) => {
    const cat = GOVERNANCE_TEMPLATE_CATALOG.find((e) => e.slug === slug);
    if (!cat) throw new Error(`missing catalog slug ${slug}`);
    return {
      id: `test-${slug}`,
      slug,
      title: cat.title,
      category: "Governance pattern",
      description: cat.description,
      body: { sections: [] },
      sortOrder: i,
      featured: true,
    };
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input) => {
      const url = typeof input === "string" ? input : input.url;
      if (url.endsWith("/api/templates")) {
        return new Response(JSON.stringify({ templates: templatesPayload }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response("Not Found", { status: 404 });
    }),
  );
}

beforeEach(() => {
  testRouter.push.mockClear();
  mockTemplatesApiSuccess();
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

async function waitForRuleStackCards() {
  await waitFor(() => {
    expect(screen.getByText("Circles")).toBeInTheDocument();
  });
}

describe("RuleStack Component", () => {
  test("skips client fetch when initialGridEntries is provided (SSR path)", () => {
    const fetchMock = vi.mocked(global.fetch);
    const callsBefore = fetchMock.mock.calls.length;
    render(<RuleStack initialGridEntries={homeFeatured} />);
    expect(screen.getByText("Circles")).toBeInTheDocument();
    expect(fetchMock.mock.calls.length).toBe(callsBefore);
  });

  test("renders four featured governance template cards on the home row", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    for (const entry of homeFeatured) {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
    }
    expect(GOVERNANCE_TEMPLATE_CATALOG.length).toBeGreaterThan(
      homeFeatured.length,
    );
    expect(
      screen.queryByText("Solidarity Network"),
    ).not.toBeInTheDocument();
  });

  test("renders with custom className", async () => {
    render(<RuleStack className="custom-class" />);
    await waitForRuleStackCards();

    const section = document.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  test("renders sample rule card descriptions from featured catalog", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    expect(
      screen.getByText(/Units called Circles have the ability to decide/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Important decisions require unanimous agreement\. Proposals pass only if no serious objections remain\./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/An elected board determines policies/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Any participant can propose a rule change\. If enough sign it/,
      ),
    ).toBeInTheDocument();
  });

  test("renders rule card icons with image assets", async () => {
    const { container } = render(<RuleStack />);
    await waitForRuleStackCards();

    const imgs = container.querySelectorAll("img");
    const circles = [...imgs].find((el) => {
      const s = el.getAttribute("src") ?? "";
      return (
        s.includes("template-mark/consensus-clusters") ||
        s.includes("template-mark%2Fconsensus-clusters")
      );
    });
    const consensus = [...imgs].find((el) => {
      const s = el.getAttribute("src") ?? "";
      return (
        s.includes("consensus") &&
        !s.includes("consensus-clusters") &&
        !s.includes("elected") &&
        !s.includes("petition")
      );
    });
    expect(circles).toBeTruthy();
    expect(consensus).toBeTruthy();
  });

  test("renders see-all-templates link to full templates page", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const link = screen.getByRole("link", { name: "See all templates" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/templates");
  });

  test("applies correct CSS classes", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const section = document.querySelector("section");
    expect(section).toHaveClass("w-full", "bg-transparent");
  });

  test("renders with design tokens", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const section = document.querySelector("section");
    expect(section).toHaveClass("px-[20px]", "py-[32px]");
    expect(section?.className).toMatch(/min-\[640px\]:px-\[32px\]/);
    expect(section?.className).toMatch(/min-\[640px\]:py-\[48px\]/);
  });

  test("applies responsive grid layout", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const grid = document.querySelector('[class*="flex flex-col gap-[18px]"]');
    expect(grid).toHaveClass("min-[768px]:grid", "min-[768px]:grid-cols-2");
  });

  test("renders Rule components with catalog surface colors", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const circlesCard = screen
      .getByText("Circles")
      .closest('[class*="bg-[var(--color-surface-invert-brand-teal)]"]');
    expect(circlesCard).toBeInTheDocument();

    const consensusCard = screen
      .getByText("Consensus")
      .closest('[class*="bg-[var(--color-surface-invert-positive-secondary)]"]');
    expect(consensusCard).toBeInTheDocument();
  });

  test("handles template click events for featured templates", async () => {
    const user = userEvent.setup();
    const debugSpy = vi
      .spyOn(logger, "debug")
      .mockImplementation(() => undefined);

    render(<RuleStack />);
    await waitForRuleStackCards();

    const consensusCard = screen.getByText("Consensus").closest("div");
    await user.click(consensusCard);

    expect(debugSpy).toHaveBeenCalledWith("consensus template clicked");
    expect(testRouter.push).toHaveBeenCalledWith(
      "/create/review-template/consensus",
    );

    debugSpy.mockRestore();
  });

  test("template click from home wipes any stale anonymous draft", async () => {
    window.localStorage.setItem(
      CREATE_FLOW_ANONYMOUS_KEY,
      JSON.stringify({ title: "Stale Community" }),
    );
    window.localStorage.setItem(
      CORE_VALUE_DETAILS_STORAGE_KEY,
      JSON.stringify({ "1": { meaning: "stale", signals: "stale" } }),
    );

    const user = userEvent.setup();
    render(<RuleStack />);
    await waitForRuleStackCards();

    const consensusCard = screen.getByText("Consensus").closest("div");
    await user.click(consensusCard);

    expect(window.localStorage.getItem(CREATE_FLOW_ANONYMOUS_KEY)).toBeNull();
    expect(
      window.localStorage.getItem(CORE_VALUE_DETAILS_STORAGE_KEY),
    ).toBeNull();

    window.localStorage.clear();
  });

  test("renders with proper semantic structure", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(1 + homeFeatured.length);
  });

  test("applies responsive spacing", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const section = document.querySelector("section");
    expect(section?.className).toMatch(/min-\[640px\]:py-\[48px\]/);
    expect(section?.className).toMatch(/min-\[1024px\]:py-\[64px\]/);
  });

  test("renders icons with correct attributes", async () => {
    const { container } = render(<RuleStack />);
    await waitForRuleStackCards();

    const imgs = container.querySelectorAll("img");
    const circlesIcon = [...imgs].find((el) => {
      const s = el.getAttribute("src") ?? "";
      return (
        s.includes("template-mark/consensus-clusters") ||
        s.includes("template-mark%2Fconsensus-clusters")
      );
    });
    expect(circlesIcon).toBeTruthy();
    expect(circlesIcon?.getAttribute("src")).toMatch(
      /template-mark(?:%2F|\/)consensus-clusters/,
    );
    expect(circlesIcon?.className).toMatch(
      /min-\[640px\]:max-\[1023px\]:w-\[56px\]/,
    );
    expect(circlesIcon?.className).toMatch(
      /min-\[640px\]:max-\[1023px\]:h-\[56px\]/,
    );
    expect(circlesIcon?.className).toMatch(/min-\[1440px\]:w-\[90px\]/);
    expect(circlesIcon?.className).toMatch(/min-\[1440px\]:h-\[90px\]/);
  });

  test("applies different background colors to featured cards", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const buttons = document.querySelectorAll('[role="button"]');
    const templateSurfaces = [...buttons].filter((el) =>
      el.className.includes("--color-surface-invert"),
    );
    expect(templateSurfaces.length).toBe(homeFeatured.length);
  });

  test("renders with proper see-all link styling", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const link = screen.getByRole("link", { name: "See all templates" });
    expect(link?.className).toMatch(/bg-transparent/);
    expect(link?.className).toMatch(/border/);
  });

  test("applies flex layout for see-all link container", async () => {
    render(<RuleStack />);
    await waitForRuleStackCards();

    const linkContainer = screen
      .getByRole("link", { name: "See all templates" })
      .closest("div");
    expect(linkContainer).toHaveClass("flex", "justify-center");
  });

  test("falls back to static catalog when templates API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Server error", { status: 500 })),
    );
    render(<RuleStack />);
    await waitForRuleStackCards();
    for (const entry of homeFeatured) {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
    }
  });

  test("handles analytics tracking", async () => {
    const user = userEvent.setup();
    const gtagSpy = vi.fn();
    const analyticsSpy = vi.fn();

    Object.defineProperty(window, "gtag", {
      value: gtagSpy,
      writable: true,
    });
    Object.defineProperty(window, "analytics", {
      value: { track: analyticsSpy },
      writable: true,
    });

    render(<RuleStack />);
    await waitForRuleStackCards();

    const electedBoardCard = screen.getByText("Elected Board").closest("div");
    await user.click(electedBoardCard);

    expect(gtagSpy).toHaveBeenCalledWith("event", "template_click", {
      template_slug: "elected-board",
    });
    expect(analyticsSpy).toHaveBeenCalledWith("Template Clicked", {
      templateSlug: "elected-board",
    });
  });
});
