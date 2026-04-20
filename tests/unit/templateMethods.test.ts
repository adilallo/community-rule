import { describe, expect, it } from "vitest";
import {
  methodSlugFromTitle,
  templateMethodsFromBody,
} from "../../lib/server/templateMethods";

describe("methodSlugFromTitle", () => {
  it.each([
    ["Consensus Decision-Making", "consensus-decision-making"],
    ["Consent (Sociocracy)", "consent-sociocracy"],
    ["Mutual aid", "mutual-aid"],
    ["Workers’ Cooperative", "workers-cooperative"],
    ["  Multiple   spaces  ", "multiple-spaces"],
  ])("%s -> %s", (input, expected) => {
    expect(methodSlugFromTitle(input)).toBe(expected);
  });
});

describe("templateMethodsFromBody", () => {
  it("extracts (section, slug) pairs and skips Values", () => {
    const body = {
      sections: [
        {
          categoryName: "Values",
          entries: [{ title: "Mutuality" }],
        },
        {
          categoryName: "Communication",
          entries: [
            { title: "In-Person Meetings" },
            { title: "Loomio" },
          ],
        },
        {
          categoryName: "Decision-making",
          entries: [{ title: "Consensus Decision-Making" }],
        },
        {
          categoryName: "Conflict management",
          entries: [{ title: "Restorative Justice" }],
        },
        {
          categoryName: "Membership",
          entries: [{ title: "Peer Sponsorship" }],
        },
      ],
    };
    const result = templateMethodsFromBody(body);
    expect(result).toEqual([
      { section: "communication", slug: "in-person-meetings" },
      { section: "communication", slug: "loomio" },
      { section: "decisionApproaches", slug: "consensus-decision-making" },
      { section: "conflictManagement", slug: "restorative-justice" },
      { section: "membership", slug: "peer-sponsorship" },
    ]);
  });

  it("dedupes within a template", () => {
    const body = {
      sections: [
        {
          categoryName: "Communication",
          entries: [{ title: "Loomio" }, { title: "Loomio" }],
        },
      ],
    };
    expect(templateMethodsFromBody(body)).toEqual([
      { section: "communication", slug: "loomio" },
    ]);
  });

  it("returns [] for malformed bodies", () => {
    expect(templateMethodsFromBody(null)).toEqual([]);
    expect(templateMethodsFromBody({})).toEqual([]);
    expect(templateMethodsFromBody({ sections: "nope" })).toEqual([]);
  });
});
