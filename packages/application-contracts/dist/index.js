import { validateAdmission, validateLifecycleObservation, validateProvenance } from "@pov/protocol";
const object = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const forbidden = /(?:authorizationCode|accessToken|refreshToken|dpopPrivateKey|pdsAdmin|wallet(?:Key|PrivateKey)|raw(?:Provider|Upstream)Error)/i;
/** Browser-safe read view: preserves source authority and refuses secret-shaped fields. */
export function validateSwarmFeedView(value) {
    const issues = [];
    if (!object(value))
        return { ok: false, issues: ["view must be an object"] };
    const inspect = (candidate) => {
        if (!object(candidate))
            return;
        Object.entries(candidate).forEach(([key, nested]) => { if (forbidden.test(key))
            issues.push(`unsafe serialized field: ${key}`); inspect(nested); });
    };
    inspect(value);
    if (Object.keys(value).some((key) => !["entry", "provenance", "allocation"].includes(key)))
        issues.push("unexpected view field");
    if (!object(value.entry) || typeof value.entry.uri !== "string" || typeof value.entry.evaluatedCid !== "string")
        issues.push("entry requires URI and evaluated CID");
    else {
        const admission = validateAdmission(value.entry.admission);
        if (!admission.ok)
            issues.push(...admission.issues);
        const lifecycle = validateLifecycleObservation(value.entry.lifecycle);
        if (!lifecycle.ok)
            issues.push(...lifecycle.issues);
        if (admission.ok && admission.value.subject.cid !== value.entry.evaluatedCid)
            issues.push("admission must bind the evaluated CID");
    }
    if (!Array.isArray(value.provenance) || value.provenance.length === 0)
        issues.push("provenance labels are required");
    else
        value.provenance.forEach((item) => { const result = validateProvenance(item); if (!result.ok)
            issues.push(...result.issues); });
    if (value.allocation !== undefined && (!object(value.allocation) || typeof value.allocation.amount !== "number" || !["simulated", "settled"].includes(String(value.allocation.source)) || typeof value.allocation.observedAt !== "string"))
        issues.push("allocation needs amount, labeled source, and observation time");
    return issues.length ? { ok: false, issues } : { ok: true, value: value };
}
