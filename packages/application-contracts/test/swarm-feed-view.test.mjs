import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { validateSwarmFeedView } from "../dist/index.js";

const vectorRoot = new URL("../../../spec/vectors/swarm-feed/", import.meta.url);
for (const name of (await readdir(vectorRoot)).filter((candidate) => candidate.startsWith("view-") && candidate.endsWith(".json"))) {
  const vector = JSON.parse(await readFile(new URL(`../../../spec/vectors/swarm-feed/${name}`, import.meta.url), "utf8"));
  test(`view vector ${name}`, () => assert.equal(validateSwarmFeedView(vector.value).ok, vector.valid));
}

test("view validation bounds deep input without throwing", () => {
  const value = { entry: {}, provenance: [] };
  let cursor = value;
  for (let index = 0; index < 20_000; index += 1) {
    cursor.next = {};
    cursor = cursor.next;
  }
  assert.doesNotThrow(() => assert.equal(validateSwarmFeedView(value).ok, false));
});

test("view validation handles cyclic programmatic input without throwing", () => {
  const value = { entry: {}, provenance: [] };
  value.entry.cycle = value;
  assert.doesNotThrow(() => assert.equal(validateSwarmFeedView(value).ok, false));
});
