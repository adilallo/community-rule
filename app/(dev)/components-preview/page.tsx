"use client";

import List from "../../components/layout/List";
import Link from "../../components/navigation/Link";
import Divider from "../../components/utility/Divider";

const listSampleItems = [
  {
    id: "1",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "2",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "3",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "4",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
  {
    id: "5",
    title: "Item",
    description: "Description/text only option here.",
    href: "#",
  },
] as const;

export default function ComponentsPreview() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-[var(--spacing-scale-032)]">
      <div className="mx-auto max-w-[1200px] space-y-[var(--spacing-scale-040)]">
        <header className="space-y-[var(--spacing-scale-008)]">
          <h1 className="font-bricolage-grotesque text-[48px] font-bold leading-[56px] text-[var(--color-content-default-primary)]">
            Component Preview
          </h1>
          <p className="font-inter text-[18px] leading-[24px] text-[var(--color-content-default-secondary)]">
            Navigation Link (Figma 21861:21428) and List (21863:45631 / 45493 /
            4405) with ListEntry (21844:4118). Use Tab and hover to review
            states.
          </p>
        </header>

        <section className="space-y-[var(--spacing-scale-016)]">
          <h2 className="font-bricolage-grotesque text-[32px] font-bold leading-[40px] text-[var(--color-content-default-primary)]">
            Link
          </h2>
          <div className="flex flex-col gap-8 rounded-[var(--radius-300,12px)] bg-[var(--color-surface-default-secondary)] p-[var(--spacing-scale-032)]">
            <div>
              <p className="mb-4 font-inter text-sm text-[var(--color-content-default-tertiary)]">
                Light surface
              </p>
              <div className="flex flex-col gap-4 rounded-lg bg-white p-6">
                <div className="flex flex-wrap gap-6">
                  <Link type="primary" variant="default" theme="light" href="#">
                    Primary / default
                  </Link>
                  <Link
                    type="primary"
                    variant="paragraph"
                    theme="light"
                    href="#"
                  >
                    Primary / paragraph
                  </Link>
                  <Link
                    type="secondary"
                    variant="default"
                    theme="light"
                    href="#"
                  >
                    Secondary / default
                  </Link>
                  <Link
                    type="secondary"
                    variant="paragraph"
                    theme="light"
                    href="#"
                  >
                    Secondary / paragraph
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6">
                  <Link
                    type="primary"
                    variant="paragraph"
                    theme="light"
                    onClick={() => undefined}
                  >
                    Button (paragraph)
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 font-inter text-sm text-[var(--color-content-default-tertiary)]">
                Dark surface
              </p>
              <div className="flex flex-col gap-4 rounded-lg bg-[var(--color-gray-800)] p-6">
                <div className="flex flex-wrap gap-6">
                  <Link type="primary" variant="default" theme="dark" href="#">
                    Primary / default
                  </Link>
                  <Link
                    type="primary"
                    variant="paragraph"
                    theme="dark"
                    href="#"
                  >
                    Primary / paragraph
                  </Link>
                  <Link
                    type="secondary"
                    variant="default"
                    theme="dark"
                    href="#"
                  >
                    Secondary / default
                  </Link>
                  <Link
                    type="secondary"
                    variant="paragraph"
                    theme="dark"
                    href="#"
                  >
                    Secondary / paragraph
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6">
                  <Link
                    type="primary"
                    variant="paragraph"
                    theme="dark"
                    onClick={() => undefined}
                  >
                    Button (paragraph)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-[var(--spacing-scale-016)]">
          <h2 className="font-bricolage-grotesque text-[32px] font-bold leading-[40px] text-[var(--color-content-default-primary)]">
            Divider
          </h2>
          <p className="font-inter text-sm text-[var(--color-content-default-tertiary)]">
            Utility / Divider (450:1941). List rows use the Content line; Menu is
            slightly higher-contrast.
          </p>
          <div className="max-w-md space-y-4">
            <div>
              <p className="mb-1 font-inter text-xs text-[var(--color-content-default-tertiary)]">
                Content
              </p>
              <Divider type="content" orientation="horizontal" />
            </div>
            <div>
              <p className="mb-1 font-inter text-xs text-[var(--color-content-default-tertiary)]">
                Menu
              </p>
              <Divider type="menu" orientation="horizontal" />
            </div>
          </div>
        </section>

        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] font-bold leading-[40px] text-[var(--color-content-default-primary)]">
            List
          </h2>
          <p className="font-inter text-sm text-[var(--color-content-default-tertiary)]">
            List frame: S (21863:45631), M (21863:45493), L (21844:4405). Row:
            ListEntry (21844:4118).
          </p>
          <div className="space-y-[var(--spacing-scale-024)]">
            <div>
              <h3 className="mb-2 font-inter text-sm font-medium text-[var(--color-content-default-secondary)]">
                Small
              </h3>
              <div className="mx-auto max-w-[1044px]">
                <List items={[...listSampleItems]} size="s" />
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-inter text-sm font-medium text-[var(--color-content-default-secondary)]">
                Medium
              </h3>
              <div className="mx-auto max-w-[1044px]">
                <List items={[...listSampleItems]} size="m" />
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-inter text-sm font-medium text-[var(--color-content-default-secondary)]">
                Large
              </h3>
              <div className="mx-auto max-w-[1590px]">
                <List items={[...listSampleItems]} size="l" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
