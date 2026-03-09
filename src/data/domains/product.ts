import type { DomainEntry } from "./types";

const product: DomainEntry = {
  slug: "product",
  order: 4,
  title: "product",
  summary:
    "workflow-heavy product systems that turn messy operational processes into software people can actually use.",
  seoDescription:
    "Domain page for business workflows, internal products, and operational software Dom builds.",
  thesis:
    "i like product work where the interface has to carry real operational weight, not just look polished.",
  scope:
    "if the main challenge is turning a messy team process into a usable product flow, it belongs here.",
  belongsHere: [
    "internal products people return to every day because the workflow actually matters",
    "operational tools where structure, speed, and edge cases all show up at once",
    "business software that needs product judgment as much as technical correctness",
  ],
  supportingWork: [
    {
      title: "sample tracking",
      context:
        "a workflow-heavy platform for managing sample shipments, live tracking status, KPI views, exports, and report subscriptions.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sample_tracking",
        },
      ],
    },
    {
      title: "pricing app",
      context:
        "a dedicated pricing workflow application with its own frontend and backend services instead of another spreadsheet-shaped process.",
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
        "supply-chain work centered on forecasting and planning flows where the product problem was operational coordination, not generic CRUD.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/supply-chain",
        },
      ],
    },
    {
      title: "cms",
      context:
        "a multi-tenant Payload-based CMS aimed at shared content and admin workflows instead of a single-tenant marketing site.",
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
