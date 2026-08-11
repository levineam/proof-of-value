/**
 * Server-side boundary for future authorized member AT actions.
 * It intentionally has no OAuth callback, transport, credential, or PDS-admin implementation.
 */

import { isCid, isOpaqueKey, parseAtPostUri, type Publication } from "@pov/protocol";

export const POST_COLLECTION = "app.bsky.feed.post" as const;
export const POST_ACTIONS = ["create"] as const;
export type SafeDiagnostic =
  | "state-invalid" | "pkce-invalid" | "par-invalid" | "dpop-nonce-invalid"
  | "issuer-mismatch" | "returned-did-mismatch" | "scope-invalid" | "session-expired"
  | "session-revoked" | "pds-unavailable" | "authorization-denied" | "response-partial"
  | "publication-unknown" | "reconciliation-pending" | "reconciliation-not-found";
type PublishFailureDiagnostic = Exclude<SafeDiagnostic, "publication-unknown">;

export interface PostAuthorizationRequest {
  readonly actorDid: string;
  readonly collection: typeof POST_COLLECTION;
  readonly actions: readonly (typeof POST_ACTIONS)[number][];
}

/** Opaque server-side reference; it is not a bearer token and is never browser state. */
export interface MemberSession {
  readonly actorDid: string;
  readonly capabilityRef: string;
  readonly expiresAt: string;
  readonly collection: typeof POST_COLLECTION;
  readonly actions: readonly (typeof POST_ACTIONS)[number][];
}

export type AuthorizationOutcome =
  | { readonly state: "authorized"; readonly session: MemberSession }
  | { readonly state: "denied" | "unavailable"; readonly diagnostic: SafeDiagnostic };

export type ProvisioningState =
  | "requested"
  | "denied"
  | "identity-created-session-unavailable"
  | "recovery-handoff-required"
  | "hosting-proof-incomplete"
  | "ready";

/** Distinct server-operator outcome; this package never holds provisioning authority. */
export interface ProvisioningOutcome {
  readonly state: ProvisioningState;
  readonly did?: string;
  readonly recoveryEstablished: boolean;
  readonly safeDiagnostic?: "authorization-denied" | "pds-unavailable";
}

/** Read-only representation of a distinct account-host authority's outcome. */
export interface ProvisioningOutcomeSource { outcome(): Promise<ProvisioningOutcome>; }

export function createFakeProvisioningOutcomeSource(outcome: ProvisioningOutcome): ProvisioningOutcomeSource {
  return { async outcome() { return outcome; } };
}

export interface PublishRequest {
  readonly session: MemberSession;
  readonly actorDid: string;
  readonly recordKey: string;
  readonly idempotencyKey: string;
  readonly text: string;
}
/** Every port outcome is a versioned publication fact; recovery policy belongs to the caller. */
export type PublicationOutcome = Publication;
export type ReconciliationOutcome =
  | { readonly state: "record-found"; readonly uri: string; readonly cid: string; readonly recordKey: string; readonly idempotencyKey: string }
  | { readonly state: "not-found"; readonly recordKey: string; readonly idempotencyKey: string; readonly retryBlocked: false; readonly diagnostic: "reconciliation-not-found" }
  | { readonly state: "pending"; readonly recordKey: string; readonly idempotencyKey: string; readonly retryBlocked: true; readonly diagnostic: "reconciliation-pending" };

export interface AuthorizedAtPort {
  authorize(request: PostAuthorizationRequest): Promise<AuthorizationOutcome>;
  publish(request: PublishRequest): Promise<PublicationOutcome>;
  reconcile(input: Pick<PublishRequest, "actorDid" | "recordKey" | "idempotencyKey">): Promise<ReconciliationOutcome>;
}

const did = (value: string): boolean => /^did:[a-z0-9]+:[A-Za-z0-9._:%-]+$/.test(value);
const nonEmpty = (value: string): boolean => value.trim().length > 0;
const sameActions = (actions: readonly string[]): boolean => actions.length === 1 && actions[0] === "create";
const observedAt = (): string => new Date().toISOString();
type PublicationReason = NonNullable<Publication["reasonCategory"]>;
const publication = (input: Pick<PublishRequest, "recordKey" | "idempotencyKey">, state: Publication["state"], reasonCategory?: PublicationReason): Publication => ({
  recordKey: input.recordKey,
  idempotencyKey: input.idempotencyKey,
  state,
  observedAt: observedAt(),
  ...(reasonCategory ? { reasonCategory } : {}),
  ...(["unknown", "partial"].includes(state) ? { recovery: "reconcile-required" as const } : {}),
});
const failedPublication = (input: Pick<PublishRequest, "recordKey" | "idempotencyKey">, reasonCategory: PublicationReason): Publication => publication(input, "failed", reasonCategory);

export function validatePostAuthorizationRequest(request: PostAuthorizationRequest): SafeDiagnostic | undefined {
  if (!did(request.actorDid)) return "returned-did-mismatch";
  if (request.collection !== POST_COLLECTION || !sameActions(request.actions)) return "scope-invalid";
  return undefined;
}

export function validatePublishRequest(request: PublishRequest): PublishFailureDiagnostic | undefined {
  if (request.session.actorDid !== request.actorDid || !did(request.actorDid)) return "returned-did-mismatch";
  if (request.session.collection !== POST_COLLECTION || !sameActions(request.session.actions)) return "scope-invalid";
  if (!isOpaqueKey(request.recordKey) || !isOpaqueKey(request.idempotencyKey) || !nonEmpty(request.text)) return "response-partial";
  const expiresAt = Date.parse(request.session.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return "session-expired";
  return undefined;
}

/** A success is valid only when AT returns both a DID-owned URI and a CID. */
export function publicationFromResponse(input: Pick<PublishRequest, "actorDid" | "recordKey" | "idempotencyKey">, response: { uri?: string; cid?: string }): PublicationOutcome {
  const { actorDid, recordKey, idempotencyKey } = input;
  const correlation = { recordKey, idempotencyKey };
  const returned = parseAtPostUri(response.uri);
  if (returned !== undefined && returned.did !== actorDid) {
    return failedPublication(correlation, "callback-mismatch");
  }
  if (returned !== undefined && returned.recordKey !== recordKey) {
    return failedPublication(correlation, "callback-mismatch");
  }
  if (returned !== undefined && response.cid === undefined) return publication(correlation, "partial", "unavailable");
  if (returned === undefined || !isCid(response.cid ?? "")) return publication(correlation, "unknown", "unavailable");
  return { ...publication(correlation, "succeeded"), uri: response.uri!, cid: response.cid };
}

/** Reject same registrable domains; real deployment must also use a Public Suffix List check. */
export function validateOriginTopology(appOrigin: string, pdsOrigin: string): SafeDiagnostic | undefined {
  const host = (origin: string): string[] | undefined => {
    const match = /^https:\/\/([a-z0-9.-]+)(?::\d+)?(?:\/|$)/i.exec(origin);
    return match?.[1]?.toLowerCase().split(".");
  };
  try {
    const appHost = host(appOrigin);
    const pdsHost = host(pdsOrigin);
    if (!appHost || !pdsHost) return "issuer-mismatch";
    const registrable = (host: string[]) => host.slice(-2).join(".");
    if (registrable(appHost) === registrable(pdsHost)) return "issuer-mismatch";
    return undefined;
  } catch { return "issuer-mismatch"; }
}

export interface FakeAtClientOptions {
  readonly authorization?: AuthorizationOutcome;
  readonly publish?: "success" | "unknown" | "partial" | "revoked" | "unavailable";
  readonly reconciliation?: "found" | "pending" | "not-found";
}

/** Deterministic fake for contracts; it never models a password, token, or operator write credential. */
export function createFakeAtClient(options: FakeAtClientOptions = {}): AuthorizedAtPort {
  const authorization = options.authorization ?? { state: "authorized", session: { actorDid: "did:plc:member", capabilityRef: "fake-capability-reference", expiresAt: "2099-01-01T00:00:00.000Z", collection: POST_COLLECTION, actions: POST_ACTIONS } };
  return {
    async authorize(request) {
      const diagnostic = validatePostAuthorizationRequest(request);
      return diagnostic ? { state: "denied", diagnostic } : authorization;
    },
    async publish(request) {
      const invalid = validatePublishRequest(request); if (invalid) return failedPublication(request, invalid === "scope-invalid" ? "scope-escalation" : "invalid-request");
      if (options.publish === "unknown") return publication(request, "unknown", "unavailable");
      if (options.publish === "partial") return publicationFromResponse(request, { uri: `at://${request.actorDid}/${POST_COLLECTION}/${request.recordKey}` });
      if (options.publish === "revoked") return failedPublication(request, "denied");
      if (options.publish === "unavailable") return failedPublication(request, "unavailable");
      return publicationFromResponse(request, { uri: `at://${request.actorDid}/${POST_COLLECTION}/${request.recordKey}`, cid: "bafyfakecid" });
    },
    async reconcile(input) {
      const { actorDid, recordKey, idempotencyKey } = input;
      const correlation = { recordKey, idempotencyKey };
      if (options.reconciliation === "pending") return { state: "pending", ...correlation, retryBlocked: true, diagnostic: "reconciliation-pending" };
      if (options.reconciliation === "not-found") return { state: "not-found", ...correlation, retryBlocked: false, diagnostic: "reconciliation-not-found" };
      return { state: "record-found", ...correlation, uri: `at://${actorDid}/${POST_COLLECTION}/${recordKey}`, cid: "bafyfakecid" };
    }
  };
}
