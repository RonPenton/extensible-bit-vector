export declare class BitVector {
    private bits;
    constructor(base64String: string);
    constructor(initialSize?: number);
    private ensureSize(newChunkSize);
    set(bit: number): void;
    clear(bit: number): void;
    get(bit: number): boolean | 0;
    serialize(): string;
    readonly chunkLength: number;
    readonly length: number;
}
