interface IUint {
  type: 'uint';
  bits: number;
}

interface IInt {
  type: 'int';
  bits: number;
}

interface IAddress {
  type: 'uint';
  bits: 160;
}

interface IBool {
  isBool: true;
  type: 'uint';
  bits: 8;
}

function isUint(str: string): IUint {
  // check for alias
  if (str === 'uint') {
    str = 'uint256';
  }

  const match = str.match(/^uint/);
  if (!match || match.length < 3) {
    throw Error('not uint');
  }

  const [_, type, strBits] = match;
  const numBits = +strBits;

  if (!numBits || isNaN(numBits) || numBits % 8 !== 0) {
    throw Error('Not valid bits');
  }

  if (type !== 'uint') {
    throw Error('not uint');
  }

  return {
    type: 'uint',
    bits: numBits,
  };
}

function isInt(str: string): IInt {
  // check for alias
  if (str === 'int') {
    str = 'int256';
  }

  const match = str.match(/^int/);
  if (!match || match.length < 3) {
    throw Error('not int');
  }

  const [_, type, strBits] = match;
  const numBits = +strBits;

  if (!numBits || isNaN(numBits) || numBits % 8 !== 0) {
    throw Error('Not valid bits');
  }

  if (type !== 'int') {
    throw Error('not int');
  }

  return {
    type: 'int',
    bits: numBits,
  };
}

function isAddress(str: string): IAddress {
  const { bits, type } = isUint(str);
  if (bits !== 160) {
    throw Error('not address');
  }

  return { bits, type };
}

function isBool(str: string): IBool {
  const { bits, type } = isUint(str);
  if (bits !== 8) {
    throw Error('not bool');
  }
  return { bits, isBool: true, type };
}
