export const helloWorld = 'hello world';
// The gist is that the way arrays are encoded does not rely on the fact that the encoding of every element of the array is the same,
// so we can encode structs in just the same way as we encode arrays.
// This means that the encoding of a struct with only fixed - size types is the concatenation of the encodings of its elements.
// If there are dynamic types, their dynamic part is added at the end and the offset to the dynamic part is calculated from the start of the struct.
// This means that the offset to the string data is computed in a different way for (uint256, string) and(uint256, (string)).

function isDynamic() {
  return true;
}

function isTuple() {
  return true;
}
// len(a) is the number of bytes in a binary string a. The type of len(a) is assumed to be uint256.
function getLen() {
  return true;
}

function isStaticArr() {
  return true;
}

function isDynamicArr() {
  return true;
}

// the actual value of X as a byte sequence, followed by the minimum number of zero-bytes such that len(enc(X)) is a multiple of 32.
function pad_left(x) {
  return true;
}

function isBytes() {
  return true;
}

function isString() {
  return true;
}

function isFixed() {
  return true;
}

function isUfixed() {
  return true;
}

function enc_utf8() {
  return true;
}

function isBytesM() {
  return true;
}

// T[] where X has k elements (k is assumed to be of type uint256):
function enc(x): any {
  if (isTuple) {
    // T[k] for any T and k
    // enc(X) = head(X[0]) ... head(X[k-1]) tail(X[0]) ... tail(X[k-1])

    const headEncodings: any[] = [];
    const tailEncodings: any[] = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < x.length; i++) {
      // where head and tail are defined for X[i] being of a static type as

      if (!isDynamic(x[i])) {
        // head(X[i]) = enc(X[i])
        headEncodings.push(enc(x[i]));
        //tail(X[i]) = "" (the empty string)
        tailEncodings.push('');
      } else {
        // head(X[i]) = enc(len(head(X[0]) ... head(X[k-1]) tail(X[0]) ... tail(X[i-1])))
        // where len is uint256
        // Note that in the dynamic case, head(X[i]) is well-defined since the lengths of the head parts
        // only depend on the types and not the values.
        // Its value is the offset of the beginning of tail(X[i]) relative to the start of enc(X).

        // since we do not know the entire head length yet
        // because we are at x[i] and we need to know up to x[k-1]
        // we push on a placeholder
        // that will later be replaced with the real offset value
        headEncodings.push('dynamic');

        // tail(X[i]) = enc(X[i])
        tailEncodings.push(enc(x[i]));
      }
    }

    // for each element in the head
    // we'll check for dynamic placeholders if any
    // and replace them with their real offset value
    // since we now know the total length of the head
    // because each static element is already encoded
    // and each dynamic placeholder is 32 bytes in length
    // since len(a) is the number of bytes in a binary string a. The type of len(a) is assumed to be uint256.
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < headEncodings.length; i++) {
      if (headEncodings[i] === 'dynamic') {
        // replace the placeholder with the offset length which is calculated as below

        //  head(X[i]) = enc(len(head(X[0]) ... head(X[k-1]) tail(X[0]) ... tail(X[i-1])))
        const headLen = len(headEncodings);
        // slice is inclusive for beginning index
        // and exclusive for ending index, hence "i" instead of "i-1"
        const tailLen = len(tailEncodings.slice(0, i));
        headEncodings[i] = enc(headLen + tailLen);
      }

      // concatenate the head and tail and return result
      return headEncodings.join('') + tailEncodings.join('');
    }

    // T[k] for any T and k:
    // enc(X) = enc((X[0], ..., X[k-1]))
    // i.e. it is encoded as if it were a tuple with k elements of the same type.
    if (isStaticArr) {
      // just encode it as above
      return enc({ x, type: 'tuple' });
    }

    // T[] where X has k elements (k is assumed to be of type uint256):
    // enc(X) = enc(k) enc([X[0], ..., X[k-1]])
    // i.e. it is encoded as if it were an array of static size k, prefixed with the number of elements.
    if (isDynamicArr) {
      const k = x.length;
      return enc(k) + enc({ x, type: 'staticArr' });
    }

    // bytes, of length k (which is assumed to be of type uint256):
    // enc(X) = enc(k) pad_right(X), i.e. the number of bytes is encoded as a
    // uint256 followed by the actual value of X as a byte sequence
    // followed by the minimum number of zero - bytes such that len(enc(X)) is a multiple of 32.
    if (isBytes) {
      const k = x.length;
      return enc(k) + pad_left(x);
    }

    // string:
    // enc(X) = enc(enc_utf8(X)), i.e. X is utf-8 encoded and this value is interpreted
    // as of bytes type and encoded further. Note that the length used in this
    // subsequent encoding is the number of bytes of the utf-8 encoded string, not its
    // number of characters.
    if (isString) {
      return enc({ x: enc_utf8(x), type: 'bytes' });
    }

    // uint<M>: enc(X) is the big-endian encoding of X,
    // padded on the higher - order(left) side with zero - bytes such that the length is 32 bytes.
    if (isUint) {
      return uint(x);
    }

    // address: as in the uint160 case
    if (isAddress) {
      return address(x);
    }

    //int<M>: enc(X) is the big-endian two’s complement encoding of X,
    // padded on the higher - order(left) side with 0xff for negative X and with zero bytes for positive X such that the length is 32 bytes.
    if (isInt) {
      return int(x);
    }

    // bool: as in the uint8 case, where 1 is used for true and 0 for false
    if (isBool) {
      return bool(x);
    }

    // fixed<M>x<N>: enc(X) is enc(X * 10**N) where X * 10**N is interpreted as a int256.
    if (isFixed) {
      return enc({ x: x * 10 ** N, type: 'int256' });
    }

    // ufixed<M>x<N>: enc(X) is enc(X * 10**N) where X * 10**N is interpreted as a uint256.
    if (isUfixed) {
      return enc({ x: x * 10 ** N, type: 'unt256' });
    }

    // bytes<M>: enc(X) is the sequence of bytes in X padded with trailing zero-bytes to a length of 32 bytes.

    if (isBytesM) {
      return pad_left(x);
    }
  }
}
