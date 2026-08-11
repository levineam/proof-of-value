import assert from "node:assert/strict";
import test from "node:test";
import {
  POST_ACTIONS, POST_COLLECTION, createFakeAtClient, publicationFromResponse,
  createFakeProvisioningOutcomeSource, validateOriginTopology, validatePostAuthorizationRequest
} from "../dist/index.js";
import { validatePublication } from "@pov/protocol";

const session = { actorDid: "did:plc:member", capabilityRef: "opaque-reference", expiresAt: "2099-01-01T00:00:00.000Z", collection: POST_COLLECTION, actions: POST_ACTIONS };
const request = { session, actorDid: "did:plc:member", recordKey: "record_4aZ6mL8pQ2xR", idempotencyKey: "retry_9bK7wN3sT5yH", text: "A public post." };

test("authorizes only the post collection and create action", async () => {
  const port = createFakeAtClient();
  assert.equal((await port.authorize({ actorDid: "did:plc:member", collection: POST_COLLECTION, actions: POST_ACTIONS })).state, "authorized");
  assert.equal(validatePostAuthorizationRequest({ actorDid: "did:plc:member", collection: POST_COLLECTION, actions: ["create", "delete"] }), "scope-invalid");
});

for (const diagnostic of ["state-invalid", "pkce-invalid", "par-invalid", "dpop-nonce-invalid", "issuer-mismatch", "returned-did-mismatch", "scope-invalid", "session-expired", "session-revoked", "pds-unavailable", "authorization-denied"]) {
  test(`safe authorization failure category: ${diagnostic}`, async () => {
    const port = createFakeAtClient({ authorization: { state: diagnostic === "pds-unavailable" ? "unavailable" : "denied", diagnostic } });
    const outcome = await port.authorize({ actorDid: "did:plc:member", collection: POST_COLLECTION, actions: POST_ACTIONS });
    assert.deepEqual(outcome, { state: diagnostic === "pds-unavailable" ? "unavailable" : "denied", diagnostic });
    assert.equal(JSON.stringify(outcome).match(/token|code|secret|password/i), null);
  });
}

test("publication succeeds only with URI and CID", async () => {
  const result = await createFakeAtClient().publish(request);
  assert.equal(result.state, "succeeded");
  if (result.state === "succeeded") {
    assert.match(result.uri, /^at:\/\/did:/);
    assert.equal(validatePublication(result).ok, true);
  }
  const cidOnly = publicationFromResponse(request, { cid: "cid-only" });
  assert.equal(cidOnly.state, "unknown");
  assert.equal(cidOnly.recovery, "reconcile-required");
  assert.equal(validatePublication(cidOnly).ok, true);
  const uriOnly = publicationFromResponse(request, { uri: `at://did:plc:member/${POST_COLLECTION}/${request.recordKey}` });
  assert.equal(uriOnly.state, "partial");
  assert.equal(uriOnly.recovery, "reconcile-required");
  assert.equal(validatePublication(uriOnly).ok, true);
  const wrongRecord = publicationFromResponse(request, { uri: "at://did:plc:member/app.bsky.feed.post/record_2aZ6mL8pQ2xR", cid: "bafywrongrecord" });
  assert.equal(wrongRecord.state, "failed");
  assert.equal(validatePublication(wrongRecord).ok, true);
  const wrongOwner = publicationFromResponse(request, { uri: `at://did:plc:other/${POST_COLLECTION}/${request.recordKey}`, cid: "bafywrongowner" });
  assert.equal(wrongOwner.state, "failed");
  assert.equal(validatePublication(wrongOwner).ok, true);
  const malformedCid = publicationFromResponse(request, { uri: `at://did:plc:member/${POST_COLLECTION}/${request.recordKey}`, cid: "bad!" });
  assert.equal(malformedCid.state, "unknown");
  assert.equal(validatePublication(malformedCid).ok, true);
});

test("a post-create partial response blocks blind retry", async () => {
  const outcome = await createFakeAtClient({ publish: "partial" }).publish(request);
  assert.equal(outcome.state, "partial");
  assert.equal(outcome.recovery, "reconcile-required");
  assert.equal(validatePublication(outcome).ok, true);
});

test("publication and reconciliation outcomes never serialize member capability or draft content", async () => {
  const publication = await createFakeAtClient().publish(request);
  const reconciliation = await createFakeAtClient({ reconciliation: "found" }).reconcile(request);
  for (const outcome of [publication, reconciliation]) {
    assert.equal("session" in outcome, false);
    assert.equal("actorDid" in outcome, false);
    assert.equal("text" in outcome, false);
    assert.equal("capabilityRef" in outcome, false);
    assert.doesNotMatch(JSON.stringify(outcome), /opaque-reference|A public post\./);
  }
});

test("unknown publication remains separate from deterministic reconciliation", async () => {
  const port = createFakeAtClient({ publish: "unknown", reconciliation: "pending" });
  const publication = await port.publish(request);
  assert.equal(publication.state, "unknown");
  assert.equal(publication.recovery, "reconcile-required");
  assert.equal(validatePublication(publication).ok, true);
  const reconciliation = await port.reconcile(request);
  assert.equal(reconciliation.state, "pending");
  assert.equal(reconciliation.retryBlocked, true);
  assert.equal((await createFakeAtClient({ reconciliation: "not-found" }).reconcile(request)).retryBlocked, false);
  assert.equal((await createFakeAtClient({ reconciliation: "found" }).reconcile(request)).state, "record-found");
});

test("expiry, revocation, and unavailable PDS cannot publish", async () => {
  const expired = await createFakeAtClient().publish({ ...request, session: { ...session, expiresAt: "2000-01-01T00:00:00.000Z" } });
  assert.equal(expired.state, "failed");
  const malformedExpiry = await createFakeAtClient().publish({ ...request, session: { ...session, expiresAt: "not-a-date" } });
  assert.equal(malformedExpiry.state, "failed");
  assert.equal((await createFakeAtClient({ publish: "revoked" }).publish(request)).state, "failed");
  assert.equal((await createFakeAtClient({ publish: "unavailable" }).publish(request)).state, "failed");
  assert.equal((await createFakeAtClient().publish({ ...request, actorDid: "did:plc:other" })).state, "failed");
  assert.equal((await createFakeAtClient().publish({ ...request, recordKey: "short" })).state, "failed");
});

test("separate registrable app and PDS domains are mandatory", () => {
  assert.equal(validateOriginTopology("https://app.swarm.example", "https://pds.swarm.example"), "issuer-mismatch");
  assert.equal(validateOriginTopology("https://app.swarm.example", "https://pds.swarm-host.example"), undefined);
});

test("provisioning states retain identity and recovery distinctions", () => {
  const cases = [
    { state: "denied", recoveryEstablished: false, safeDiagnostic: "authorization-denied" },
    { state: "identity-created-session-unavailable", did: "did:plc:member", recoveryEstablished: false, safeDiagnostic: "pds-unavailable" },
    { state: "recovery-handoff-required", did: "did:plc:member", recoveryEstablished: false },
    { state: "hosting-proof-incomplete", did: "did:plc:member", recoveryEstablished: true }
  ];
  assert.deepEqual(cases.map((item) => item.state), ["denied", "identity-created-session-unavailable", "recovery-handoff-required", "hosting-proof-incomplete"]);
});

test("provisioning fake exposes outcomes but no provisioning capability", async () => {
  const source = createFakeProvisioningOutcomeSource({ state: "identity-created-session-unavailable", did: "did:plc:member", recoveryEstablished: false, safeDiagnostic: "pds-unavailable" });
  assert.deepEqual(await source.outcome(), { state: "identity-created-session-unavailable", did: "did:plc:member", recoveryEstablished: false, safeDiagnostic: "pds-unavailable" });
  assert.equal(Object.keys(source).some((key) => /provision|secret|password|token/i.test(key)), false);
});
