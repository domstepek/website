import type { DomainEntry } from "./types";

const developerExperience: DomainEntry = {
  slug: "developer-experience",
  order: 5,
  title: "developer experience",
  summary:
    "developer tooling, shared UI systems, and automation that save teams from paying the same tax twice.",
  seoDescription:
    "Domain page for developer tooling, design systems, and automation Dom builds for teams.",
  thesis:
    "i invest in developer experience when a team is paying the same setup, testing, or UI tax over and over.",
  scope:
    "if the main win is making engineers faster, safer, or more consistent, it belongs here.",
  belongsHere: [
    "shared tooling that removes repeat setup, hand edits, or deployment friction",
    "quality systems that catch breakage before it becomes somebody else's afternoon",
    "reusable UI and workflow primitives that keep teams from rebuilding the same thing in parallel",
  ],
  supportingWork: [
    {
      title: "global design system",
      context:
        "a shared component library and Storybook workflow for keeping product surfaces more consistent without copy-pasting UI primitives.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/global-design-system",
        },
      ],
    },
    {
      title: "web portal qa bdd",
      context:
        "a WebdriverIO and Cucumber automation suite covering portal workflows and API paths that were too important to leave to manual regression testing.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal-qa-bdd",
        },
      ],
    },
    {
      title: "product team cli",
      context:
        "an internal CLI for environment setup, config edits, and feature toggles so recurring product-team tasks became guided and scriptable.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/product-team-cli",
        },
      ],
    },
    {
      title: "product migration scripts",
      context:
        "migration tooling for moving analytics product data and configuration without turning every rollout into a manual cleanup project.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/product-migration-scripts",
        },
      ],
    },
  ],
  relatedDomains: ["infrastructure", "product"],
};

export default developerExperience;
