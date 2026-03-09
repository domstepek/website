import { access, readFile, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const DOMAIN_SLUGS = [
  "analytics",
  "infrastructure",
  "ai-ml",
  "product",
  "developer-experience",
];

const failures = [];

const normalizePathname = (value) => {
  if (!value) {
    return "/";
  }

  return value.endsWith("/") ? value : `${value}/`;
};

const parseAttributes = (tag) => {
  const attributes = {};
  const innerTag = tag.replace(/^<[^\s>]+\s*/, "").replace(/\s*\/?>$/, "");
  const attributePattern =
    /([^\s=\/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const [, rawName, doubleQuoted, singleQuoted, bareValue] of innerTag.matchAll(
    attributePattern,
  )) {
    const name = rawName.toLowerCase();

    if (!name || name === "/") {
      continue;
    }

    attributes[name] = (doubleQuoted ?? singleQuoted ?? bareValue ?? "").trim();
  }

  return attributes;
};

const getStartTags = (html) =>
  Array.from(html.matchAll(/<([a-zA-Z][\w:-]*)(?:\s[^>]*?)?>/g), ([tag, name]) => ({
    tag,
    name: name.toLowerCase(),
    attributes: parseAttributes(tag),
  }));

const getTags = (html, tagName) =>
  getStartTags(html).filter((tag) => tag.name === tagName.toLowerCase());

const getElementsWithAttribute = (html, attributeName) =>
  getStartTags(html).filter((tag) =>
    Object.prototype.hasOwnProperty.call(tag.attributes, attributeName.toLowerCase()),
  );

const expectFile = async (filePath, label) => {
  try {
    await access(filePath, fsConstants.F_OK);
    const fileStats = await stat(filePath);

    if (fileStats.size === 0) {
      failures.push(`${label} exists but is empty (${filePath}).`);
    }
  } catch {
    failures.push(`${label} is missing (${filePath}).`);
  }
};

const expectNonEmpty = (value, label) => {
  if (!value?.trim()) {
    failures.push(`${label} is missing or empty.`);
  }
};

const expectAbsoluteHttpUrl = (value, label) => {
  expectNonEmpty(value, label);

  if (!value?.trim()) {
    return;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      failures.push(`${label} must use http or https, received "${value}".`);
    }
  } catch {
    failures.push(`${label} must be an absolute http(s) URL, received "${value}".`);
  }
};

const getLinkHref = (html, relation) => {
  const linkTag = getTags(html, "link").find((tag) =>
    (tag.attributes.rel ?? "")
      .split(/\s+/)
      .map((value) => value.toLowerCase())
      .includes(relation.toLowerCase()),
  );

  return linkTag?.attributes.href ?? "";
};

const getTitle = (html) => html.match(/<title>\s*([^<]+?)\s*<\/title>/i)?.[1] ?? "";

const getExpectedHomeHref = (canonicalHref, slug) => {
  try {
    const canonicalUrl = new URL(canonicalHref);
    const suffix = `/domains/${slug}/`;

    if (!canonicalUrl.pathname.endsWith(suffix)) {
      failures.push(
        `${slug}: canonical URL pathname should end with "${suffix}", received "${canonicalUrl.pathname}".`,
      );
      return "";
    }

    const homePath = canonicalUrl.pathname.slice(0, -suffix.length) || "/";
    return normalizePathname(homePath);
  } catch {
    return "";
  }
};

const validateDomainArtifact = async (slug) => {
  const artifactPath = resolve(DIST_DIR, "domains", slug, "index.html");

  await expectFile(artifactPath, `${slug} domain artifact`);

  if (failures.some((failure) => failure.includes(`${slug} domain artifact`))) {
    return;
  }

  const html = await readFile(artifactPath, "utf8");
  const title = getTitle(html);
  const canonicalHref = getLinkHref(html, "canonical");

  expectNonEmpty(title, `${slug}: <title>`);
  expectAbsoluteHttpUrl(canonicalHref, `${slug}: link rel="canonical"`);

  const domainPages = getElementsWithAttribute(html, "data-domain-page");
  if (domainPages.length === 0) {
    failures.push(`${slug}: missing data-domain-page marker.`);
  }

  const thesisBlocks = getElementsWithAttribute(html, "data-domain-thesis");
  if (thesisBlocks.length === 0) {
    failures.push(`${slug}: missing data-domain-thesis marker.`);
  }

  const supportingSections = getElementsWithAttribute(html, "data-supporting-work");
  if (supportingSections.length === 0) {
    failures.push(`${slug}: missing data-supporting-work marker.`);
  }

  const supportingItems = getElementsWithAttribute(html, "data-supporting-item");
  if (supportingItems.length === 0) {
    failures.push(`${slug}: missing rendered data-supporting-item entries.`);
  }

  const backHomeLinks = getElementsWithAttribute(html, "data-back-home");
  if (backHomeLinks.length === 0) {
    failures.push(`${slug}: missing data-back-home link.`);
  }

  const expectedHomeHref = getExpectedHomeHref(canonicalHref, slug);
  const backHomeHref = backHomeLinks[0]?.attributes.href ?? "";

  if (backHomeLinks.length > 0) {
    expectNonEmpty(backHomeHref, `${slug}: data-back-home href`);

    if (expectedHomeHref && backHomeHref && backHomeHref !== expectedHomeHref) {
      failures.push(
        `${slug}: data-back-home href should be "${expectedHomeHref}", received "${backHomeHref}".`,
      );
    }
  }

  const proofLinks = getElementsWithAttribute(html, "data-proof-link");
  if (proofLinks.length === 0) {
    failures.push(`${slug}: missing outward data-proof-link entries.`);
  }

  proofLinks.forEach((tag, index) => {
    expectAbsoluteHttpUrl(
      tag.attributes.href ?? "",
      `${slug}: data-proof-link #${index + 1} href`,
    );
  });
};

await Promise.all(DOMAIN_SLUGS.map((slug) => validateDomainArtifact(slug)));

if (failures.length > 0) {
  console.error("Phase 2 validation failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Phase 2 validation passed.");
console.log("- All five domain artifacts exist in dist.");
console.log("- Each built domain page exposes canonical metadata and the required markers.");
console.log("- Back-home links resolve to the base-aware home path.");
console.log("- Proof links are present and use absolute http(s) URLs.");
