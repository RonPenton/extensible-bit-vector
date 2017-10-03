import * as chai from 'chai';
var expect = chai.expect;

import BitVector from '../index';

describe('integration tests', () => {
    it('should store bits accurately', () => {
        const size = 20856;
        const vector = new BitVector(size);
        const set = [];
        for (let i = 0; i < size; i++) {
            const bit = Math.random() < 0.5;
            if (bit) {
                vector.set(i);
                set.push(true);
            }
            else {
                set.push(false);
            }
        }

        for (let i = 0; i < size; i++) {
            if (set[i])
                expect(vector.get(i) == true);
            else
                expect(vector.get(i) == false);

        }
    });

    it('should clear bits correctly', () => {
        const size = 43;
        const vector = new BitVector(size);
        for (let i = 0; i < size; i++) {
            vector.set(i);
        }

        const indices = [4, 8, 15, 16, 23, 42];
        indices.forEach(x => vector.clear(x));
        indices.forEach(x => expect(vector.get(x) == false));
    });

    it('should round-trip serialize-deserialize', () => {
        const size = 43;
        const indices = [4, 8, 15, 16, 23, 42];
        const vector = new BitVector(size);
        indices.forEach(x => vector.set(x));

        const str = vector.serialize();
        const newVector = new BitVector(str);

        expect(vector.chunkLength == newVector.chunkLength);

        for(let x = 0; x < size; x++) {
            expect(vector.get(x) == newVector.get(x));
        }
    });

    it('should serialize-deserialize, set/clear bits, then serialize-deserialize again', () => {
        const size = 43;
        const initialIndices = [4, 8, 15, 16, 23, 42];
        const additionalSetIndices = [2, 7, 17, 22, 32, 33, 34, 38];
        const additionalClearIndices = [8, 15, 23];
        const vector = new BitVector(size);
        initialIndices.forEach(x => vector.set(x));

        const str = vector.serialize();
        const newVector = new BitVector(str);

        expect(vector.chunkLength == newVector.chunkLength);

        for(let x = 0; x < size; x++) {
            expect(vector.get(x) == newVector.get(x));
        }

        additionalSetIndices.forEach(x => newVector.set(x));
        additionalClearIndices.forEach(x => newVector.clear(x));
        
        const newStr = newVector.serialize();
        const newestVector = new BitVector(newStr);

        additionalSetIndices.forEach(x => expect(newestVector.get(x) == true));
        additionalClearIndices.forEach(x => expect(newestVector.get(x) == false));
    });

    it('should expand properly', () => {
        const size = 43;
        const initialIndices = [4, 8, 15, 16, 23, 42];
        const vector = new BitVector(size);
        initialIndices.forEach(x => vector.set(x));


        const newIndices = [48, 56, 67, 68, 72, 82, 83, 84, 85, 91, 103, 456, 1024, 1025, 90825, 300123];
        newIndices.forEach(x => vector.set(x));

        initialIndices.forEach(x => expect(vector.get(x) == true));
        newIndices.forEach(x => expect(vector.get(x) == true));
    });
});
