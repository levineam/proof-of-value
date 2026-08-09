const didUri = /^at:\/\/did:[^/]+\/app\.bsky\.feed\.post\/[A-Za-z0-9._-]+$/;
const opaque = /^[A-Za-z0-9_-]{16,128}$/;
const object = (input) => typeof input === "object" && input !== null && !Array.isArray(input);
const text = (value) => typeof value === "string" && value.length > 0;
const timestamp = (value) => text(value) && !Number.isNaN(Date.parse(value));
const only = (input, keys, issues) => Object.keys(input).filter((key) => !keys.includes(key)).forEach((key) => issues.push(`unexpected field: ${key}`));
const finish = (value, issues) => issues.length ? { ok: false, issues } : { ok: true, value: value };
export function validatePublication(value) {
    const issues = [];
    if (!object(value))
        return { ok: false, issues: ["publication must be an object"] };
    only(value, ["recordKey", "idempotencyKey", "state", "observedAt", "uri", "cid", "reasonCategory"], issues);
    if (!opaque.test(String(value.recordKey ?? "")))
        issues.push("recordKey must be an opaque durable key");
    if (!opaque.test(String(value.idempotencyKey ?? "")))
        issues.push("idempotencyKey must be an opaque correlation key");
    if (!["succeeded", "unknown", "partial", "failed"].includes(String(value.state)))
        issues.push("invalid publication state");
    if (!timestamp(value.observedAt))
        issues.push("observedAt must be an ISO timestamp");
    if (value.state === "succeeded" && (!didUri.test(String(value.uri ?? "")) || !text(value.cid)))
        issues.push("succeeded publication requires DID URI and CID");
    if (["unknown", "partial"].includes(String(value.state)) && (value.uri !== undefined || value.cid !== undefined))
        issues.push("unknown or partial publication must reconcile before asserting URI or CID");
    if (value.uri !== undefined && !didUri.test(String(value.uri)))
        issues.push("uri must be a DID-based app.bsky.feed.post URI");
    if (value.reasonCategory !== undefined && !["denied", "callback-mismatch", "scope-escalation", "rate-limited", "unavailable", "invalid-request"].includes(String(value.reasonCategory)))
        issues.push("invalid reasonCategory");
    return finish(value, issues);
}
export function validateAccountResolution(value) {
    const issues = [];
    if (!object(value))
        return { ok: false, issues: ["account resolution must be an object"] };
    only(value, ["did", "pds", "repositoryRevision", "observedAt", "provenance"], issues);
    if (!String(value.did ?? "").startsWith("did:") || !String(value.pds ?? "").startsWith("https://") || !timestamp(value.observedAt))
        issues.push("invalid account resolution");
    const provenance = validateProvenance(value.provenance);
    if (!provenance.ok)
        issues.push(...provenance.issues);
    return finish(value, issues);
}
export function validateAdmission(value) {
    const issues = [];
    if (!object(value))
        return { ok: false, issues: ["admission must be an object"] };
    only(value, ["admissionId", "subject", "decision", "policyVersion", "authority", "observedAt", "reasonCategory", "idempotencyKey"], issues);
    const subject = value.subject;
    if (!text(value.admissionId) || !object(subject) || !didUri.test(String(subject.uri ?? "")) || !text(subject.cid))
        issues.push("admission needs URI-plus-CID subject");
    if (!["admitted", "pending", "rejected", "revoked"].includes(String(value.decision)))
        issues.push("invalid admission decision");
    if (!text(value.policyVersion) || !["system", "moderator", "member"].includes(String(value.authority)) || !timestamp(value.observedAt) || !opaque.test(String(value.idempotencyKey ?? "")))
        issues.push("invalid admission metadata");
    if (!["eligible", "review", "policy", "spam", "withdrawn", "unknown"].includes(String(value.reasonCategory)))
        issues.push("invalid admission reason");
    return finish(value, issues);
}
export function validateLifecycleObservation(value) {
    const issues = [];
    if (!object(value))
        return { ok: false, issues: ["lifecycle observation must be an object"] };
    only(value, ["did", "pds", "state", "observedAt", "ordering", "uri", "currentCid", "repositoryRevision", "tombstone"], issues);
    if (!String(value.did ?? "").startsWith("did:") || !String(value.pds ?? "").startsWith("https://") || !timestamp(value.observedAt))
        issues.push("invalid authoritative account observation");
    if (!["current", "deleted", "inactive", "unavailable", "migrated"].includes(String(value.state)))
        issues.push("invalid lifecycle state");
    if (!object(value.ordering) || !Number.isInteger(value.ordering.sequence) || Number(value.ordering.sequence) < 0)
        issues.push("ordering.sequence is required");
    if (value.state === "current" && (!didUri.test(String(value.uri ?? "")) || !text(value.currentCid)))
        issues.push("current state requires URI and current CID");
    const tombstone = object(value.tombstone) ? value.tombstone : undefined;
    if (value.state === "deleted" && (!tombstone || !didUri.test(String(tombstone.uri ?? "")) || !text(tombstone.lastKnownCid) || !timestamp(tombstone.observedAt)))
        issues.push("deleted state requires minimal tombstone evidence");
    if (tombstone && ["text", "embed", "record"].some((field) => field in tombstone))
        issues.push("tombstone cannot cache post body or embeds");
    return finish(value, issues);
}
/** Higher sequence wins; terminal delete/inactive observations cannot be resurrected by stale reads. */
export function selectAuthoritativeObservation(current, candidate) {
    if (!current)
        return candidate;
    if (candidate.ordering.sequence < current.ordering.sequence)
        return current;
    if (candidate.ordering.sequence === current.ordering.sequence && candidate.observedAt <= current.observedAt)
        return current;
    if (["deleted", "inactive"].includes(current.state) && candidate.ordering.sequence <= current.ordering.sequence)
        return current;
    return candidate;
}
export function validateProvenance(value) {
    const issues = [];
    if (!object(value))
        return { ok: false, issues: ["provenance must be an object"] };
    only(value, ["source", "state", "observedAt"], issues);
    if (!["at-protocol", "swarm-admission", "pov-evaluation", "koinos", "fixture"].includes(String(value.source)) || !["live", "fixture", "simulated", "unavailable", "unknown"].includes(String(value.state)) || !timestamp(value.observedAt))
        issues.push("invalid provenance");
    return finish(value, issues);
}
