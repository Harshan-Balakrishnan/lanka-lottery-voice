import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const worker = readFileSync(new URL("./service-worker.js", import.meta.url), "utf8");

const htmlKeys = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]));
for (const language of ["en", "si", "ta"]) {
  const start = app.indexOf(`  ${language}: {`);
  assert.notEqual(start, -1, `Missing ${language} dictionary`);
  const next = language === "en" ? "  },\n  si:" : language === "si" ? "  },\n  ta:" : "\n};";
  const end = app.indexOf(next, start);
  assert.notEqual(end, -1, `Could not parse ${language} dictionary`);
  const block = app.slice(start, end);
  const keys = new Set([...block.matchAll(/\b([A-Za-z][A-Za-z0-9]*):\s*"/g)].map((match) => match[1]));
  for (const key of htmlKeys) assert(keys.has(key), `Missing translation: ${language}.${key}`);
  for (const key of ["photoInvalidType", "photoTooLarge", "photoDimensions", "photoUnreadable", "statusTitle", "statusMessage", "statusMeta"]) {
    assert(keys.has(key), `Missing safety/UX message: ${language}.${key}`);
  }
}

assert.match(html, /id="photo-feedback"[^>]*role="status"/, "Photo validation needs an accessible status region");
assert.match(app, /MAX_PHOTO_BYTES = 10 * 1024 * 1024/, "Photo byte limit must be enforced");
assert.match(app, /MAX_PHOTO_PIXELS = 20_000_000/, "Decoded pixel limit must be enforced");
assert.match(app, /URL\.revokeObjectURL/, "Temporary image URLs must be released");
assert.match(app, /form\.dataset\.submitted === "true"/, "Dynamic status must be re-localized after language changes");
assert.match(app, /live official results and the verified rules for this lottery are not connected/, "Do not imply live result verification");
assert.match(app, /No win or loss conclusion has been made/, "Unverified ticket must not be given a win/loss verdict");
assert.match(worker, /STATIC_URLS\.has\(requestUrl\.href\)/, "Offline cache must be restricted to known shell assets");
assert.doesNotMatch(worker, /caches\.put\(event\.request/, "Do not cache arbitrary same-origin requests");
assert.match(html, /rel="noopener noreferrer"/, "External tabs must use opener protection");

console.log(`Web safety/localisation checks passed (${htmlKeys.size} translated HTML keys, 3 languages).`);
