import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { validateSwarmFeedView } from "../dist/index.js";

const vectorRoot = new URL("../../../spec/vectors/swarm-feed/", import.meta.url);
const safeVector = JSON.parse(await readFile(new URL("view-safe.json", vectorRoot), "utf8"));
for (const name of (await readdir(vectorRoot)).filter((candidate) => candidate.startsWith("view-") && candidate.endsWith(".json"))) {
  const vector = JSON.parse(await readFile(new URL(`../../../spec/vectors/swarm-feed/${name}`, import.meta.url), "utf8"));
  test(`view vector ${name}`, () => assert.equal(validateSwarmFeedView(vector.value).ok, vector.valid));
}

test("view validation bounds deep input without throwing", () => {
  const value = globalThis.structuredClone(safeVector.value);
  let cursor = value.entry;
  for (let index = 0; index < 20_000; index += 1) {
    cursor.next = {};
    cursor = cursor.next;
  }
  const result = validateSwarmFeedView(value);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.issues.includes("view exceeds inspection depth limit"), true);
});

test("view validation handles cyclic programmatic input without throwing", () => {
  const value = globalThis.structuredClone(safeVector.value);
  value.entry.cycle = value;
  const result = validateSwarmFeedView(value);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.issues.includes("unexpected entry field: cycle"), true);
});

test("view validation bounds wide objects before materializing all children", () => {
  const value = globalThis.structuredClone(safeVector.value);
  for (let index = 0; index < 12_000; index += 1) value.entry[`extra${index}`] = index;
  const result = validateSwarmFeedView(value);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.issues.includes("view exceeds inspection property limit"), true);
});
