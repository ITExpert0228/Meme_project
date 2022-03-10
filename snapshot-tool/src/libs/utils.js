const { BigNumber } = require("bignumber.js");

const tenExponent = (digits) => {
  return new BigNumber(10).exponentiatedBy(digits);
};

const exponentTenToIncrease = (number, digits, decimals = -1) => {
  number = number || "0";
  const bn = new BigNumber(number);
  const exp = tenExponent(digits);
  const outcome = bn.multipliedBy(exp);
  if (decimals !== -1) {
    return outcome.toFixed(decimals);
  }
  return outcome.valueOf();
};

const exponentTenToDecrease = (number, digits, decimals = -1) => {
  number = number || "0";
  const bn = new BigNumber(number);
  const exp = tenExponent(digits);
  const outcome = bn.dividedBy(exp);
  if (decimals !== -1) {
    return outcome.toFixed(decimals);
  }
  return outcome.valueOf();
};

const createChunks = (data, chSize) => {
  const chunks = [];
  while (data.length) {
    chunks.push(data.splice(0, chSize));
  }

  return chunks;
};
const orderToArray = (from, to) => {
	let res = [];
  if(from <= to)
  	res = Array.from({length: to - from + 1}, (_, i) => i + parseInt(from));
  else
  	res = Array.from({length: from - to + 1}, (_, i) => parseInt(from) -i);
  return res;
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
module.exports = { 
  exponentTenToDecrease, 
  exponentTenToIncrease,
  createChunks,
  orderToArray,
  sleep,
};
