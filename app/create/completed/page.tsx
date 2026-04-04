"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import CommunityRuleDocument from "../../components/sections/CommunityRuleDocument";
import type { CommunityRuleDocumentSection } from "../../components/sections/CommunityRuleDocument/CommunityRuleDocument.types";
import Alert from "../../components/modals/Alert";

const TITLE = "Mutual Aid Mondays";
const DESCRIPTION =
  "Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness.";

const TOAST_TITLE = "This is what folks see when you share your CommunityRule";
const TOAST_DESCRIPTION =
  "Your group can use this document as an operating manual.";

const SOLIDARITY_BODY =
  "Food Not Bombs is not a charity. It is a project of solidarity. Charity is vertical. It moves from those who have to those who have not and maintains the hierarchy between them. Solidarity is horizontal. It moves between equals who recognize that our liberation is bound together. We do not help the poor. We share resources among community members because access to food is a human right rather than a privilege of wealth.";

/** Static sections for the completed Community Rule document (placeholder data). */
const COMPLETED_RULE_SECTIONS: CommunityRuleDocumentSection[] = [
  {
    categoryName: "Values",
    entries: [
      { title: "Solidarity Forever", body: SOLIDARITY_BODY },
      {
        title: "Shared Leadership",
        body: "We operate without bosses or managers. This does not mean we are disorganized. It means we are self-organized. Authority in this chapter is temporary and task-specific rather than permanent or personal. We believe the people doing the work should make the decisions about that work. By distributing responsibility we prevent burnout and ensure the movement survives beyond any single leader.",
      },
      {
        title: "Organizing Offline",
        body: "We use digital tools to coordinate but we build power in the physical world. An algorithm cannot cook a meal and a group chat cannot look someone in the eye. We prioritize face-to-face connection and resist the pull of digital metrics.",
      },
      {
        title: "Circular Food Systems",
        body: "We intervene in the ecological crisis by addressing food waste and food recovery. We redirect surplus food to where it is needed and model a circular economy at the scale of our communities.",
      },
    ],
  },
  {
    categoryName: "Communication",
    entries: [
      {
        title: "Signal",
        body: "We use Signal for sensitive coordination. Encrypted messaging helps protect our members and our plans from surveillance.",
      },
    ],
  },
  {
    categoryName: "Membership",
    entries: [
      {
        title: "Open Admission",
        body: "Anyone who shares our values and is willing to contribute is welcome. We do not require applications or approval processes for general participation.",
      },
    ],
  },
  {
    categoryName: "Decision-making",
    entries: [
      {
        title: "Lazy Consensus",
        body: "We use lazy consensus for most decisions: proposals move forward unless someone raises a blocking concern. This keeps us moving without requiring everyone to approve every detail.",
      },
      {
        title: "Modified Consensus",
        body: "For larger or more consequential decisions we use modified consensus, with clear timelines and a fallback to a supermajority vote if needed.",
      },
    ],
  },
  {
    categoryName: "Conflict management",
    entries: [
      {
        title: "Code of Conduct",
        body: "We have a code of conduct that sets expectations for behavior and outlines how we address harm.",
      },
      {
        title: "Restorative Justice",
        body: "When conflict arises we prioritize restoration and learning over punishment. We use facilitated circles and other restorative practices where appropriate.",
      },
    ],
  },
];

/**
 * Completed create flow page.
 * Figma: 20907-213286 (main), 18002-28017 (toast).
 */
export default function CompletedPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [toastDismissed, setToastDismissed] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const showDesktopLayout = !isMounted || isMdOrLarger;

  if (showDesktopLayout) {
    return (
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 overflow-hidden bg-[var(--color-teal-teal50,#c9fef9)] px-5 md:px-12">
          <div className="grid h-full max-w-[1280px] grid-cols-2 shrink-0 gap-[var(--measures-spacing-1200,48px)] min-h-0 min-w-0 w-full">
            {/* Left column: community title + header, centered, does not scroll */}
            <div className="flex min-w-0 flex-col justify-center overflow-hidden py-8">
              <HeaderLockup
                title={TITLE}
                description={DESCRIPTION}
                justification="left"
                size="L"
                palette="inverse"
              />
            </div>
            {/* Right column: Community Rule document — this column scrolls independently; padding inside scroll so content isn't clipped */}
            <div className="scrollbar-hide relative flex min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto">
              {/* Soft fade at top: gradient wash only (no blur) so no sharp cutoff line */}
              <div
                className="sticky top-0 z-10 h-5 shrink-0 pointer-events-none bg-gradient-to-b from-[var(--color-teal-teal50,#c9fef9)]/55 from-0% via-[var(--color-teal-teal50,#c9fef9)]/20 via-50% to-transparent"
                aria-hidden
              />
              <div className="py-8 min-w-0">
                <CommunityRuleDocument
                  sections={COMPLETED_RULE_SECTIONS}
                  className="min-w-0"
                />
              </div>
            </div>
          </div>
        </div>

        {!toastDismissed && (
          <div
            className="fixed bottom-0 left-0 right-0 z-10 w-full"
            role="status"
            aria-live="polite"
          >
            <Alert
              type="toast"
              status="default"
              title={TOAST_TITLE}
              description={TOAST_DESCRIPTION}
              hasLeadingIcon
              hasBodyText
              onClose={() => setToastDismissed(true)}
              className="w-full"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col items-center px-5 min-w-0 bg-[var(--color-teal-teal50,#c9fef9)] py-8">
        <div className="flex flex-col gap-4 w-full max-w-[639px]">
          <HeaderLockup
            title={TITLE}
            description={DESCRIPTION}
            justification="left"
            size="M"
            palette="inverse"
          />
          <CommunityRuleDocument
            sections={COMPLETED_RULE_SECTIONS}
            useCardStyle
            className="w-full p-4"
          />
        </div>
      </div>

      {!toastDismissed && (
        <div
          className="fixed bottom-0 left-0 right-0 z-10 w-full"
          role="status"
          aria-live="polite"
        >
          <Alert
            type="toast"
            status="default"
            title={TOAST_TITLE}
            description={TOAST_DESCRIPTION}
            hasLeadingIcon
            hasBodyText
            onClose={() => setToastDismissed(true)}
            className="w-full"
          />
        </div>
      )}
    </>
  );
}
