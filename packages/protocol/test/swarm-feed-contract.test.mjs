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
  const resolution = { did: "did:plc:swarm", pds: "https://new-pds.example", observedAt: "2026-08-09T12:10:00Z", provenance: { source: "at-protocol", state: "fixture", observedAt: "2026-08-09T12:10:00Z" } };
  assert.equal(selectAuthoritativeObservation(deleted, stale, resolution)?.state, "deleted");
});

test("observation selection is identity- and resolution-scoped", () => {
  const current = { did: "did:plc:swarm", pds: "https://new-pds.example", state: "current", observedAt: "2026-08-09T12:10:00Z", ordering: { sequence: 6 }, uri: "at://did:plc:swarm/app.bsky.feed.post/3kz", currentCid: "bafyCurrent" };
  const resolution = { did: "did:plc:swarm", pds: "https://new-pds.example", observedAt: "2026-08-09T12:10:00Z", provenance: { source: "at-protocol", state: "fixture", observedAt: "2026-08-09T12:10:00Z" } };
  const differentDid = { ...current, did: "did:plc:other", uri: "at://did:plc:other/app.bsky.feed.post/3kz", ordering: { sequence: 99 } };
  const stalePds = { ...current, pds: "https://old-pds.example", ordering: { sequence: 99 } };
  assert.equal(selectAuthoritativeObservation(current, differentDid, resolution)?.did, current.did);
  assert.equal(selectAuthoritativeObservation(current, stalePds, resolution)?.did, current.did);
  assert.equal(selectAuthoritativeObservation(stalePds, stalePds, resolution), undefined);
});

test("runtime validators reject schema-invalid nested fields", () => {
  const admission = {
    admissionId: "short",
    subject: { uri: "at://did:plc:swarm/app.bsky.feed.post/3kz", cid: "bafyPost1" },
    decision: "admitted", policyVersion: "2026-08-1", authority: "system",
    observedAt: "2026-08-09T12:00:00Z", reasonCategory: "eligible", idempotencyKey: "admit_9bK7wN3sT5yH"
  };
  assert.equal(validateAdmission(admission).ok, false);
  assert.equal(validateLifecycleObservation({
    did: "did:plc:swarm", pds: "https://pds.example", state: "inactive", observedAt: "2026-08-09T12:00:00Z",
    ordering: { sequence: 7, commit: 7 }
  }).ok, false);
  assert.equal(validateLifecycleObservation({
    did: "did:plc:swarm", pds: "https://pds.example", state: "deleted", observedAt: "2026-08-09T12:00:00Z",
    ordering: { sequence: 7 }, tombstone: "not-an-object"
  }).ok, false);
});
