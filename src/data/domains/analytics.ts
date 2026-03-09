import type { DomainEntry } from "./types";

const analytics: DomainEntry = {
  slug: "analytics",
  order: 1,
  title: "analytics",
  summary:
    "analytics platforms, reporting surfaces, and measurement systems that help teams steer with real data.",
  seoDescription:
    "Domain page for analytics platforms, reporting workflows, and measurement systems Dom builds.",
  thesis:
    "i build analytics systems when a team needs data they can actually steer by, not another dashboard graveyard.",
  scope:
    "if the main job is helping people inspect, compare, or act on data at scale, it belongs here.",
  belongsHere: [
    "portal-style products that turn warehouse data into something operators can actually use",
    "measurement and reporting layers that make trends visible before a team is stuck reacting",
    "analytics surfaces where query depth matters just as much as polish",
  ],
  supportingWork: [
    {
      title: "web portal",
      context:
        "the main analytics web portal for exploring and acting on data-heavy product workflows in one place.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/web-portal",
        },
      ],
    },
    {
      title: "umami",
      context:
        "a self-hosted analytics deployment in AWS so measurement stayed inside our own stack instead of disappearing into a black box SaaS.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/umami",
        },
      ],
    },
    {
      title: "superset on stargazer",
      context:
        "a Helm and ArgoCD path for running Apache Superset on the shared EKS platform, with room for dashboards, caching, and worker-based jobs.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
    },
  ],
  relatedDomains: ["product", "ai-ml"],
};

export default analytics;
