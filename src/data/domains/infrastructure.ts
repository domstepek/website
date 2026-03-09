import type { DomainEntry } from "./types";

const infrastructure: DomainEntry = {
  slug: "infrastructure",
  order: 2,
  title: "infrastructure",
  summary:
    "platform, deployment, and runtime systems that make product work calmer, safer, and easier to ship.",
  seoDescription:
    "Domain page for infrastructure, deployment, auth-edge, and runtime platform systems Dom builds.",
  thesis:
    "i do infrastructure work when the fastest product move is to make the platform more predictable.",
  scope:
    "if the hard part is provisioning, securing, routing, or reliably delivering the system, it belongs here.",
  belongsHere: [
    "cluster foundations, deployment pipelines, and GitOps rails behind product teams",
    "shared edge services that solve auth, caching, or routing once instead of five times",
    "operational plumbing that turns infrastructure from a blocker into a multiplier",
  ],
  supportingWork: [
    {
      title: "cdk-eks",
      context:
        "the EKS foundation repo covering cluster creation, addons, Karpenter, external secrets, ingress, and ArgoCD.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/cdk-eks",
        },
      ],
    },
    {
      title: "stargazer applications",
      context:
        "the GitOps repo for shipping Kubernetes applications through ArgoCD with environment-specific Helm values instead of ad hoc deploys.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/stargazer-applications",
        },
      ],
    },
    {
      title: "private cdn",
      context:
        "an internal CDN and proxy service that combined caching and controlled delivery paths for assets and app traffic.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/private_cdn",
        },
      ],
    },
    {
      title: "sso reverse proxy",
      context:
        "a reusable reverse-proxy sidecar that put SSO in front of ECS and EKS services without making every app rebuild the same edge behavior.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/sso-reverse-proxy",
        },
      ],
    },
  ],
  relatedDomains: ["developer-experience", "analytics"],
};

export default infrastructure;
