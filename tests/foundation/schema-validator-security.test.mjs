import assert from "node:assert/strict";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { addSwarmSchemaKeywords } from "@pov/schema-validator";

const ajv = new Ajv2020({ allErrors: true, strict: false });
addSwarmSchemaKeywords(ajv);

const validate = ajv.compile({
  type: "object",
  properties: {
    provenance: {
      type: "array",
      items: { type: "object" },
    },
  },
  swarmSettledAllocationProvenance: true,
});

test("settled allocation provenance rejects malformed untrusted values without throwing", () => {
  for (const provenance of [{ some: 42 }, [null]]) {
    assert.doesNotThrow(() => validate({ allocation: { source: "settled" }, provenance }));
    assert.equal(validate({ allocation: { source: "settled" }, provenance }), false);
  }
});

test("settled allocation provenance retains live Koinos validation", () => {
  assert.equal(validate({
    allocation: { source: "settled" },
    provenance: [{ source: "koinos", state: "live" }],
  }), true);
  assert.equal(validate({ allocation: { source: "settled" }, provenance: [] }), false);
});
