import { type Admission, type LifecycleObservation, type Provenance } from "@pov/protocol";
export interface SwarmFeedView {
    entry: {
        uri: string;
        evaluatedCid: string;
        currentCid?: string;
        admission: Admission;
        lifecycle: LifecycleObservation;
    };
    provenance: Provenance[];
    allocation?: {
        amount: number;
        source: "simulated" | "settled";
        observedAt: string;
    };
}
export type ViewValidation = {
    ok: true;
    value: SwarmFeedView;
} | {
    ok: false;
    issues: string[];
};
/** Browser-safe read view: preserves source authority and refuses secret-shaped fields. */
export declare function validateSwarmFeedView(value: unknown): ViewValidation;
