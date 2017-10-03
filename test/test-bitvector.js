"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var expect = chai.expect;
var index_1 = require("../index");
describe('integration tests', function () {
    it('should store bits accurately', function () {
        var size = 20856;
        var vector = new index_1.default(size);
        var set = [];
        for (var i = 0; i < size; i++) {
            var bit = Math.random() < 0.5;
            if (bit) {
                vector.set(i);
                set.push(true);
            }
            else {
                set.push(false);
            }
        }
        for (var i = 0; i < size; i++) {
            if (set[i])
                expect(vector.get(i) == true);
            else
                expect(vector.get(i) == false);
        }
    });
    it('should clear bits correctly', function () {
        var size = 43;
        var vector = new index_1.default(size);
        for (var i = 0; i < size; i++) {
            vector.set(i);
        }
        var indices = [4, 8, 15, 16, 23, 42];
        indices.forEach(function (x) { return vector.clear(x); });
        indices.forEach(function (x) { return expect(vector.get(x) == false); });
    });
    it('should round-trip serialize-deserialize', function () {
        var size = 43;
        var indices = [4, 8, 15, 16, 23, 42];
        var vector = new index_1.default(size);
        indices.forEach(function (x) { return vector.set(x); });
        var str = vector.serialize();
        var newVector = new index_1.default(str);
        expect(vector.length == newVector.length);
        for (var x = 0; x < size; x++) {
            expect(vector.get(x) == newVector.get(x));
        }
    });
    it('should serialize-deserialize, set/clear bits, then serialize-deserialize again', function () {
        var size = 43;
        var initialIndices = [4, 8, 15, 16, 23, 42];
        var additionalSetIndices = [2, 7, 17, 22, 32, 33, 34, 38];
        var additionalClearIndices = [8, 15, 23];
        var vector = new index_1.default(size);
        initialIndices.forEach(function (x) { return vector.set(x); });
        var str = vector.serialize();
        var newVector = new index_1.default(str);
        expect(vector.length == newVector.length);
        for (var x = 0; x < size; x++) {
            expect(vector.get(x) == newVector.get(x));
        }
        additionalSetIndices.forEach(function (x) { return newVector.set(x); });
        additionalClearIndices.forEach(function (x) { return newVector.clear(x); });
        var newStr = newVector.serialize();
        var newestVector = new index_1.default(newStr);
        additionalSetIndices.forEach(function (x) { return expect(newestVector.get(x) == true); });
        additionalClearIndices.forEach(function (x) { return expect(newestVector.get(x) == false); });
    });
    it('should expand properly', function () {
        var size = 43;
        var initialIndices = [4, 8, 15, 16, 23, 42];
        var vector = new index_1.default(size);
        initialIndices.forEach(function (x) { return vector.set(x); });
        var newIndices = [48, 56, 67, 68, 72, 82, 83, 84, 85, 91, 103, 456, 1024, 1025, 90825, 300123];
        newIndices.forEach(function (x) { return vector.set(x); });
        initialIndices.forEach(function (x) { return expect(vector.get(x) == true); });
        newIndices.forEach(function (x) { return expect(vector.get(x) == true); });
    });
});
