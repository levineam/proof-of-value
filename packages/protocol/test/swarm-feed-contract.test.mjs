import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { validateAdmission, validateLifecycleObservation, validatePublication, selectAuthoritativeObservation } from "../dist/index.js";

const vectorRoot = new URL("../../../spec/vectors/swarm-feed/", import.meta.url);
const validators = { publication: validatePublication, admission: validateAdmission, lifecycle: validateLifecycleObservation };
for (const name of await readdir(vectorRoot)) {
  const vector = JSON.parse(await readFile(new URL(name, vectorRoot), "utf8"));
  if (!(vector.kind in validators)) continue;
  test(`vector ${name}`, () => assert.equal(validators[vector.kind](vector.value).ok, vector.valid));
}
test("newer authoritative observation wins, while stale old-PDS reads cannot resurrect deletion", () => {
  const deleted = { did: "did:plc:swarm", pds: "https://new-pds.example", state: "deleted", observedAt: "2026-08-09T12:10:00Z", ordering: { sequence: 6 }, tombstone: { uri: "at://did:plc:swarm/app.bsky.feed.post/3kz", lastKnownCid: "bafyOld", observedAt: "2026-08-09T12:10:00Z" } };
  const stale = { did: "did:plc:swarm", pds: "https://old-pds.example", state: "current", observedAt: "2026-08-09T12:09:00Z", ordering: { sequence: 5 }, uri: "at://did:plc:swarm/app.bsky.feed.post/3kz", currentCid: "bafyOld" };
  assert.equal(selectAuthoritativeObservation(deleted, stale).state, "deleted");
});
