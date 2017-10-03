# extensible-bit-vector
An extensible bit-vector implementation for Javascript.

# Usage

```ts
import BitVector from 'extensible-bit-vector';

const vector = new BitVector(32);
vector.set(2);
vector.set(7);
vector.set(31);

const b1 = vector.get(2);   // true
const b2 = vector.get(3);   // false
const b3 = vector.get(7);   // true

vector.set(42);             // automatically grows bitvector to fit.
vector.clear(2);
vector.clear(3);

const b4 = vector.get(2);   // false
const b5 = vector.get(3);   // false

const str = vector.serialize(); // compressed bitvector in Base64 format
// Store str in db here
const newVector = new BitVector(str);   // re-hydrate bitvector from database.

const b6 = newVector.get(2);    // false
const b7 = newVector.get(31);   // true
```

You get the idea. 

This is a bitvector that only works on Node, not the browser. The reason is that it relies on the Node Buffer class for serialization to and from strings. If you never do any serialization then it will work in the browser, but I don't recommend it. 

In memory, the data is stored as a Uint8Array vector, and every 8 bits are stored as each byte. I would have used Uint32Array but it's much easier to convert to and from Base64 using Uint8Array. 

The serialization method is designed to produce an optimized storage implementation of the bitvector, using as little memory as possible while still being storable in your average document database. I'm sure there are better ways to optimize the storage, but none are going to be as compatible as this. 