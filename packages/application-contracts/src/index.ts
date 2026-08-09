import { type Admission, type LifecycleObservation, type Provenance, validateAdmission, validateLifecycleObservation, validateProvenance } from "@pov/protocol";

export interface SwarmFeedView {
  entry: { uri: string; evaluatedCid: string; currentCid?: string; admission: Admission; lifecycle: LifecycleObservation };
  provenance: Provenance[];
  allocation?: { amount: number; source: "simulated" | "settled"; observedAt: string };
}
export type ViewValidation = { ok: true; value: SwarmFeedView } | { ok: false; issues: string[] };
const object = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const forbidden = /(?:authorizationCode|accessToken|refreshToken|dpopPrivateKey|pdsAdmin|wallet(?:Key|PrivateKey)|raw(?:Provider|Upstream)Error)/i;
const MAX_INSPECTION_DEPTH = 100;
const MAX_INSPECTION_NODES = 10_000;
const only = (candidate: Record<string, unknown>, allowed: readonly string[], label: string, issues: string[]) => {
  Object.keys(candidate).filter((key) => !allowed.includes(key)).forEach((key) => issues.push(`unexpected ${label} field: ${key}`));
};

/** Browser-safe read view: preserves source authority and refuses secret-shaped fields. */
export function validateSwarmFeedView(value: unknown): ViewValidation {
  const issues: string[] = [];
  if (!object(value)) return { ok: false, issues: ["view must be an object"] };
  const seen = new WeakSet<object>();
  const stack: Array<{ candidate: unknown; depth: number }> = [{ candidate: value, depth: 0 }];
  let inspectedNodes = 0;
  while (stack.length) {
    const { candidate, depth } = stack.pop()!;
    if ((typeof candidate !== "object" || candidate === null) || seen.has(candidate)) continue;
    seen.add(candidate);
    inspectedNodes += 1;
    if (inspectedNodes > MAX_INSPECTION_NODES) {
      issues.push("view exceeds inspection node limit");
      break;
    }
    if (depth > MAX_INSPECTION_DEPTH) {
      issues.push("view exceeds inspection depth limit");
      continue;
    }
    Object.entries(candidate).forEach(([key, nested]) => {
      if (forbidden.test(key)) issues.push(`unsafe serialized field: ${key}`);
      stack.push({ candidate: nested, depth: depth + 1 });
    });
  }
  if (Object.keys(value).some((key) => !["entry", "provenance", "allocation"].includes(key))) issues.push("unexpected view field");
  if (!object(value.entry) || typeof value.entry.uri !== "string" || typeof value.entry.evaluatedCid !== "string") issues.push("entry requires URI and evaluated CID");
  else {
    only(value.entry, ["uri", "evaluatedCid", "currentCid", "admission", "lifecycle"], "entry", issues);
    if (value.entry.currentCid !== undefined && typeof value.entry.currentCid !== "string") issues.push("entry current CID must be a string");
    const admission = validateAdmission(value.entry.admission); if (!admission.ok) issues.push(...admission.issues);
    const lifecycle = validateLifecycleObservation(value.entry.lifecycle); if (!lifecycle.ok) issues.push(...lifecycle.issues);
    if (admission.ok && admission.value.subject.cid !== value.entry.evaluatedCid) issues.push("admission must bind the evaluated CID");
  }
  if (!Array.isArray(value.provenance) || value.provenance.length === 0) issues.push("provenance labels are required");
  else value.provenance.forEach((item) => { const result = validateProvenance(item); if (!result.ok) issues.push(...result.issues); });
  if (value.allocation !== undefined) {
    if (!object(value.allocation) || typeof value.allocation.amount !== "number" || !["simulated", "settled"].includes(String(value.allocation.source)) || typeof value.allocation.observedAt !== "string") issues.push("allocation needs amount, labeled source, and observation time");
    else only(value.allocation, ["amount", "source", "observedAt"], "allocation", issues);
  }
  return issues.length ? { ok: false, issues } : { ok: true, value: value as unknown as SwarmFeedView };
}
