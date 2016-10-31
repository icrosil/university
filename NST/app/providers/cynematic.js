/* eslint new-cap: 0 */
/* eslint no-undef: 0 */
/* eslint no-param-reassign: 0 */

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

const getDefaultPositions = (defaultPoints, maxLength, M) => {
  if (M < 4) {
    console.error('M should not be less than 4!');
    return null;
  }
  // Make them on line
  const result = _.sortBy([...defaultPoints, ...(
    _.times(M - 4, (index) => ((index + 1) / (M - 3)) * maxLength))]
  );
  return _.map(defaultPoints, (point) => _.sortedIndex(result, point));
};

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
export function RJP(point, pointB, delta) {
  return Math.max(
    delta,
    Math.sqrt(
      Math.pow((point[0] - pointB[0]), 2) +
      Math.pow((point[1] - pointB[1]), 2)
    )
  );
}
export function VJ(point, critical) {
  // const myEps = 0.001;
  // if (Math.abs(point[0] - critical[0]) < myEps && Math.abs(point[1] - critical[1]) < myEps) {
  //   return [0, 0];
  // }
  const cp1 = (critical[1] - point[1]);
  const pc0 = point[0] - critical[0];
  const pc1 = point[1] - critical[1];
  const result = [
    cp1 / ((2 * Math.PI) * (Math.pow(pc0, 2) + Math.pow(pc1, 2))) || 0,
    pc0 / ((2 * Math.PI) * (Math.pow(pc0, 2) + Math.pow(pc1, 2))) || 0,
  ];
  return result;
}
export function up(x, y, xp, yp, delta) {
  const xj = xp;
  const yj = yp;
  let distSq = ((x - xj) * (x - xj)) + ((y - yj) * (y - yj));
  distSq = Math.max(distSq, delta * delta);

  return (1 / (2 * Math.PI)) * ((yj - y) / distSq);
}
export function vp(x, y, xp, yp, delta) {
  const xj = xp;
  const yj = yp;
  let distSq = ((x - xj) * (x - xj)) + ((y - yj) * (y - yj));
  distSq = Math.max(distSq, delta * delta);

  return (1 / (2 * Math.PI)) * ((x - xj) / distSq);
}
export function VP(point1, point2, delta) {
  return [
    up(...point1, ...point2, delta), vp(...point1, ...point2, delta),
  ];
}
const f = (point, critical) => (
  Math.atan((point[1] - critical[1]) / (point[0] - critical[0])) / (2 * Math.PI)
);

const V = (point, G, { VINF, dataCritical: dCS, delta }, tails, tailsGamma) => {
  const result = Victor.fromArray(VINF);
  _.each(
    _.map(dCS, (dC, index) => _.map(VP(dC, point), (vj) => {
      const res = vj * G[index];
      return res;
    })),
    (vj) => {
      result.add(Victor.fromArray(vj));
    }
  );
  _.each(tails, (tail, p) => {
    _.each(tail, (tailPoint, i) => {
      if (i === (tailPoint.length - 1)) return;
      result.add(Victor.fromArray(
        _.map(VP(point, tailPoint, delta), (vP) => vP * tailsGamma[p][i]))
      );
    });
  });
  return result;
};

const intersect1 = (a, b, c, d) => {
  let a1 = a;
  let b1 = b;
  let c1 = c;
  let d1 = d;
  if (a > b) [a1, b1] = [b1, a1];
  if (c > d) [c1, d1] = [d1, c1];
  return Math.max(a1, c1) < Math.min(b1, d1);
};

const area = (a, b, c) => (
  ((b.x - a.x) * (c.y - a.y)) - ((b.y - a.y) * (c.x - a.x))
);

const intersect = (a, b, c, d) => {
  const i1 = intersect1(a.x, b.x, c.x, d.x);
  const i2 = intersect1(a.y, b.y, c.y, d.y);
  const a1 = area(a, b, c) * area(a, b, d) < 0;
  const a2 = area(c, d, a) * area(c, d, b) < 0;
  return i1 && i2 && a1 && a2;
};

const Gpoint = (G, Gprev, j, timeDelta) => ((G[j] - Gprev[j]) / (timeDelta));
const Gipoint = (gPoint, timeDelta) => (gPoint / timeDelta);
const DJ = (G, Gprev, j, timeDelta, point1, point2) => {
  const sum = _.sum(_.map(_.take(G, j + 1), (tG, k) => {
    return Gpoint(G, Gprev, k, timeDelta);
  }));
  const vi = new Victor(point2[0] - point1[0], point2[1] - point1[1]);
  return new Victor(sum, sum).multiply(vi);
};
const dfid = (point, G, Gprev, dataCriticals, timeDelta, props) => {
  let res = _.map(_.initial(dataCriticals), (dC, j) => {
    const res1 = DJ(G, Gprev, j, timeDelta, dC, dataCriticals[j + 1])
      .dot(Victor.fromArray(VJ(point, dC)));
    return res1;
  });
  res = _.sum(res);
  return res;
};
const dfic = (point, tails, tailsGamma) => (
  _.sum(_.map(tails, (tailArray, p) => _.sum(_.map(tailArray, (tail, j) => (
    tailsGamma[p][j] * f(point, tail)
  )))))
);
const dfic2 = (point, tails, tailsGamma, props) => {
  const sum = _.map(tailsGamma, (vixr, p) => {
    const sum1 = _.map(_.initial(vixr), (tG, j) => {
      const sum2 = _.sum(_.take(vixr, j + 1)) / 2 / Math.PI / Math.pow(RJP(point, tails[p][j], props.delta), 2);
      return sum2 * (((tails[p][j + 1][1] - tails[p][j][1]) * (point[0] - tails[p][j][0])) - ((tails[p][j + 1][0] - tails[p][j][0]) * (point[1] - tails[p][j][1])));
    });
    return _.sum(sum1);
  });
  return _.sum(sum);
};
const dficMy = (tails, tailsGamma, point, G, props, timeDelta, defaultAPoints) => {
  const res = _.map(tailsGamma, (vixr, p) => {
    const mapped = _.map(vixr, (tG, j) => {
      return tG * Victor.fromArray(
        VP(point, tails[p][j], props.delta)
      ).dot(
        V(tails[p][j], G, props, tails, tailsGamma)
      );
    });
    return _.sum(mapped);
  });
  const gPoint = _.map(tailsGamma, (vixr, p) => {
    const g1 = Gipoint(_.last(vixr), timeDelta);
    const pointNP = _.last(tails[p]);
    const pointDef = defaultAPoints[p];
    const v1 = Victor.fromArray(VP(point, pointNP, props.delta));
    const xp1 = new Victor(pointNP[0] - pointDef[0], pointNP[1] - pointDef[1]);
    const dot = xp1.dot(v1);
    return g1 * dot;
  });
  const sum = -_.sum(res) + _.sum(gPoint);
  return sum;
};
const dfit = (point, G, Gprev, dataCriticals, timeDelta, tails, tailsGamma, props, defaultAPoints) => {
  if (!Gprev) return 0;
  const dfidV = dfid(point, G, Gprev, dataCriticals, timeDelta, props);
  const dficonvV = dficMy(tails, tailsGamma, point, G, props, timeDelta, defaultAPoints);
  const res = dfidV - dficonvV;
  return Math.abs(res);
};

const distance = (point, startLine, endLine) => (
  Math.abs(
    ((endLine.y - startLine.y) * point.x) -
    (((endLine.x - startLine.x) * point.y) +
    ((endLine.x * startLine.y) - (endLine.y * startLine.x)))
  ) / Math.sqrt(
    Math.pow((endLine.y - startLine.y), 2) +
    Math.pow((endLine.x - startLine.x), 2)
  )
);

// Looks correct
export function calculateAll(props) {
  let { tails, tailsGamma } = props;
  const Gprev = props.G;
  const n = _.map(props.dataCenters, (value, index) => [
    -(props.dataCritical[index + 1][1] - props.dataCritical[index][1]) /
      getSqrt(index, props.dataCritical),
    (props.dataCritical[index + 1][0] - props.dataCritical[index][0]) /
      getSqrt(index, props.dataCritical),
  ]);
  const tailsOnLine = getDefaultPositions(props.defaultPoints, props.maxLength, props.M);
  const defaultAPoints = transformNumberToPoint(props.defaultPoints, props.maxLength, props.smalls);
  const systemA = _.times(props.M - 1, (k) => _.times(props.M, (j) => (
    Victor.fromArray(VJ(props.dataCenters[k], props.dataCritical[j])).dot(Victor.fromArray(n[k]))
  )));
  systemA.push(_.times(props.M, _.constant(1)));
  const systemB = _.times(props.M - 1, (k) => (
    -Victor.fromArray(props.VINF).dot(Victor.fromArray(n[k])) -
    _.sum(_.map(
      tailsGamma, (vixr, p) => {
        const sum = _.sum(_.map(vixr, (gamma, i) => (new Victor(gamma, gamma)
            .multiply(Victor.fromArray(VP(props.dataCenters[k],
              tails[p][i], props.delta))))
            .dot(Victor.fromArray(n[k]))
        ));
        return sum;
      }))
    )
  );
  systemB.push(props.G0 - _.sum(_.map(tailsGamma, (gammas) => {
    const sum = _.sum(gammas);
    return sum;
  })));
  const G = linear.solve(systemA, systemB);
  const controlPoints = transformNumberToPoint(props.defaultPoints, props.maxLength, props.smalls);
  const wMax = _.max([
    0, ..._.map(
      controlPoints, (point) => V(point, G, props, tails, tailsGamma).length()),
  ]);
  const timeDelta = (3 * props.delta) / wMax;
  const speed = _.map(props.net, (val) => _.map(val, (point) =>
    _.map(props.VINF, (vinf, l) => vinf + (_.sum(_.times(props.M, (k) => G[k] *
      VJ(point, props.dataCritical[k])[l])) || 0) +
      (_.sum(_.map(tailsGamma, (vixr, p) => _.sum(_.map(vixr, (gamma, i1) =>
        (new Victor(gamma, gamma)
        .multiply(Victor.fromArray(VP(point, tails[p][i1], props.delta))))
        .toArray()[l]
      )))) || 0))
  ));

  tailsGamma = _.each(tailsGamma, (tG, tailIndex) => {
    tG.push(G[tailsOnLine[tailIndex]]);
  });
  tails = _.each(tails, (tail, tailIndex) => {
    tail.push(defaultAPoints[tailIndex]);
  });
  for (let tail = 0; tail < tails.length; tail++) {
    for (let i = 0; i < tails[tail].length - 1; i++) {
      const s = Victor.fromArray(tails[tail][i]);
      const fPoint = (new Victor(0, 0));
      fPoint.add(s);
      const someV = V(s.toArray(), G, props, tails, tailsGamma);
      fPoint.add(someV.multiply(new Victor(timeDelta, timeDelta)));
      if (intersect(s, fPoint,
            Victor.fromArray(defaultAPoints[0]), Victor.fromArray(defaultAPoints[1]))) {
        const toAdd = 2 * (defaultAPoints[0][0] - fPoint.x);
        fPoint.x -= toAdd;
      } else if (intersect(s, fPoint,
            Victor.fromArray(defaultAPoints[1]), Victor.fromArray(defaultAPoints[2]))) {
        const normal = new Victor(defaultAPoints[1][1] - defaultAPoints[2][1],
            defaultAPoints[2][0] - defaultAPoints[1][0]);
        const pointSmall = new Victor(fPoint.x - s.x, fPoint.y - s.y);
        const multiplend = 2 * pointSmall.dot(normal);
        const reflected = pointSmall.subtract(
            (new Victor(multiplend, multiplend)).multiply(normal));
        fPoint.add(reflected);
      } else if (intersect(s, fPoint,
            Victor.fromArray(defaultAPoints[2]), Victor.fromArray(defaultAPoints[3]))) {
        fPoint.x += 2 * (defaultAPoints[2][0] - fPoint.x);
      }
      const doubleDelta = props.delta * 2;
      if (fPoint.y <= defaultAPoints[0][1] && fPoint.y >= defaultAPoints[1][1] &&
          Math.abs(fPoint.x - defaultAPoints[0][0]) < doubleDelta) {
        if (fPoint.x < defaultAPoints[0][0]) {
          fPoint.x = defaultAPoints[0][0] - doubleDelta;
        } else {
          fPoint.x = defaultAPoints[0][0] + doubleDelta;
        }
      } else if (fPoint.y <= defaultAPoints[2][1] && fPoint.y >= defaultAPoints[3][1] &&
            Math.abs(fPoint.x - defaultAPoints[2][0]) < doubleDelta) {
        if (fPoint.x < defaultAPoints[2][0]) {
          fPoint.x = defaultAPoints[2][0] - doubleDelta;
        } else {
          fPoint.x = defaultAPoints[2][0] + doubleDelta;
        }
      } else if (fPoint.x >= defaultAPoints[0][0] &&
          fPoint.x <= defaultAPoints[2][0] &&
          fPoint.y <= defaultAPoints[0][1] &&
          fPoint.y >= defaultAPoints[1][1] &&
          distance(fPoint, Victor.fromArray(defaultAPoints[1]),
            Victor.fromArray(defaultAPoints[2])) < doubleDelta) {
        const u = new Victor(fPoint.x - defaultAPoints[1][0],
            fPoint.y - defaultAPoints[1][1]);
        const v = new Victor(defaultAPoints[2][0] - defaultAPoints[1][0],
            defaultAPoints[2][1] - defaultAPoints[1][1]);
        const a1 = u.dot(v.norm());
        const projection = (new Victor(a1, a1).multiply(v))
            .add(Victor.fromArray(defaultAPoints[1]));
        if (fPoint.x <= projection.x) {
            // norm is -1 1, cos45 is 1/2 so 2 delta is delta -x + y
          fPoint.x = projection.x - props.delta;
          fPoint.y = projection.y + props.delta;
        } else {
          fPoint.x = projection.x + props.delta;
          fPoint.y = projection.y - props.delta;
        }
      }
      tails[tail][i] = fPoint.toArray();
    }
    const s = tails[tail][tails[tail].length - 1];
    const fPoint = (new Victor(0, 0)).add(Victor.fromArray(s)).add(
        V(s, G, props, tails, tailsGamma).multiply(new Victor(timeDelta, timeDelta)));
    tails[tail][tails[tail].length - 1] = fPoint.toArray();
  }
  const CP = props.show === 'CP' ? _.map(props.net, (val, i) => _.map(val, (point, j) => {
    const res = 1 - (Victor.fromArray(speed[i][j]).length() /
      Victor.fromArray(props.VINF).length()) -
    ((2 * dfit(point, G, Gprev, props.dataCritical, timeDelta, tails, tailsGamma, props, defaultAPoints))
      / Victor.fromArray(props.VINF).length());
    return res;
  })) : [];
  const F1 = props.show === 'F1' ? _.map(props.net, (val) => _.map(val, (point) => (
    Victor.fromArray(props.VINF).dot(Victor.fromArray(point)) + (_.sum(
      _.times(props.M, (k) => G[k] * f(point, props.dataCritical[k]))
    ) || 0) +
    dfic(point, tails, tailsGamma)
  ))) : [];
  const F2 = props.show === 'F2' ? _.map(props.net, (val) => _.map(val, (point) => (
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
    )))) + (props.G0 * f(point, props.dataCritical[props.M - 1])) +
    dfic2(point, tails, tailsGamma, props)
  ))) : [];
  const PSI = props.show === 'PSI' ? _.map(props.net, (val) => _.map(val, (point) => {
    const res2 = (props.VINF[0] * point[1]) - (props.VINF[1] * point[0]) - Math.log(_.reduce(
      _.times(props.M, (k) => Math.pow(
        RJ(point, k, props.delta, props.dataCritical), G[k] / 2 / Math.PI
      )),
      (a, b) => a * b
    )) - (Math.log(_.reduce(
      _.map(tails, (tail, p) => {
        const res = _.reduce(_.map(tail, (pointTail, j) => {
          const res1 = Math.pow(RJP(point, pointTail, props.delta), tailsGamma[p][j] / 2 / Math.PI);
          return res1;
        }), (a, b) => a * b) || 1;
        return res;
      }),
      (a, b) => a * b
    )) || 0);
    return res2;
  })) : [];

  return {
    V: speed,
    CP,
    F1,
    F2,
    PSI,
    T: props.T + timeDelta,
    tails,
    tailsGamma,
    G,
  };
}
