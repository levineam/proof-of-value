import assert from "node:assert/strict";
import test from "node:test";
import {
  checkCredentialHygiene,
  credentialScanCandidates,
  checkPackageBoundaries,
  checkRepositoryTruth,
  checkSchemasAndVectors,
  checkWorkstreamPackets,
} from "../../scripts/verify-foundation.mjs";

test("Swarm schemas and vectors retain positive and negative contract coverage", checkSchemasAndVectors);
test("five workstream packets retain maturity and plan-ID traceability", checkWorkstreamPackets);
test("truth surfaces label fixture maturity and reject obsolete MVP claims", checkRepositoryTruth);
test("read/index boundaries and tracked artifacts remain credential-safe", async () => {
  await checkPackageBoundaries();
  await checkCredentialHygiene();
  assert.equal(credentialScanCandidates(["packages/at-client/src/index.ts"]).includes("packages/at-client/src/index.ts"), true);
  assert.ok(true);
});
