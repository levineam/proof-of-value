import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateSwarmFeedView } from "../dist/index.js";

for (const name of ["view-safe.json", "view-secret-invalid.json"]) {
  const vector = JSON.parse(await readFile(new URL(`../../../spec/vectors/swarm-feed/${name}`, import.meta.url), "utf8"));
  test(`view vector ${name}`, () => assert.equal(validateSwarmFeedView(vector.value).ok, vector.valid));
}
