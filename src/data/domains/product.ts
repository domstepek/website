import type { DomainEntry } from "./types";

const product: DomainEntry = {
  slug: "product",
  order: 4,
  title: "product",
  summary:
    "workflow-heavy software that turns messy operational processes into usable tools.",
  seoDescription:
    "product domain page for workflow-heavy internal software and operational systems Dom builds.",
  thesis:
    "i like product work when the software has to hold together a messy real-world process, not just present a clean screen.",
  scope:
    "if the main challenge is shaping states, decisions, and handoffs into a usable workflow, it belongs here; if the audience is mainly engineers improving their own tooling, that is developer experience.",
  belongsHere: [
    "operator-facing products that carry real daily process, approvals, and exceptions",
    "business applications where workflow design matters as much as data modeling",
    "systems that need product judgment around speed, clarity, and edge cases, not just api coverage",
  ],
  supportingWork: [
    {
      title: "sample tracking",
      context:
        "the operational app for sample shipments, status tracking, exports, and subscription-style reporting.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sample_tracking",
        },
      ],
      overlapNote: "the reporting surface also brushes",
      relatedDomains: ["analytics"],
    },
    {
      title: "pricing app",
      context:
        "a dedicated pricing workflow with its own frontend and backend so quote logic stopped living in ad hoc spreadsheets.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/pricing-app",
        },
      ],
    },
    {
      title: "supply forecast",
      context:
        "forecasting and planning tooling where the hard part was coordinating operational decisions across teams.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/supply-chain",
        },
      ],
      overlapNote: "the model and reporting side of that work sits close to",
      relatedDomains: ["analytics"],
    },
    {
      title: "cms",
      context:
        "a multi-tenant Payload CMS for shared content and admin workflows rather than a one-off marketing site.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cms",
        },
      ],
    },
  ],
  relatedDomains: ["analytics", "ai-ml"],
};

export default product;
