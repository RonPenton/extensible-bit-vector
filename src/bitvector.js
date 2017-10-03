"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var growthFactor = 2;
var vectorType = Uint8Array;
var vectorSize = 8;
function grow(vector) {
    var n = new vectorType(Math.ceil(vector.length * growthFactor));
    for (var i = 0; i < vector.length; i++) {
        n[i] = vector[i];
    }
    return n;
}
function deserialize(base64String) {
    return buffer_1.Buffer.from(base64String, 'base64');
}
var BitVector = /** @class */ (function () {
    function BitVector(sizeOrString) {
        if (typeof sizeOrString === 'string') {
            this.bits = deserialize(sizeOrString);
        }
        else {
            sizeOrString = sizeOrString || vectorSize;
            this.bits = new vectorType(Math.ceil(sizeOrString / vectorSize));
        }
    }
    BitVector.prototype.ensureSize = function (newChunkSize) {
        var vector = this.bits;
        while (vector.length < newChunkSize) {
            vector = grow(vector);
        }
        this.bits = vector;
    };
    BitVector.prototype.set = function (bit) {
        var r = bit % vectorSize;
        var pos = (bit - r) / vectorSize;
        this.ensureSize(pos);
        this.bits[pos] |= (1 << r);
    };
    BitVector.prototype.clear = function (bit) {
        var r = bit % vectorSize;
        var pos = (bit - r) / vectorSize;
        this.ensureSize(pos);
        this.bits[pos] &= ~(1 << r);
    };
    BitVector.prototype.get = function (bit) {
        var r = bit % vectorSize;
        var pos = (bit - r) / vectorSize;
        if (this.bits.length >= pos)
            return 0;
        return !!(this.bits[pos] & (1 << r));
    };
    BitVector.prototype.serialize = function () {
        var index = 0;
        var result = '';
        while (index < this.bits.length) {
            var s = this.bits[index];
            result += String.fromCharCode(s);
            index++;
        }
        return buffer_1.Buffer.from(result).toString('base64');
    };
    Object.defineProperty(BitVector.prototype, "length", {
        get: function () { return this.bits.length; },
        enumerable: true,
        configurable: true
    });
    return BitVector;
}());
exports.BitVector = BitVector;
