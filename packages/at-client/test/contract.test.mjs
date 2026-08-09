import assert from "node:assert/strict";
import test from "node:test";
import {
  POST_ACTIONS, POST_COLLECTION, createFakeAtClient, publicationFromResponse,
  createFakeProvisioningOutcomeSource, validateOriginTopology, validatePostAuthorizationRequest
} from "../dist/index.js";

const session = { actorDid: "did:plc:member", capabilityRef: "opaque-reference", expiresAt: "2099-01-01T00:00:00.000Z", collection: POST_COLLECTION, actions: POST_ACTIONS };
const request = { session, actorDid: "did:plc:member", recordKey: "record-1", idempotencyKey: "idempotency-1", text: "A public post." };

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
  if (result.state === "succeeded") assert.match(result.uri, /^at:\/\/did:/);
  const cidOnly = publicationFromResponse(request, { cid: "cid-only" });
  assert.equal(cidOnly.state, "unknown");
  if (cidOnly.state === "unknown") assert.equal(cidOnly.retryBlocked, true);
  const uriOnly = publicationFromResponse(request, { uri: "at://did:plc:member/app.bsky.feed.post/record-1" });
  assert.equal(uriOnly.state, "unknown");
  if (uriOnly.state === "unknown") assert.equal(uriOnly.retryBlocked, true);
  const wrongRecord = publicationFromResponse(request, { uri: "at://did:plc:member/app.bsky.feed.post/record-2", cid: "bafywrongrecord" });
  assert.deepEqual(wrongRecord, {
    state: "unknown", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "publication-unknown", retryBlocked: true
  });
  assert.deepEqual(publicationFromResponse(request, { uri: "at://did:plc:other/app.bsky.feed.post/record-1", cid: "bafywrongowner" }), {
    state: "failed", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "returned-did-mismatch"
  });
});

test("a post-create partial response blocks blind retry", async () => {
  const outcome = await createFakeAtClient({ publish: "partial" }).publish(request);
  assert.deepEqual(outcome, { state: "unknown", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "publication-unknown", retryBlocked: true });
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

test("unknown publication blocks retry until deterministic reconciliation", async () => {
  const port = createFakeAtClient({ publish: "unknown", reconciliation: "pending" });
  const publication = await port.publish(request);
  assert.deepEqual(publication, { state: "unknown", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "publication-unknown", retryBlocked: true });
  const reconciliation = await port.reconcile(request);
  assert.equal(reconciliation.state, "pending");
  assert.equal(reconciliation.retryBlocked, true);
  assert.equal((await createFakeAtClient({ reconciliation: "not-found" }).reconcile(request)).retryBlocked, false);
  assert.equal((await createFakeAtClient({ reconciliation: "found" }).reconcile(request)).state, "record-found");
});

test("expiry, revocation, and unavailable PDS cannot publish", async () => {
  const expired = await createFakeAtClient().publish({ ...request, session: { ...session, expiresAt: "2000-01-01T00:00:00.000Z" } });
  assert.deepEqual(expired.diagnostic, "session-expired");
  assert.equal((await createFakeAtClient({ publish: "revoked" }).publish(request)).diagnostic, "session-revoked");
  assert.equal((await createFakeAtClient({ publish: "unavailable" }).publish(request)).diagnostic, "pds-unavailable");
  assert.equal((await createFakeAtClient().publish({ ...request, actorDid: "did:plc:other" })).diagnostic, "returned-did-mismatch");
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
