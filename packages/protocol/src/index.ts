/** Dependency-free contracts for AT facts and Swarm-derived facts. */
export type ProvenanceSource = "at-protocol" | "swarm-admission" | "pov-evaluation" | "koinos" | "fixture";
export type SourceState = "live" | "fixture" | "simulated" | "unavailable" | "unknown";
export interface Provenance { source: ProvenanceSource; state: SourceState; observedAt: string }
export interface ContentReference { uri: string; cid: string }
export interface Publication {
  recordKey: string; idempotencyKey: string; state: "succeeded" | "unknown" | "partial" | "failed"; observedAt: string;
  uri?: string; cid?: string; reasonCategory?: "denied" | "callback-mismatch" | "scope-escalation" | "rate-limited" | "unavailable" | "invalid-request";
  recovery?: "reconcile-required";
}
export interface Admission {
  admissionId: string; subject: ContentReference; decision: "admitted" | "pending" | "rejected" | "revoked";
  policyVersion: string; authority: "system" | "moderator" | "member"; observedAt: string;
  reasonCategory: "eligible" | "review" | "policy" | "spam" | "withdrawn" | "unknown"; idempotencyKey: string;
}
export interface LifecycleObservation {
  did: string; pds: string; state: "current" | "deleted" | "inactive" | "unavailable" | "migrated";
  observedAt: string; ordering: { sequence: number; commit?: string }; uri?: string; currentCid?: string;
  repositoryRevision?: string; tombstone?: { uri: string; lastKnownCid: string; observedAt: string };
}
export interface AccountResolution { did: string; pds: string; repositoryRevision?: string; observedAt: string; provenance: Provenance }
export type Validation<T> = { ok: true; value: T } | { ok: false; issues: string[] };
type Json = Record<string, unknown>;
const didUri = /^at:\/\/did:[a-z0-9]+:[A-Za-z0-9._:%-]+\/app\.bsky\.feed\.post\/[A-Za-z0-9._-]+$/;
const didValue = /^did:[a-z0-9]+:[A-Za-z0-9._:%-]+$/;
const opaque = /^[A-Za-z0-9_-]{16,128}$/;
const cidValue = /^[A-Za-z0-9]+$/;
const object = (input: unknown): input is Json => typeof input === "object" && input !== null && !Array.isArray(input);
const text = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const timestamp = (value: unknown): value is string => text(value) && !Number.isNaN(Date.parse(value));
const only = (input: Json, keys: readonly string[], issues: string[]) => Object.keys(input).filter((key) => !keys.includes(key)).forEach((key) => issues.push(`unexpected field: ${key}`));
const finish = <T>(value: unknown, issues: string[]): Validation<T> => issues.length ? { ok: false, issues } : { ok: true, value: value as T };
export const isOpaqueKey = (value: string): boolean => opaque.test(value);
export const isCid = (value: string): boolean => cidValue.test(value);
export const parseAtPostUri = (value: unknown): { did: string; recordKey: string } | undefined => {
  if (typeof value !== "string") return undefined;
  const match = /^at:\/\/(did:[a-z0-9]+:[A-Za-z0-9._:%-]+)\/app\.bsky\.feed\.post\/([A-Za-z0-9._-]+)$/.exec(value);
  return match ? { did: match[1], recordKey: match[2] } : undefined;
};

export function validatePublication(value: unknown): Validation<Publication> {
  const issues: string[] = []; if (!object(value)) return { ok: false, issues: ["publication must be an object"] };
  only(value, ["recordKey", "idempotencyKey", "state", "observedAt", "uri", "cid", "reasonCategory", "recovery"], issues);
  if (!isOpaqueKey(String(value.recordKey ?? ""))) issues.push("recordKey must be an opaque durable key");
  if (!isOpaqueKey(String(value.idempotencyKey ?? ""))) issues.push("idempotencyKey must be an opaque correlation key");
  if (!["succeeded", "unknown", "partial", "failed"].includes(String(value.state))) issues.push("invalid publication state");
  if (!timestamp(value.observedAt)) issues.push("observedAt must be an ISO timestamp");
  const publicationUri = parseAtPostUri(value.uri);
  if (value.state === "succeeded" && (!publicationUri || publicationUri.recordKey !== value.recordKey || !text(value.cid) || !isCid(String(value.cid ?? "")))) issues.push("succeeded publication requires matching DID URI and CID");
  if (["unknown", "partial", "failed"].includes(String(value.state)) && (value.uri !== undefined || value.cid !== undefined)) issues.push("non-success publication must reconcile before asserting URI or CID");
  if (["unknown", "partial"].includes(String(value.state)) && value.recovery !== "reconcile-required") issues.push("unknown and partial publication require reconciliation before retry");
  if (["succeeded", "failed"].includes(String(value.state)) && value.recovery !== undefined) issues.push("recovery directives apply only to unknown or partial publication");
  if (value.uri !== undefined && !publicationUri) issues.push("uri must be a DID-based app.bsky.feed.post URI");
  if (value.cid !== undefined && (!text(value.cid) || !isCid(String(value.cid)))) issues.push("cid must be an alphanumeric CID");
  if (value.reasonCategory !== undefined && !["denied", "callback-mismatch", "scope-escalation", "rate-limited", "unavailable", "invalid-request"].includes(String(value.reasonCategory))) issues.push("invalid reasonCategory");
  return finish<Publication>(value, issues);
}

export function validateAccountResolution(value: unknown): Validation<AccountResolution> {
  const issues: string[] = []; if (!object(value)) return { ok: false, issues: ["account resolution must be an object"] };
  only(value, ["did", "pds", "repositoryRevision", "observedAt", "provenance"], issues);
  if (!didValue.test(String(value.did ?? "")) || !String(value.pds ?? "").startsWith("https://") || !timestamp(value.observedAt)) issues.push("invalid account resolution");
  if (value.repositoryRevision !== undefined && !text(value.repositoryRevision)) issues.push("repositoryRevision must be a non-empty string");
  const provenance = validateProvenance(value.provenance); if (!provenance.ok) issues.push(...provenance.issues);
  return finish<AccountResolution>(value, issues);
}

export function validateAdmission(value: unknown): Validation<Admission> {
  const issues: string[] = []; if (!object(value)) return { ok: false, issues: ["admission must be an object"] };
  only(value, ["admissionId", "subject", "decision", "policyVersion", "authority", "observedAt", "reasonCategory", "idempotencyKey"], issues);
  const subject = value.subject;
  if (typeof value.admissionId !== "string" || value.admissionId.length < 8 || !object(subject) || !didUri.test(String(subject.uri ?? "")) || !text(subject.cid)) issues.push("admission needs URI-plus-CID subject");
  else only(subject, ["uri", "cid"], issues);
  if (!["admitted", "pending", "rejected", "revoked"].includes(String(value.decision))) issues.push("invalid admission decision");
  if (!text(value.policyVersion) || !["system", "moderator", "member"].includes(String(value.authority)) || !timestamp(value.observedAt) || !isOpaqueKey(String(value.idempotencyKey ?? ""))) issues.push("invalid admission metadata");
  if (!["eligible", "review", "policy", "spam", "withdrawn", "unknown"].includes(String(value.reasonCategory))) issues.push("invalid admission reason");
  return finish<Admission>(value, issues);
}

export function validateLifecycleObservation(value: unknown): Validation<LifecycleObservation> {
  const issues: string[] = []; if (!object(value)) return { ok: false, issues: ["lifecycle observation must be an object"] };
  only(value, ["did", "pds", "state", "observedAt", "ordering", "uri", "currentCid", "repositoryRevision", "tombstone"], issues);
  if (!didValue.test(String(value.did ?? "")) || !String(value.pds ?? "").startsWith("https://") || !timestamp(value.observedAt)) issues.push("invalid authoritative account observation");
  if (!["current", "deleted", "inactive", "unavailable", "migrated"].includes(String(value.state))) issues.push("invalid lifecycle state");
  if (!object(value.ordering) || !Number.isInteger(value.ordering.sequence) || Number(value.ordering.sequence) < 0) issues.push("ordering.sequence is required");
  else {
    only(value.ordering, ["sequence", "commit"], issues);
    if (value.ordering.commit !== undefined && !text(value.ordering.commit)) issues.push("ordering.commit must be a non-empty string");
  }
  if (value.repositoryRevision !== undefined && !text(value.repositoryRevision)) issues.push("repositoryRevision must be a non-empty string");
  if (value.currentCid !== undefined && !text(value.currentCid)) issues.push("currentCid must be a non-empty string");
  const currentUri = parseAtPostUri(value.uri);
  if (value.uri !== undefined && !currentUri) issues.push("uri must be a DID-based app.bsky.feed.post URI");
  if (value.state === "current" && (!currentUri || !text(value.currentCid))) issues.push("current state requires URI and current CID");
  if (currentUri && currentUri.did !== value.did) issues.push("uri DID must match lifecycle DID");
  if (value.tombstone !== undefined && !object(value.tombstone)) issues.push("tombstone must be an object");
  const tombstone = object(value.tombstone) ? value.tombstone : undefined;
  if (tombstone) only(tombstone, ["uri", "lastKnownCid", "observedAt"], issues);
  if (value.state === "deleted" && (!tombstone || !didUri.test(String(tombstone.uri ?? "")) || !text(tombstone.lastKnownCid) || !timestamp(tombstone.observedAt))) issues.push("deleted state requires minimal tombstone evidence");
  const tombstoneUri = tombstone ? parseAtPostUri(tombstone.uri) : undefined;
  if (tombstone && !tombstoneUri) issues.push("tombstone URI must be a DID-based app.bsky.feed.post URI");
  if (tombstoneUri && tombstoneUri.did !== value.did) issues.push("tombstone URI DID must match lifecycle DID");
  if (tombstone && ["text", "embed", "record"].some((field) => field in tombstone)) issues.push("tombstone cannot cache post body or embeds");
  return finish<LifecycleObservation>(value, issues);
}

/**
 * Select one observation only after the caller supplies the DID-to-PDS
 * resolution that was authoritative for this read. A resolution change can
 * replace an observation from the old PDS; an observation from any other DID
 * or PDS is never allowed into the identity-scoped projection.
 */
export function selectAuthoritativeObservation(current: LifecycleObservation | undefined, candidate: LifecycleObservation, resolution: AccountResolution): LifecycleObservation | undefined {
  if (!validateAccountResolution(resolution).ok) return current;
  const resolvedCurrent = current?.did === resolution.did ? current : undefined;
  if (candidate.did !== resolution.did || candidate.pds !== resolution.pds) {
    return resolvedCurrent?.pds !== resolution.pds ? undefined : resolvedCurrent;
  }
  if (!resolvedCurrent) return candidate;
  const currentUri = resolvedCurrent.uri ?? resolvedCurrent.tombstone?.uri;
  const candidateUri = candidate.uri ?? candidate.tombstone?.uri;
  if (currentUri !== undefined && candidateUri !== undefined && currentUri !== candidateUri) return resolvedCurrent;
  if (resolvedCurrent.pds !== resolution.pds) return candidate;
  if (candidate.ordering.sequence < resolvedCurrent.ordering.sequence) return resolvedCurrent;
  if (candidate.ordering.sequence === resolvedCurrent.ordering.sequence && candidate.observedAt <= resolvedCurrent.observedAt) return resolvedCurrent;
  if (["deleted", "inactive"].includes(resolvedCurrent.state) && candidate.ordering.sequence <= resolvedCurrent.ordering.sequence) return resolvedCurrent;
  return candidate;
}

export function validateProvenance(value: unknown): Validation<Provenance> {
  const issues: string[] = []; if (!object(value)) return { ok: false, issues: ["provenance must be an object"] };
  only(value, ["source", "state", "observedAt"], issues);
  if (!["at-protocol", "swarm-admission", "pov-evaluation", "koinos", "fixture"].includes(String(value.source)) || !["live", "fixture", "simulated", "unavailable", "unknown"].includes(String(value.state)) || !timestamp(value.observedAt)) issues.push("invalid provenance");
  return finish<Provenance>(value, issues);
}
