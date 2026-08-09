/**
 * Server-side boundary for future authorized member AT actions.
 * It intentionally has no OAuth callback, transport, credential, or PDS-admin implementation.
 */

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
export type PublicationOutcome =
  | { readonly state: "succeeded"; readonly uri: string; readonly cid: string; readonly recordKey: string; readonly idempotencyKey: string }
  | { readonly state: "unknown"; readonly recordKey: string; readonly idempotencyKey: string; readonly diagnostic: "publication-unknown"; readonly retryBlocked: true }
  | { readonly state: "failed"; readonly recordKey: string; readonly idempotencyKey: string; readonly diagnostic: PublishFailureDiagnostic };
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
const atUriParts = (value: string): { did: string; recordKey: string } | undefined => {
  const match = /^at:\/\/(did:[a-z0-9]+:[A-Za-z0-9._:%-]+)\/app\.bsky\.feed\.post\/([A-Za-z0-9._-]+)$/.exec(value);
  return match ? { did: match[1], recordKey: match[2] } : undefined;
};
const nonEmpty = (value: string): boolean => value.trim().length > 0;
const sameActions = (actions: readonly string[]): boolean => actions.length === 1 && actions[0] === "create";

export function validatePostAuthorizationRequest(request: PostAuthorizationRequest): SafeDiagnostic | undefined {
  if (!did(request.actorDid)) return "returned-did-mismatch";
  if (request.collection !== POST_COLLECTION || !sameActions(request.actions)) return "scope-invalid";
  return undefined;
}

export function validatePublishRequest(request: PublishRequest): PublishFailureDiagnostic | undefined {
  if (request.session.actorDid !== request.actorDid || !did(request.actorDid)) return "returned-did-mismatch";
  if (request.session.collection !== POST_COLLECTION || !sameActions(request.session.actions)) return "scope-invalid";
  if (!nonEmpty(request.recordKey) || !nonEmpty(request.idempotencyKey) || !nonEmpty(request.text)) return "response-partial";
  if (Date.parse(request.session.expiresAt) <= Date.now()) return "session-expired";
  return undefined;
}

/** A success is valid only when AT returns both a DID-owned URI and a CID. */
export function publicationFromResponse(input: Pick<PublishRequest, "actorDid" | "recordKey" | "idempotencyKey">, response: { uri?: string; cid?: string }): PublicationOutcome {
  const { actorDid, recordKey, idempotencyKey } = input;
  const correlation = { recordKey, idempotencyKey };
  const returned = atUriParts(response.uri ?? "");
  if (returned !== undefined && returned.did !== actorDid) {
    return { state: "failed", ...correlation, diagnostic: "returned-did-mismatch" };
  }
  if (returned === undefined || !nonEmpty(response.cid ?? "") || returned.recordKey !== recordKey) {
    return { state: "unknown", ...correlation, diagnostic: "publication-unknown", retryBlocked: true };
  }
  return { state: "succeeded", ...correlation, uri: response.uri!, cid: response.cid! };
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
      const invalid = validatePublishRequest(request); if (invalid) return { state: "failed", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: invalid };
      if (options.publish === "unknown") return { state: "unknown", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "publication-unknown", retryBlocked: true };
      if (options.publish === "partial") return publicationFromResponse(request, { uri: `at://${request.actorDid}/${POST_COLLECTION}/${request.recordKey}` });
      if (options.publish === "revoked") return { state: "failed", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "session-revoked" };
      if (options.publish === "unavailable") return { state: "failed", recordKey: request.recordKey, idempotencyKey: request.idempotencyKey, diagnostic: "pds-unavailable" };
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
