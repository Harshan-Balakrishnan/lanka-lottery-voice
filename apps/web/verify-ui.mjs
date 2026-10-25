import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const dictionaryStart = app.indexOf("const translations = ");
const dictionaryEnd = app.indexOf("\n\nconst languageSelect", dictionaryStart);
assert.notEqual(dictionaryStart, -1, "translation dictionary must exist");
assert.notEqual(dictionaryEnd, -1, "translation dictionary must end before app setup");
const dictionarySource = app.slice(dictionaryStart, dictionaryEnd).replace("const translations = ", "globalThis.translations = ");
const context = {};
vm.runInNewContext(dictionarySource, context, { timeout: 1000 });
const translations = context.translations;
assert.deepEqual(Object.keys(translations).sort(), ["en", "si", "ta"], "English, Sinhala and Tamil dictionaries must all exist");

const htmlKeys = [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]))];
for (const language of ["en", "si", "ta"]) {
  for (const key of htmlKeys) {
    assert.equal(typeof translations[language][key], "string", `Missing ${language} translation for data-i18n="${key}"`);
    assert.ok(translations[language][key].trim().length > 0, `Empty ${language} translation for ${key}`);
  }
  assert.ok(translations[language].statusTitle, `Missing ${language} unavailable-status title`);
  assert.ok(translations[language].statusMessage.includes(language === "en" ? "No win or loss conclusion" : language === "si" ? "ජයග්‍රහණයක් හෝ පරාජයක්" : "வெற்றி அல்லது தோல்வி"), `Status must avoid a win/loss verdict in ${language}`);
}
assert.ok(!/[\u0B80-\u0BFF]/u.test(translations.si.statusTitle), "Sinhala status title must not contain Tamil-script text");
assert.match(html, /Photo text-reading is not connected yet|Photo text-reading/i, "UI must disclose that OCR is not implemented");
assert.match(html, /not connected to live official results yet/i, "UI must disclose that live official results are not connected");
for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  assert.match(match[0], /rel="[^"]*noopener[^"]*"/, "new-tab links must include noopener");
  assert.match(match[0], /rel="[^"]*noreferrer[^"]*"/, "new-tab links must include noreferrer");
}
assert.match(app, /URL\.revokeObjectURL/, "temporary local image URLs must be released");
assert.match(app, /file\.size > 10 \* 1024 \* 1024/, "image file size must be bounded");
assert.match(app, /No win or loss conclusion has been made/, "submission must fail closed without a verdict");
console.log("Web safety/localisation checks passed (3 languages, UI keys, privacy disclosures, safe links, image bounds).");
