import _ from 'lodash';

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
