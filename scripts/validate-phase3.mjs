import { access, readFile, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const INDEX_PATH = resolve(DIST_DIR, "index.html");
const DOMAIN_SLUGS = [
  "analytics",
  "infrastructure",
  "ai-ml",
  "product",
  "developer-experience",
];
const REQUIRED_CONTACT_PROTOCOLS = {
  github: "https:",
  linkedin: "https:",
  email: "mailto:",
};

const failures = [];

const normalizePathname = (value) => {
  if (!value || value === "/") {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const joinPathname = (basePath, ...segments) => {
  const normalizedBasePath = normalizePathname(basePath);
  const normalizedSegments = segments
    .map((segment) => String(segment).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);

  if (normalizedSegments.length === 0) {
    return normalizedBasePath;
  }

  if (normalizedBasePath === "/") {
    return `/${normalizedSegments.join("/")}/`;
  }

  return `${normalizedBasePath}${normalizedSegments.join("/")}/`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripTags = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

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

const getAnchorsWithAttribute = (html, attributeName) => {
  const pattern = new RegExp(
    `<a\\b[^>]*\\b${escapeRegExp(attributeName)}\\b[^>]*>([\\s\\S]*?)<\\/a>`,
    "gi",
  );

  return Array.from(html.matchAll(pattern), ([fullMatch, innerHtml]) => {
    const openingTag = fullMatch.match(/^<a\b[^>]*>/i)?.[0] ?? "<a>";

    return {
      attributes: parseAttributes(openingTag),
      text: stripTags(innerHtml),
    };
  });
};

const getElementTextByAttribute = (html, attributeName) => {
  const pattern = new RegExp(
    `<([a-zA-Z][\\w:-]*)\\b[^>]*\\b${escapeRegExp(attributeName)}\\b[^>]*>([\\s\\S]*?)<\\/\\1>`,
    "i",
  );
  const match = html.match(pattern);

  return match ? stripTags(match[2]) : "";
};

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

const expectUrlProtocol = (value, label, protocol) => {
  expectNonEmpty(value, label);

  if (!value?.trim()) {
    return;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== protocol) {
      failures.push(`${label} must use ${protocol}, received "${value}".`);
    }
  } catch {
    failures.push(`${label} must be a valid ${protocol} URL, received "${value}".`);
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

const getExpectedDomainHrefs = (canonicalHref) => {
  try {
    const canonicalUrl = new URL(canonicalHref);
    const basePath = normalizePathname(canonicalUrl.pathname);

    return DOMAIN_SLUGS.map((slug) => joinPathname(basePath, "domains", slug));
  } catch {
    return [];
  }
};

await expectFile(INDEX_PATH, "Homepage artifact");

if (failures.length === 0) {
  const homepageHtml = await readFile(INDEX_PATH, "utf8");

  const homepageTitle = getTitle(homepageHtml);
  const homepageCanonical = getLinkHref(homepageHtml, "canonical");

  expectNonEmpty(homepageTitle, "Homepage <title>");
  expectAbsoluteHttpUrl(homepageCanonical, 'Homepage link rel="canonical"');

  const heroMarkers = getElementsWithAttribute(homepageHtml, "data-home-hero");
  if (heroMarkers.length === 0) {
    failures.push("Homepage is missing the data-home-hero marker.");
  } else {
    expectNonEmpty(
      getElementTextByAttribute(homepageHtml, "data-home-hero"),
      "Homepage hero marker text",
    );
  }

  const domainLinks = getAnchorsWithAttribute(homepageHtml, "data-home-domain-link");
  if (domainLinks.length !== DOMAIN_SLUGS.length) {
    failures.push(
      `Homepage should expose exactly ${DOMAIN_SLUGS.length} data-home-domain-link anchors, received ${domainLinks.length}.`,
    );
  }

  domainLinks.forEach((link, index) => {
    expectNonEmpty(link.text, `Homepage domain link #${index + 1} text`);
    expectNonEmpty(link.attributes.href ?? "", `Homepage domain link #${index + 1} href`);
  });

  const actualDomainHrefs = domainLinks.map((link) => link.attributes.href ?? "");
  const expectedDomainHrefs = getExpectedDomainHrefs(homepageCanonical);

  if (expectedDomainHrefs.length > 0) {
    const missingHrefs = expectedDomainHrefs.filter((href) => !actualDomainHrefs.includes(href));
    const unexpectedHrefs = actualDomainHrefs.filter((href) => !expectedDomainHrefs.includes(href));

    if (missingHrefs.length > 0 || unexpectedHrefs.length > 0) {
      failures.push(
        `Homepage domain hrefs should match the base-aware expected paths. Missing: ${
          missingHrefs.join(", ") || "none"
        }. Unexpected: ${unexpectedHrefs.join(", ") || "none"}.`,
      );
    }
  }

  const contactLinks = getAnchorsWithAttribute(homepageHtml, "data-home-contact-link");
  if (contactLinks.length === 0) {
    failures.push("Homepage is missing data-home-contact-link anchors.");
  }

  for (const [label, protocol] of Object.entries(REQUIRED_CONTACT_PROTOCOLS)) {
    const matchingLink = contactLinks.find((link) => link.text.toLowerCase() === label);

    if (!matchingLink) {
      failures.push(`Homepage is missing the "${label}" contact link marker.`);
      continue;
    }

    expectUrlProtocol(
      matchingLink.attributes.href ?? "",
      `Homepage ${label} contact href`,
      protocol,
    );
  }

  const freshnessMarkers = getElementsWithAttribute(homepageHtml, "data-home-freshness");
  if (freshnessMarkers.length === 0) {
    failures.push("Homepage is missing the data-home-freshness marker.");
  } else {
    expectNonEmpty(
      getElementTextByAttribute(homepageHtml, "data-home-freshness"),
      "Homepage freshness marker text",
    );
  }
}

if (failures.length > 0) {
  console.error("Phase 3 validation failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Phase 3 validation passed.");
console.log("- Built homepage artifact exists and includes page metadata.");
console.log("- Hero, domain navigation, contact links, and freshness markers are present.");
console.log("- Domain hrefs are base-aware and contact link protocols match the required shape.");
