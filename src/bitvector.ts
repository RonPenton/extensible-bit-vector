import { Buffer } from 'buffer';

const growthFactor = 2;
type VectorType = Uint8Array;
const vectorType = Uint8Array;
const vectorSize = 8;

function grow(vector: VectorType, newChunkSize: number): VectorType {
    let size = vector.length;
    while(size < newChunkSize) {
        size *= growthFactor;
    }

    var n = new vectorType(size);
    for (let i = 0; i < vector.length; i++) {
        n[i] = vector[i];
    }
    return n;
}

function deserialize(base64String: string): VectorType {
    return Buffer.from(base64String, 'base64');
}

function calculate(bit: number) {
    const r = bit % vectorSize;
    const pos = (bit - r) / vectorSize;
    return { r, pos };
}

export class BitVector {
    private bits: VectorType;

    constructor(base64String: string);
    constructor(initialSize?: number);
    constructor(sizeOrString: number | string | undefined) {
        if (typeof sizeOrString === 'string') {
            this.bits = deserialize(sizeOrString);
        }
        else {
            sizeOrString = sizeOrString || vectorSize;
            this.bits = new vectorType(Math.ceil(sizeOrString / vectorSize));
        }
    }

    private ensureSize(newChunkSize: number) {
        let vector = this.bits;
        vector = grow(vector, newChunkSize);
        this.bits = vector;
    }

    public set(bit: number) {
        const { r, pos } = calculate(bit);
        this.ensureSize(pos);
        this.bits[pos] |= (1 << r)
    }

    public clear(bit: number) {
        const { r, pos } = calculate(bit);
        this.ensureSize(pos);
        this.bits[pos] &= ~(1 << r)
    }

    public get(bit: number) {
        const { r, pos } = calculate(bit);
        if (this.bits.length >= pos)
            return 0;
        return !!(this.bits[pos] & (1 << r))
    }

    public serialize(): string {
        let index = 0;
        let result = '';
        while (index < this.bits.length) {
            const s = this.bits[index];
            result += String.fromCharCode(s);
            index++;
        }
        return Buffer.from(result).toString('base64');
    }

    public get chunkLength() { return this.bits.length; }
    public get length() { return this.bits.length * vectorSize; }
}