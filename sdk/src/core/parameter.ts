/* eslint-disable @typescript-eslint/no-explicit-any */
export class Parameter {
    constructor(public label: string, public key: string, public value: any) {}

    static unwrap(obj: Record<string, any>) {
        const flat: Record<string, any> = {};
        for (const [k, v] of Object.entries(obj)) {
            flat[k] = v instanceof Parameter ? v.value : v;
        }
        return flat;
    }

    static metadata(obj: Record<string, any>) {
        const meta: Record<string, { label: string; key: string }> = {};
        for (const [k, v] of Object.entries(obj)) {
            if (v instanceof Parameter) {
                meta[k] = { label: v.label, key: v.key };
            }
        }
        return meta;
    }
}
