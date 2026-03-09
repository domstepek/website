import { access, readFile, stat } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { resolve } from "node:path";

const DIST_DIR = resolve(process.cwd(), "dist");
const INDEX_PATH = resolve(DIST_DIR, "index.html");
const NOT_FOUND_PATH = resolve(DIST_DIR, "404.html");
const FAVICON_PATH = resolve(DIST_DIR, "favicon.svg");
const OG_IMAGE_PATH = resolve(DIST_DIR, "og-default.png");

const failures = [];

const parseAttributes = (tag) => {
  const attributes = {};
  const attributePattern = /([a-zA-Z:-]+)\s*=\s*(["'])(.*?)\2/g;

  for (const [, name, , value] of tag.matchAll(attributePattern)) {
    attributes[name.toLowerCase()] = value.trim();
  }

  return attributes;
};

const getTags = (html, tagName) => {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  return Array.from(html.matchAll(tagPattern), ([tag]) => parseAttributes(tag));
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

const expectAbsoluteUrl = (value, label) => {
  expectNonEmpty(value, label);

  if (!value?.trim()) {
    return;
  }

  try {
    new URL(value);
  } catch {
    failures.push(`${label} must be an absolute URL, received "${value}".`);
  }
};

const getMetaContent = (html, key, value) => {
  const metaTag = getTags(html, "meta").find((tag) => tag[key] === value);
  return metaTag?.content ?? "";
};

const getLinkHref = (html, relation) => {
  const linkTag = getTags(html, "link").find((tag) => tag.rel === relation);
  return linkTag?.href ?? "";
};

await Promise.all([
  expectFile(INDEX_PATH, "Homepage artifact"),
  expectFile(NOT_FOUND_PATH, "404 artifact"),
  expectFile(FAVICON_PATH, "Favicon asset"),
  expectFile(OG_IMAGE_PATH, "Default Open Graph asset"),
]);

if (failures.length === 0) {
  const homepageHtml = await readFile(INDEX_PATH, "utf8");
  const notFoundHtml = await readFile(NOT_FOUND_PATH, "utf8");

  const homepageTitle = homepageHtml.match(/<title>\s*([^<]+?)\s*<\/title>/i)?.[1] ?? "";
  const homepageDescription = getMetaContent(homepageHtml, "name", "description");
  const homepageCanonical = getLinkHref(homepageHtml, "canonical");
  const homepageOgTitle = getMetaContent(homepageHtml, "property", "og:title");
  const homepageOgDescription = getMetaContent(homepageHtml, "property", "og:description");
  const homepageOgImage = getMetaContent(homepageHtml, "property", "og:image");
  const homepageFavicon = getLinkHref(homepageHtml, "icon");

  expectNonEmpty(homepageTitle, "Homepage <title>");
  expectNonEmpty(homepageDescription, 'Homepage meta name="description"');
  expectAbsoluteUrl(homepageCanonical, 'Homepage link rel="canonical"');
  expectNonEmpty(homepageOgTitle, 'Homepage meta property="og:title"');
  expectNonEmpty(homepageOgDescription, 'Homepage meta property="og:description"');
  expectAbsoluteUrl(homepageOgImage, 'Homepage meta property="og:image"');
  expectNonEmpty(homepageFavicon, 'Homepage link rel="icon"');

  if (homepageFavicon && !homepageFavicon.endsWith("/favicon.svg")) {
    failures.push(`Homepage favicon should point to favicon.svg, received "${homepageFavicon}".`);
  }

  if (homepageOgImage && !homepageOgImage.endsWith("/og-default.png")) {
    failures.push(`Homepage og:image should point to og-default.png, received "${homepageOgImage}".`);
  }

  const robotsDirective = getMetaContent(notFoundHtml, "name", "robots");

  if (!robotsDirective.toLowerCase().includes("noindex")) {
    failures.push('404 page is missing a "noindex" robots directive.');
  }

  const homeLink = notFoundHtml.match(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>\s*([^<]*home[^<]*)\s*<\/a>/i,
  );

  if (!homeLink?.[1]?.trim()) {
    failures.push("404 page is missing a non-empty link back to the homepage.");
  }
}

if (failures.length > 0) {
  console.error("Phase 1 validation failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Phase 1 validation passed.");
console.log("- Homepage metadata is present.");
console.log("- Built favicon and OG assets exist.");
console.log("- 404 artifact includes noindex and a homepage recovery link.");
