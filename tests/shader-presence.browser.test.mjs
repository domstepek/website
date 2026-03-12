import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import puppeteer from "puppeteer";
import {
  startBuiltSiteServer,
  toAbsoluteUrl,
} from "./helpers/site-boundary-fixtures.mjs";

let browser;
let server;

const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];

before(async () => {
  server = await startBuiltSiteServer();
  browser = await puppeteer.launch({
    headless: true,
    args: launchArgs,
  });
});

after(async () => {
  await Promise.allSettled([
    browser?.close(),
    server?.close(),
  ]);
});

// ── Shader canvas presence on a public page ─────────────────────────

test("homepage has shader canvas with valid data-shader-renderer", async () => {
  const page = await browser.newPage();
  try {
    await page.goto(toAbsoluteUrl(server.baseUrl, "/"), {
      waitUntil: "networkidle0",
    });

    const shaderInfo = await page.evaluate(() => {
      const canvas = document.querySelector("#shader-bg");
      if (!canvas) return { present: false, renderer: null };
      return {
        present: true,
        renderer: canvas.getAttribute("data-shader-renderer"),
      };
    });

    assert.ok(shaderInfo.present, "Shader canvas #shader-bg should exist on homepage");
    assert.ok(
      ["webgpu", "webgl2", "none"].includes(shaderInfo.renderer),
      `data-shader-renderer should be 'webgpu', 'webgl2', or 'none' — got '${shaderInfo.renderer}'`,
    );
  } finally {
    await page.close();
  }
});

// ── Shader canvas present on about page too ─────────────────────────

test("about page has shader canvas", async () => {
  const page = await browser.newPage();
  try {
    await page.goto(toAbsoluteUrl(server.baseUrl, "/about/"), {
      waitUntil: "networkidle0",
    });

    const present = await page.evaluate(() =>
      Boolean(document.querySelector("#shader-bg")),
    );

    assert.ok(present, "Shader canvas #shader-bg should exist on about page");
  } finally {
    await page.close();
  }
});

// ── Shader canvas absent when disableShader is set ──────────────────

test("shader-demo page has no shader-bg canvas (disableShader opt-out)", async () => {
  const page = await browser.newPage();
  try {
    await page.goto(toAbsoluteUrl(server.baseUrl, "/shader-demo/"), {
      waitUntil: "networkidle0",
    });

    const shaderBg = await page.evaluate(() =>
      Boolean(document.querySelector("#shader-bg")),
    );

    assert.ok(
      !shaderBg,
      "Shader-demo page passes disableShader — #shader-bg should NOT exist",
    );
  } finally {
    await page.close();
  }
});
