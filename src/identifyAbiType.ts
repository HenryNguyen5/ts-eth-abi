// uint<M>: unsigned integer type of M bits
// 0 < M <= 256, M % 8 == 0. e.g.uint32, uint8, uint256.
interface IUint {
  type: 'uint';
  bits: number;
}

// int<M>: two's complement signed integer type of M bits, 0 < M <= 256, M % 8 == 0.
interface IInt {
  type: 'int';
  bits: number;
}

// address: equivalent to uint160, except for the assumed interpretation and language typing.
interface IAddress {
  type: 'address';
}

// bool: equivalent to uint8 restricted to the values 0 and 1
interface IBool {
  type: 'bool';
}

// fixed<M>x<N>: signed fixed-point decimal number of M bits
// 0 < M <= 256, M % 8 == 0, and 0 < N <= 80, which denotes the value v as v / (10 ** N).
interface IFixed {
  type: 'fixed';
  m: number;
  n: number;
}

// ufixed<M>x<N>: unsigned variant of fixed<M>x<N>.
interface IUFixed {
  type: 'ufixed';
  m: number;
  n: number;
}

// bytes<M>: binary type of M bytes, 0 < M <= 32.
interface IBytesM {
  type: 'bytesM';
}

// function: an address (20 bytes) followed by a function selector (4 bytes). Encoded identical to bytes24.
interface IFunc {
  type: 'function';
}

type ElementaryTypes =
  | IUint
  | IInt
  | IAddress
  | IBool
  | IFixed
  | IUFixed
  | IBytesM
  | IFunc;

// <type>[M]: a fixed-length array of M elements, M >= 0, of the given type.
interface IFixedSizeArr {
  type: 'fixedSizeArray';
  itemType: ElementaryTypes['type'];
  length: number;
}

// bytes: dynamic sized byte sequence.
interface IBytes {
  type: 'bytes';
  m: number;
}

// string: dynamic sized unicode string assumed to be UTF-8 encoded.
interface IString {
  type: 'string';
}

// <type>[]: a variable-length array of the given fixed-length type.
interface IDynamicArr {
  type: 'dynamicArray';
  itemType: string;
}

// (T1,T2,...,Tn): tuple consisting of the types T1, …, Tn, n >= 0
interface ITuple {
  type: 'tuple';
  length: number;
}

function isUint(str: string): IUint | false {
  // check for alias
  if (str === 'uint') {
    str = 'uint256';
  }

  const match = str.match(/^uint/);
  if (!match || match.length < 3) {
    return false;
  }

  const [_, type, strBits] = match;
  const numBits = +strBits;

  if (!numBits || isNaN(numBits) || numBits % 8 !== 0) {
    return false;
  }

  if (type !== 'uint') {
    return false;
  }

  return {
    type: 'uint',
    bits: numBits,
  };
}

function isInt(str: string): IInt | false {
  // check for alias
  if (str === 'int') {
    str = 'int256';
  }

  const match = str.match(/^int/);
  if (!match || match.length < 3) {
    return false;
  }

  const [_, type, strBits] = match;
  const numBits = +strBits;

  if (!numBits || isNaN(numBits) || numBits % 8 !== 0) {
    return false;
  }

  if (type !== 'int') {
    return false;
  }

  return {
    type: 'int',
    bits: numBits,
  };
}

function isAddress(str: string): IAddress | false {
  if (str !== 'address') {
    return false;
  }
  return { type: 'address' };
}

function isBool(str: string): IBool | false {
  if (str !== 'bool') {
    return false;
  }
  return { type: 'bool' };
}
