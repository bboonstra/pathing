export declare class Parameter {
    label: string;
    key: string;
    value: any;
    constructor(label: string, key: string, value: any);
    static unwrap(obj: Record<string, any>): Record<string, any>;
    static metadata(obj: Record<string, any>): Record<string, {
        label: string;
        key: string;
    }>;
}
