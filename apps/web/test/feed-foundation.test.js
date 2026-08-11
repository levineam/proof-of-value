/* global __dirname, require */
// Node's built-in test runner loads this package as CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const assert = require("node:assert/strict");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("node:fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("node:path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "..", "app", "page.js"), "utf8");
const fixture = fs.readFileSync(path.join(__dirname, "..", "fixtures", "swarm-feed.js"), "utf8");

test("feed fixture contains five useful AT-backed contribution types", () => {
  assert.equal((fixture.match(/kind: "/g) || []).length, 5);
  for (const kind of ["Proposal", "Critique", "Implementation note", "Experiment", "Evidence request"]) assert.match(fixture, new RegExp(`kind: "${kind}"`));
  assert.equal((fixture.match(/at:\/\/did:plc:/g) || []).length, 5);
  assert.equal((fixture.match(/evaluatedCid: "bafy/g) || []).length, 5);
  assert.equal((fixture.match(/observedCid: "bafy/g) || []).length, 5);
  assert.match(source, /SWARM_FEED_POSTS/);
});

test("feed distinguishes its fixture and recovery states", () => {
  for (const state of ["Fixture data", "Admission pending", "CID changed", "Unavailable", "Deleted", "Empty feed example", "Recovery example"]) assert.match(`${source}\n${fixture}`, new RegExp(state));
  assert.match(source, /no settlement is connected/);
  assert.match(source, /There is no live account provisioning or OAuth/);
});
