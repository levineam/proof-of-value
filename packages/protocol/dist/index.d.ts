/** Dependency-free contracts for AT facts and Swarm-derived facts. */
export type ProvenanceSource = "at-protocol" | "swarm-admission" | "pov-evaluation" | "koinos" | "fixture";
export type SourceState = "live" | "fixture" | "simulated" | "unavailable" | "unknown";
export interface Provenance {
    source: ProvenanceSource;
    state: SourceState;
    observedAt: string;
}
export interface ContentReference {
    uri: string;
    cid: string;
}
export interface Publication {
    recordKey: string;
    idempotencyKey: string;
    state: "succeeded" | "unknown" | "partial" | "failed";
    observedAt: string;
    uri?: string;
    cid?: string;
    reasonCategory?: "denied" | "callback-mismatch" | "scope-escalation" | "rate-limited" | "unavailable" | "invalid-request";
}
export interface Admission {
    admissionId: string;
    subject: ContentReference;
    decision: "admitted" | "pending" | "rejected" | "revoked";
    policyVersion: string;
    authority: "system" | "moderator" | "member";
    observedAt: string;
    reasonCategory: "eligible" | "review" | "policy" | "spam" | "withdrawn" | "unknown";
    idempotencyKey: string;
}
export interface LifecycleObservation {
    did: string;
    pds: string;
    state: "current" | "deleted" | "inactive" | "unavailable" | "migrated";
    observedAt: string;
    ordering: {
        sequence: number;
        commit?: string;
    };
    uri?: string;
    currentCid?: string;
    repositoryRevision?: string;
    tombstone?: {
        uri: string;
        lastKnownCid: string;
        observedAt: string;
    };
}
export interface AccountResolution {
    did: string;
    pds: string;
    repositoryRevision?: string;
    observedAt: string;
    provenance: Provenance;
}
export type Validation<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    issues: string[];
};
export declare function validatePublication(value: unknown): Validation<Publication>;
export declare function validateAccountResolution(value: unknown): Validation<AccountResolution>;
export declare function validateAdmission(value: unknown): Validation<Admission>;
export declare function validateLifecycleObservation(value: unknown): Validation<LifecycleObservation>;
/** Higher sequence wins; terminal delete/inactive observations cannot be resurrected by stale reads. */
export declare function selectAuthoritativeObservation(current: LifecycleObservation | undefined, candidate: LifecycleObservation): LifecycleObservation;
export declare function validateProvenance(value: unknown): Validation<Provenance>;
