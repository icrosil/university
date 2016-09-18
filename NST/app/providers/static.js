/* eslint new-cap: 0 */
/* eslint no-undef: 0 */

import _ from 'lodash';
import Victor from 'victor';

import linear from '../libs/numeric.min.js';

// figure comes in first 1-1 square
export const transformNumberToPoint = (lined, maxLength, smalls) => (
  _.map(lined, (value) => {
    let result;
    if (value <= 1) {
      result = [0, 1 - value];
    } else if (value <= maxLength - 1) {
      result = [(value - 1) / Math.sqrt(2), (value - 1) / Math.sqrt(2)];
    } else {
      result = [1, maxLength - value];
    }

    result = _.map(result, (v, i) => v + smalls[i]);
    return result;
  })
);

export const dataCritical = (M, defaultPoints, maxLength, smalls) => {
  let result = [];
  if (M < 4) {
    console.error('M should not be less than 4!');
    return result;
  }
  // Make them on line
  result = _.sortBy([...defaultPoints, ...(
    _.times(M - 4, (index) => ((index + 1) / (M - 3)) * maxLength))]
  );
  // Transform into points
  result = transformNumberToPoint(result, maxLength, smalls);
  return result;
};

export const dataCenters = (M, dC) => {
  let result = [];
  if (M < 4) {
    console.error('M should not be less than 4!');
    return result;
  }
  // Make them on line
  result = _.times(dC.length - 1, (index) => [
    (dC[index][0] + dC[index + 1][0]) / 2,
    (dC[index][1] + dC[index + 1][1]) / 2,
  ]);
  return result;
};

export function getSqrt(index, dC) {
  return Math.sqrt(
    Math.pow((dC[index + 1][0] - dC[index][0]), 2) +
    Math.pow((dC[index + 1][1] - dC[index][1]), 2)
  );
}
export function RJ(point, j, delta, dC) {
  return Math.max(
    delta,
    Math.sqrt(
      Math.pow((point[0] - dC[j][0]), 2) +
      Math.pow((point[1] - dC[j][1]), 2)
    )
  );
}
export function VJ(point, critical) {
  return [
    (critical[1] - point[1]) / ((2 * Math.PI) *
      (Math.pow(point[0] - critical[0], 2) + Math.pow(point[1] - critical[1], 2))),
    (point[0] - critical[0]) / ((2 * Math.PI) *
      (Math.pow(point[0] - critical[0], 2) + Math.pow(point[1] - critical[1], 2))),
  ];
}
const f = (point, critical) => (
  Math.atan((point[1] - critical[1]) / (point[0] - critical[0])) / (2 * Math.PI)
);

// Looks correct
export function calculateAll(props) {
  const n = _.map(props.dataCenters, (value, index) => [
    -(props.dataCritical[index + 1][1] - props.dataCritical[index][1]) /
      getSqrt(index, props.dataCritical),
    (props.dataCritical[index + 1][0] - props.dataCritical[index][0]) /
      getSqrt(index, props.dataCritical),
  ]);
  const systemA = _.times(props.M - 1, (k) => _.times(props.M, (j) => (
    Victor.fromArray(VJ(props.dataCenters[k], props.dataCritical[j])).dot(Victor.fromArray(n[k]))
  )));
  systemA.push(_.times(props.M, _.constant(1)));
  const systemB = _.times(props.M - 1, (k) => (
    -Victor.fromArray(props.VINF).dot(Victor.fromArray(n[k]))
  ));
  systemB.push(props.G0);
  const G = linear.solve(systemA, systemB);
  const V = _.map(props.net, (val, i) => _.map(val, (point, j) => [
    props.VINF[0] + (_.sum(_.times(props.M, (k) => G[k] *
      VJ(point, props.dataCritical[k], i, j)[0])) || 0),
    props.VINF[1] + (_.sum(_.times(props.M, (k) => G[k] *
      VJ(point, props.dataCritical[k], i, j)[1])) || 0),
  ]));
  const CP = _.map(props.net, (val, i) => _.map(val, (point, j) => (
    1 - (Victor.fromArray(V[i][j]).length() / Victor.fromArray(props.VINF).length()))
  ));
  const F1 = _.map(props.net, (val) => _.map(val, (point) => (
    Victor.fromArray(props.VINF).dot(Victor.fromArray(point)) + (_.sum(
      _.times(props.M, (k) => G[k] * f(point, props.dataCritical[k]))
    ) || 0)
  )));
  const F2 = _.map(props.net, (val) => _.map(val, (point) => (
    Victor.fromArray(props.VINF).dot(Victor.fromArray(point)) + (_.sum(_.times(props.M - 1, (j) => (
      (
        (_.sum(_.times(j + 1, (k) => G[k])) *
        ((
          ((props.dataCritical[j + 1][1] - props.dataCritical[j][1]) *
            (point[0] - props.dataCritical[j][0])) -
          ((props.dataCritical[j + 1][0] - props.dataCritical[j][0]) *
            (point[1] - props.dataCritical[j][1]))
        ) / (Math.pow(RJ(point, j, props.delta, props.dataCenters), 2)))) /
        (2 * Math.PI)
      )
    )))) + (props.G0 * f(point, props.dataCritical[props.M - 1]))
  )));
  const PSI = _.map(props.net, (val) => _.map(val, (point) => (
    (props.VINF[0] * point[1]) - (props.VINF[1] * point[0]) - Math.log(_.reduce(
      _.times(props.M, (k) => Math.pow(
        RJ(point, k, props.delta, props.dataCritical), G[k] / 2 / Math.PI
      )),
      (a, b) => a * b
    ))
  )));
  return {
    V,
    CP,
    F1,
    F2,
    PSI,
  };
}
