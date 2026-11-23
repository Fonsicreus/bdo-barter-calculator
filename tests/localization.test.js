import { expect, test } from "bun:test";
import { japanese } from "../src/i18n/japanese";
import { korean } from "../src/i18n/korean";
import { simplifiedChinese } from "../src/i18n/simplifiedChinese";
import { spanish } from "../src/i18n/spanish";

function placeholders(text) {
  return [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

test.each([
  ["Korean", korean],
  ["Japanese", japanese],
  ["Simplified Chinese", simplifiedChinese],
])("%s covers the interface and preserves interpolation placeholders", (_language, dictionary) => {
  expect(Object.keys(spanish).filter((key) => !Object.hasOwn(dictionary, key))).toEqual([]);
  const invalidTemplates = Object.entries(dictionary).filter(([source, translation]) => {
    return !translation.trim() || placeholders(source).join() !== placeholders(translation).join();
  });
  expect(invalidTemplates).toEqual([]);
});
