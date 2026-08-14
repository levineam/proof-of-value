/**
 * Registers the required Swarm semantic vocabulary on an AJV-compatible
 * validator before compiling the versioned JSON Schemas in spec/protocol.
 */
const atUriParts = (value) => {
  if (typeof value !== "string") return undefined;
  const match = /^at:\/\/(did:[a-z0-9]+:[A-Za-z0-9._:%-]+)\/app\.bsky\.feed\.post\/([A-Za-z0-9._-]+)$/.exec(value);
  return match ? { did: match[1], recordKey: match[2] } : undefined;
};

export const SWARM_SCHEMA_VOCABULARY = "https://proof-of-value.org/schema/swarm-semantic-validation/v1";

export function addSwarmSchemaKeywords(ajv) {
  ajv.addKeyword({
    keyword: "swarmPublicationBinding",
    type: "object",
    schemaType: "boolean",
    errors: false,
    validate: (enabled, value) => !enabled || value.state !== "succeeded" || atUriParts(value.uri)?.recordKey === value.recordKey,
  });
  ajv.addKeyword({
    keyword: "swarmLifecycleIdentity",
    type: "object",
    schemaType: "boolean",
    errors: false,
    validate: (enabled, value) => !enabled || [value.uri, value.tombstone?.uri]
      .filter((uri) => uri !== undefined)
      .every((uri) => atUriParts(uri)?.did === value.did),
  });
  ajv.addKeyword({
    keyword: "swarmViewBindings",
    type: "object",
    schemaType: "boolean",
    errors: false,
    validate: (enabled, value) => {
      if (!enabled || !value.entry) return true;
      const { entry } = value;
      return entry.admission?.subject?.uri === entry.uri
        && entry.admission?.subject?.cid === entry.evaluatedCid
        && (entry.lifecycle?.uri === undefined || entry.lifecycle.uri === entry.uri)
        && (entry.currentCid === undefined || entry.lifecycle?.currentCid === entry.currentCid)
        && (entry.lifecycle?.tombstone?.uri === undefined || entry.lifecycle.tombstone.uri === entry.uri);
    },
  });
  ajv.addKeyword({
    keyword: "swarmSettledAllocationProvenance",
    type: "object",
    schemaType: "boolean",
    errors: false,
    validate: (enabled, value) => !enabled || value.allocation?.source !== "settled"
      || (Array.isArray(value.provenance) && value.provenance.some((item) => item !== null
        && typeof item === "object" && item.source === "koinos" && item.state === "live")),
  });
}
