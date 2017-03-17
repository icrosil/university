const _ = require('lodash');

const m = 7;

const arr = [
  7.1,
  6.7,
  7.3,
  7.1,
  6.9,
  6.2,
  6.8,
];

const tc = _.sum(arr) / m;
console.log(tc, 'tc');

const sigma = Math.sqrt(_.sum(_.map(arr, tk => (tk - tc) * (tk - tc))) / m);
console.log(sigma, 'sigma');

const ty = 2.45;

const s = Math.sqrt(m / (m - 1)) * sigma;

const delta = (ty * s) / Math.sqrt(m);
console.log(delta, 'delta');

const delta1 = 0.1;

const m1 = (ty * ty * s * s) / delta1 / delta1;
console.log(m1, 'm1');
