import type { DomainEntry } from "./types";

const aiMl: DomainEntry = {
  slug: "ai-ml",
  order: 3,
  title: "ai / ml",
  summary:
    "applied model work, retrieval flows, and agent-shaped tooling that earn their keep in real workflows.",
  seoDescription:
    "Domain page for applied AI and ML tooling, retrieval flows, and agent-based systems Dom builds.",
  thesis:
    "i use ai / ml where it removes drudge work or sharpens decisions, not where it just adds theater.",
  scope:
    "if the core value comes from model behavior or orchestration around model behavior, it belongs here.",
  belongsHere: [
    "retrieval, classification, and generation flows tied to concrete product or ops tasks",
    "agent-style actions where the interesting part is orchestration across tools and context",
    "ml-assisted features that still leave room for override, review, and practical debugging",
  ],
  supportingWork: [
    {
      title: "collection curator api",
      context:
        "an Apollo, Express, and FastAPI platform exploring a next-gen product analytics API with Bedrock, LangChain, and MCP in the stack.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/collection-curator-api",
        },
      ],
    },
    {
      title: "mcp demo",
      context:
        "a focused demo for user-driven and agent-driven actions through MCP, useful for proving the interaction model with something tangible.",
      proofLinks: [
        {
          label: "demo",
          href: "https://cdn-dev.tapestrydev.com/mcp-demo",
        },
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/mcp-demo",
        },
      ],
    },
    {
      title: "bedrock utilities in datalabs api",
      context:
        "Bedrock-backed converse, knowledge-base, and retrieve-and-generate utilities wired into a larger production API surface.",
      proofLinks: [
        {
          label: "repo",
          href: "https://github.com/tpr-datalabs/datalabs-api",
        },
      ],
    },
  ],
  relatedDomains: ["analytics", "developer-experience"],
};

export default aiMl;
