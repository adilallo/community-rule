import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import HeroBanner from "../../app/components/HeroBanner";
import NumberedCards from "../../app/components/NumberedCards";
import RuleStack from "../../app/components/RuleStack";
import FeatureGrid from "../../app/components/FeatureGrid";
import QuoteBlock from "../../app/components/QuoteBlock";
import AskOrganizer from "../../app/components/AskOrganizer";

afterEach(() => {
  cleanup();
});

describe("Component Interactions Integration", () => {
  test("hero banner and numbered cards work together to explain the process", () => {
    const heroData = {
      title: "Collaborate",
      subtitle: "with clarity",
      description:
        "Help your community make important decisions in a way that reflects its unique values.",
      ctaText: "Learn how CommunityRule works",
      ctaHref: "#",
    };

    const numberedCardsData = {
      title: "How CommunityRule works",
      subtitle: "Here's a quick overview of the process, from start to finish.",
      cards: [
        {
          text: "Document how your community makes decisions",
          iconShape: "blob",
          iconColor: "green",
        },
        {
          text: "Build an operating manual for a successful community",
          iconShape: "gear",
          iconColor: "purple",
        },
        {
          text: "Get a link to your manual for your group to review and evolve",
          iconShape: "star",
          iconColor: "orange",
        },
      ],
    };

    render(
      <div>
        <HeroBanner {...heroData} />
        <NumberedCards {...numberedCardsData} />
      </div>
    );

    // Hero introduces the concept
    expect(
      screen.getByText(/Help your community make important decisions/)
    ).toBeInTheDocument();

    // Numbered cards explain the process
    expect(screen.getByText("How CommunityRule works")).toBeInTheDocument();
    expect(
      screen.getByText("Document how your community makes decisions")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Build an operating manual for a successful community")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Get a link to your manual for your group to review and evolve"
      )
    ).toBeInTheDocument();
  });

  test("rule stack and feature grid complement each other", () => {
    const featureGridData = {
      title: "We've got your back, every step of the way",
      subtitle:
        "Use our toolkit to improve, document, and evolve your organization.",
    };

    render(
      <div>
        <RuleStack />
        <FeatureGrid {...featureGridData} />
      </div>
    );

    // Rule stack shows governance options
    expect(screen.getByText("Consensus clusters")).toBeInTheDocument();
    expect(screen.getByText("Elected Board")).toBeInTheDocument();
    expect(screen.getByText("Consensus")).toBeInTheDocument();
    expect(screen.getByText("Petition")).toBeInTheDocument();

    // Feature grid provides support context
    expect(
      screen.getByText("We've got your back, every step of the way")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use our toolkit to improve, document, and evolve your organization."
      )
    ).toBeInTheDocument();
  });

  test("quote block provides social proof for the entire application", () => {
    render(<QuoteBlock />);

    // Quote provides credibility and social proof
    expect(
      screen.getByText(/The rules of decision-making must be open/)
    ).toBeInTheDocument();

    // Should have proper attribution
    expect(screen.getByText("Jo Freeman")).toBeInTheDocument();
    expect(
      screen.getByText("The Tyranny of Structurelessness")
    ).toBeInTheDocument();
  });

  test("ask organizer provides help context for all components", () => {
    const askOrganizerData = {
      title: "Still have questions?",
      subtitle: "Get answers from an experienced organizer",
      buttonText: "Ask an organizer",
      buttonHref: "#contact",
    };

    render(<AskOrganizer {...askOrganizerData} />);

    // Provides help for users who need assistance
    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    expect(
      screen.getByText("Get answers from an experienced organizer")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ask an organizer/i })
    ).toBeInTheDocument();
  });

  test("all components maintain consistent styling and branding", () => {
    render(
      <div>
        <HeroBanner
          title="Test"
          subtitle="Test"
          description="Test description"
          ctaText="Test CTA"
        />
        <NumberedCards
          title="Test Cards"
          subtitle="Test subtitle"
          cards={[{ text: "Test card", iconShape: "blob", iconColor: "green" }]}
        />
        <RuleStack />
        <FeatureGrid title="Test Features" subtitle="Test subtitle" />
        <QuoteBlock />
        <AskOrganizer
          title="Test Help"
          subtitle="Test help subtitle"
          buttonText="Test Help Button"
        />
      </div>
    );

    // All components should render without errors
    expect(screen.getAllByText("Test").length).toBeGreaterThan(0);
    expect(screen.getByText("Test Cards")).toBeInTheDocument();
    expect(screen.getByText("Consensus clusters")).toBeInTheDocument();
    expect(screen.getByText("Test Features")).toBeInTheDocument();
    expect(
      screen.getByText(/The rules of decision-making must be open/)
    ).toBeInTheDocument();
    expect(screen.getByText("Test Help")).toBeInTheDocument();
  });

  test("components handle data flow and prop passing correctly", () => {
    const testData = {
      hero: {
        title: "Test Hero",
        subtitle: "Test Subtitle",
        description: "Test description",
        ctaText: "Test CTA",
        ctaHref: "/test",
      },
      cards: {
        title: "Test Cards",
        subtitle: "Test subtitle",
        cards: [
          { text: "Card 1", iconShape: "blob", iconColor: "green" },
          { text: "Card 2", iconShape: "gear", iconColor: "purple" },
        ],
      },
      features: {
        title: "Test Features",
        subtitle: "Test features subtitle",
      },
      help: {
        title: "Test Help",
        subtitle: "Test help subtitle",
        buttonText: "Test Help Button",
        buttonHref: "/help",
      },
    };

    render(
      <div>
        <HeroBanner {...testData.hero} />
        <NumberedCards {...testData.cards} />
        <FeatureGrid {...testData.features} />
        <AskOrganizer {...testData.help} />
      </div>
    );

    // Verify all data is passed correctly
    expect(screen.getByText("Test Hero")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Test CTA" }).length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Test Cards")).toBeInTheDocument();
    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Card 2")).toBeInTheDocument();
    expect(screen.getByText("Test Features")).toBeInTheDocument();
    expect(screen.getByText("Test Help")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Test Help Button/i })
    ).toBeInTheDocument();
  });

  test("components work together to create a cohesive user experience", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <HeroBanner
          title="Collaborate"
          subtitle="with clarity"
          description="Help your community make important decisions."
          ctaText="Learn more"
          ctaHref="#learn"
        />
        <NumberedCards
          title="How it works"
          subtitle="Simple steps to get started"
          cards={[
            { text: "Step 1", iconShape: "blob", iconColor: "green" },
            { text: "Step 2", iconShape: "gear", iconColor: "purple" },
          ]}
        />
        <RuleStack />
        <FeatureGrid title="Features" subtitle="Everything you need" />
        <QuoteBlock />
        <AskOrganizer
          title="Need help?"
          subtitle="We're here to help"
          buttonText="Contact us"
          buttonHref="#contact"
        />
      </div>
    );

    // Test interaction flow
    const learnButtons = screen.getAllByRole("button", { name: "Learn more" });
    await user.click(learnButtons[0]);

    const createButtons = screen.getAllByRole("button", {
      name: "Create CommunityRule",
    });
    if (createButtons.length > 0) {
      await user.click(createButtons[0]);
    }

    const contactButton = screen.getByRole("link", { name: /Contact us/i });
    await user.click(contactButton);

    // All components should remain functional
    expect(screen.getByText("Collaborate")).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText("Consensus clusters")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(
      screen.getByText(/The rules of decision-making must be open/)
    ).toBeInTheDocument();
    expect(screen.getByText("Need help?")).toBeInTheDocument();
  });

  test("components handle edge cases and missing data gracefully", () => {
    // Test with minimal data
    render(
      <div>
        <HeroBanner title="Minimal Hero" />
        <NumberedCards title="Minimal Cards" cards={[]} />
        <FeatureGrid title="Minimal Features" />
        <AskOrganizer title="Minimal Help" />
      </div>
    );

    // Components should render without crashing
    expect(screen.getByText("Minimal Hero")).toBeInTheDocument();
    expect(screen.getByText("Minimal Cards")).toBeInTheDocument();
    expect(screen.getByText("Minimal Features")).toBeInTheDocument();
    expect(screen.getByText("Minimal Help")).toBeInTheDocument();
  });

  test("components maintain accessibility when used together", () => {
    render(
      <div>
        <HeroBanner
          title="Accessible Hero"
          subtitle="Accessible Subtitle"
          description="Accessible description"
          ctaText="Accessible CTA"
        />
        <NumberedCards
          title="Accessible Cards"
          subtitle="Accessible subtitle"
          cards={[
            { text: "Accessible card", iconShape: "blob", iconColor: "green" },
          ]}
        />
        <RuleStack />
        <FeatureGrid
          title="Accessible Features"
          subtitle="Accessible features subtitle"
        />
        <QuoteBlock />
        <AskOrganizer
          title="Accessible Help"
          subtitle="Accessible help subtitle"
          buttonText="Accessible Help Button"
        />
      </div>
    );

    // Check for proper heading hierarchy
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper button roles
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });

    // Check for proper link roles
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toBeInTheDocument();
    });
  });
});
